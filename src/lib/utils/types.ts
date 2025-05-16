import {
  EVENT_TYPES,
  ORDER_SIDE,
  ORDER_TYPE,
  ORDER_STATUS,
  SORT_DIRECTION,
  TIME_IN_FORCE
} from './constants';
import type { Order } from '@lib/Order';
import type { Position } from '@lib/Position';

type ObjectValues<T> = T[keyof T];

export type EventType = ObjectValues<typeof EVENT_TYPES>;
export type OrderType = ObjectValues<typeof ORDER_TYPE>;
export type OrderSide = ObjectValues<typeof ORDER_SIDE>;
export type OrderStatus = ObjectValues<typeof ORDER_STATUS>;
export type SortDirection = ObjectValues<typeof SORT_DIRECTION>;
export type TimeInForce = ObjectValues<typeof TIME_IN_FORCE>;



export type ExecutionProvider = {
  placeOrder: (order: Order) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>
  closeAPosition: (symbol: string) => Promise<void>;
}

export type PortfolioProvider = {
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: (options: any) => Promise<Order[]>;
  getPositions: () => Promise<Position[]>;
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