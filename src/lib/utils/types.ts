import {
  EVENT_TYPES,
  ORDER_SIDE,
  ORDER_TYPE,
  ORDER_STATUS,
  DIRECTION,
  TIME_IN_FORCE
} from './constants';
import type { Order } from '../Order';
import type { Position } from '../Position';

export type EventType = keyof typeof EVENT_TYPES;
export type OrderType = keyof typeof ORDER_TYPE;
export type OrderSide = keyof typeof ORDER_SIDE;
export type OrderStatus = keyof typeof ORDER_STATUS;
export type Direction = keyof typeof DIRECTION;
export type TimeInForce = keyof typeof TIME_IN_FORCE;

export type GetOrderOptions = {
  status?: OrderStatus;
  limit?: number;
  after?: Date;
  until?: Date;
  side?: OrderSide;
  direction?: Direction
}

export type OrderOptions = {
  symbol: string,
  quantity: number,
  side: OrderSide,
  type: OrderType,
  limitPrice?: number,
  stopPrice?: number,
  trailPrice?: number,
  trailPercent?: number,
  timeInForce?: TimeInForce,
}

export type ExecutionProvider = {
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: (options: GetOrderOptions) => Promise<Order[]>;
  getPositions: () => Promise<Position[]>;
  closeAPosition: (symbol: string) => Promise<void>;
}

export type Strategy = {
  name: string
  description: string
  execute: (symbol: string, quantity: number) => Promise<void>;
}