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


export type ExecutionProvider = {
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: (options: any) => Promise<Order[]>;
  getPositions: () => Promise<Position[]>;
  closeAPosition: (symbol: string) => Promise<void>;
}


export type Bar = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number
}