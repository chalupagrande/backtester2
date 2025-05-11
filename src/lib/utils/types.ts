import {
  EVENT_TYPES,
  ORDER_SIDE,
  ORDER_TYPE,
  ORDER_STATUS
} from '../constants';

export type EventType = keyof typeof EVENT_TYPES;
export type OrderType = keyof typeof ORDER_TYPE;
export type OrderSide = keyof typeof ORDER_SIDE;
export type OrderStatus = keyof typeof ORDER_STATUS;