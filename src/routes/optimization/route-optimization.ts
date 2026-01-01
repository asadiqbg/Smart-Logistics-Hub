import { Logger } from "@nestjs/common";
import { unsubscribe } from "diagnostics_channel";
import { calculateDistance } from "src/common/utils/calculate-distance";
import { Driver } from "src/database/entities/driver.entity";
import { Order } from "src/database/entities/order.entity";
import { DriverService } from "src/driver/driver.service";
import { OrdersService } from "src/orders/orders.service";

interface OptimizationResult {
  driverId: string,
  orders: Order[],
  totalDistance: number,
  totalDuration: number,
  sequence: number[]
}

export class OptimizationService {
  private readonly logger = new Logger(OptimizationService.name)

  constructor(private orderService: OrdersService, private driverService: DriverService) {

  }
  // this is our nearest neighbour algorithm
  // it takes a driver and remaining unassigned orders and assign those orders
  // to the driver in a greedy approach
  private buildRouteForDriver(driver: Driver, availabeOrders: Order[]): OptimizationResult {

    const route: Order[] = [] // assigned orders for the driver
    const sequence: number[] = [] //order delivery sequence
    let currentLocation = driver.currentLocation
    let totalDistance = 0 //total distance covered
    let totalDuration = 0 //total duration
    let remainingCapacity = driver.capacityKg //remaining capacity of driver
    //if we cant get the currentLocation of the driver return 
    if (!currentLocation) {
      return {
        driverId: driver.id,
        orders: [],
        totalDistance: 0,
        totalDuration: 0,
        sequence: [],
      }
    }
    //make a copy of the unassigned order
    const unvisited = [...availabeOrders]

    //loop until all orders are assigned
    //if no valid orders to assign break and return
    while (unvisited.length > 0) {
      //nearest order among all availabeOrders
      let nearestOrder: Order | null = null
      let nearestDistance = Infinity
      let nearestIndex = -1
      //loop among all availabeOrders and find the nearest one
      for (let i = 0; i < unvisited.length; i++) {
        const order = unvisited[i];
        if (order.weightKg > remainingCapacity) break
        const distance = calculateDistance(currentLocation, order.pickupLocation)
        if (distance < nearestDistance) {
          nearestDistance = distance,
            nearestOrder = order
          nearestIndex = i
        }
      }
      //if no order to assign break the outer loop
      if (!nearestOrder) break
      //push the nearest order
      route.push(nearestOrder)
      //record the sequence for the original availabeOrders array
      sequence.push(nearestIndex)
      // add distance from driver currentLocation to order.pickupLocation
      totalDistance += nearestDistance
      //add distance form order.pickupLocation to order.deliveryLocation
      totalDistance += calculateDistance(nearestOrder.pickupLocation, nearestOrder.deliveryLocation)
      //add total duration ,if none, set to 40
      totalDuration += nearestOrder.estimatedDurationMinutes || 40
      //subtract the order weightKg from remainingCapacity
      remainingCapacity -= nearestOrder.weightKg
      //update driver currentLocation to order.deliveryLocation
      //so we assign the driver from there onwards
      currentLocation = nearestOrder.deliveryLocation
      //remove the order from unvisited orders
      unvisited.splice(nearestIndex, 1)
    }
    return {
      driverId: driver.id,
      orders: route,
      totalDistance,
      totalDuration,
      sequence
    }
  }
}
