import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../dto/update-order-status.dto';

export class OrderStateMachine {
  private static transitions: Record<string, string[]> = {
    [OrderStatus.PENDING]: [OrderStatus.ASSIGNED, OrderStatus.CANCELLED],
    [OrderStatus.ASSIGNED]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
    [OrderStatus.PICKED_UP]: [OrderStatus.IN_TRANSIT, OrderStatus.FAILED],
    [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED, OrderStatus.FAILED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.FAILED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  static validate(currentStatus: string, newStatus: string) {
    if (!this.transitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
