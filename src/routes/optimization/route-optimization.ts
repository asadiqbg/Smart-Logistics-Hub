import { Injectable, Logger } from '@nestjs/common';
import { calculateDistance } from 'src/common/utils/calculate-distance';
import { Driver } from 'src/database/entities/driver.entity';
import { Order } from 'src/database/entities/order.entity';
import { DriverService } from 'src/driver/driver.service';
import { OrdersService } from 'src/orders/orders.service';

export interface OptimizedOrder extends Order {
  travelTimeMinutes: number; // Time from previous stop/depot to this order's location
}

export interface OptimizationResult {
  driverId: string;
  orders: OptimizedOrder[];
  totalDistance: number;
  totalDuration: number;
  sequence: number[];
}

@Injectable()
export class OptimizationService {
  private readonly logger = new Logger(OptimizationService.name);

  constructor(
    private orderService: OrdersService,
    private driverService: DriverService,
  ) { }
  //nearest neighbour algorithm
  //this is greedy, it makes the locally optimal choice
  async optimizeRoutesNearestNeighbor(
    tenantId: string,
    orderIds: string[],
  ): Promise<OptimizationResult[]> {

    if (!this.orderService) {
      this.logger.error('OrdersService is not injected!');
    }
    //first find the orders that are pending and drivers that are available
    const orders = await this.orderService.findPendingById(tenantId, orderIds);
    const drivers = await this.driverService.findAvailableDrivers(tenantId);

    //if no drivers found return []
    if (!drivers) {
      this.logger.warn('No available drivers');
      return [];
    }

    //initialize empty results array
    const results: OptimizationResult[] = [];
    //make a copy of orders
    const unassignedOrders = [...orders];

    //loop through each driver and assign them the orders that are closest to them i.e
    //buildRouteForDriver(driver,unassignedOrders) , assigns the order and return the sequence of assigned orders,
    //totalDistance and totalDuration.
    for (const driver of drivers) {
      if (unassignedOrders.length === 0) break;

      const route = this.buildRouteForDriver(driver, unassignedOrders);
      if (route.orders.length > 0) {
        results.push(route);

        //once we have found the route for a driver
        //splice the indexes of the assigned orders from the original unassignedorders array
        route.orders.forEach((order) => {
          const index = unassignedOrders.findIndex((o) => o.id === order.id);
          if (index > -1) unassignedOrders.splice(index, 1);
        });
      }
    }
    return results;
  }
  private distanceToTimeMinutes(distanceKm: number): number {
    const averageSpeedKph = 40; // Assuming 40 km/h average for delivery routes
    return (distanceKm / averageSpeedKph) * 60;
  }
  // this is our nearest neighbour algorithm
  // it takes a driver and remaining unassigned orders and assign those orders
  // to the driver in a greedy approach
  private buildRouteForDriver(
    driver: Driver,
    availabeOrders: Order[],
  ): OptimizationResult {
    const route: OptimizedOrder[] = []; // assigned orders for the driver
    const sequence: number[] = []; //order delivery sequence
    let currentLocation = driver.currentLocation;
    let totalDistance = 0; //total distance covered
    let totalDuration = 0; //total duration
    let remainingCapacity = driver.capacityKg; //remaining capacity of driver
    //if we cant get the currentLocation of the driver return
    if (!currentLocation) {
      return {
        driverId: driver.id,
        orders: [],
        totalDistance: 0,
        totalDuration: 0,
        sequence: [],
      };
    }
    //make a copy of the unassigned order
    const unvisited = [...availabeOrders];

    //TODO: fix the distance algorithm, the distance is showing very large in api response

    //loop until all orders are assigned
    //if no valid orders to assign break and return
    while (unvisited.length > 0) {
      //nearest order among all availabeOrders
      let nearestOrder: Order | null = null;
      let nearestDistance = Infinity;
      let nearestIndex = -1;
      //loop among all availabeOrders and find the nearest one
      for (let i = 0; i < unvisited.length; i++) {
        const order = unvisited[i];
        if (order.weightKg > remainingCapacity) break;
        const distance = calculateDistance(
          currentLocation,
          order.pickupLocation,
        );
        if (distance < nearestDistance) {
          ((nearestDistance = distance), (nearestOrder = order));
          nearestIndex = i;
        }
      }

      //if no order to assign break the outer loop
      if (!nearestOrder) break;
      const travelTimeMinutes = this.distanceToTimeMinutes(nearestDistance);
      (nearestOrder as OptimizedOrder).travelTimeMinutes = travelTimeMinutes;
      //push the nearest order
      route.push(nearestOrder as OptimizedOrder);
      //record the sequence for the original availabeOrders array
      sequence.push(nearestIndex);
      // add distance from driver currentLocation to order.pickupLocation
      totalDistance += nearestDistance;
      //add distance form order.pickupLocation to order.deliveryLocation
      totalDistance += calculateDistance(
        nearestOrder.pickupLocation,
        nearestOrder.deliveryLocation,
      );
      //add total duration ,if none, set to 40
      totalDuration += nearestOrder.estimatedDurationMinutes || 40;
      //subtract the order weightKg from remainingCapacity
      remainingCapacity -= nearestOrder.weightKg;
      //update driver currentLocation to order.deliveryLocation
      //so we assign the driver from there onwards
      currentLocation = nearestOrder.deliveryLocation;
      //remove the order from unvisited orders
      unvisited.splice(nearestIndex, 1);
    }
    return {
      driverId: driver.id,
      orders: route,
      totalDistance,
      totalDuration,
      sequence,
    };
  }
}
