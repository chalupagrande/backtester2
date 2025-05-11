import {
  EVENT_TYPES,
  ORDER_SIDE,
  ORDER_TYPE,
  ORDER_STATUS,
  RUNNER_MODE
} from './constants';
import type { Order } from '../Order';
import type { Position } from '../Position';

export type EventType = keyof typeof EVENT_TYPES;
export type OrderType = keyof typeof ORDER_TYPE;
export type OrderSide = keyof typeof ORDER_SIDE;
export type OrderStatus = keyof typeof ORDER_STATUS;
export type RunnerMode = keyof typeof RUNNER_MODE

export type ExecutionProvider = {
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: () => Promise<Order[]>;
  getPositions: () => Promise<Position[]>;
}