import {
  EVENT_TYPES,
  ORDER_SIDE,
  ORDER_TYPE,
  ORDER_STATUS
} from './constants';
import type { Order } from '../Order';
import type { Position } from '../Position';

export type EventType = keyof typeof EVENT_TYPES;
export type OrderType = keyof typeof ORDER_TYPE;
export type OrderSide = keyof typeof ORDER_SIDE;
export type OrderStatus = keyof typeof ORDER_STATUS;

export type ExecutionProvider = {
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: () => Promise<Order[]>;
  getPositions: () => Promise<Position[]>;
}