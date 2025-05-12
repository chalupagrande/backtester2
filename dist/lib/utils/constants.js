"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIRECTION = exports.TIME_IN_FORCE = exports.ORDER_STATUS = exports.ORDER_TYPE = exports.ORDER_SIDE = exports.EVENT_TYPES = void 0;
exports.EVENT_TYPES = {
    tick: 'tick',
    signal: 'signal',
    order_placed: 'order_placed',
    order_filled: 'order_filled',
    order_canceled: 'order_canceled',
};
exports.ORDER_SIDE = {
    buy: 'buy',
    sell: 'sell'
};
exports.ORDER_TYPE = {
    market: 'market',
    limit: 'limit',
    stop: 'stop',
    stop_limit: 'stop_limit',
    trailing_stop: 'trailing_stop',
};
exports.ORDER_STATUS = {
    new: 'new',
    filled: 'filled',
    partially_filled: 'partially_filled',
    canceled: 'canceled',
    rejected: 'rejected'
};
exports.TIME_IN_FORCE = {
    day: 'day',
    gtc: 'gtc',
    opg: 'opg',
    cls: 'cls',
    ioc: 'ioc',
    fok: 'fok',
};
exports.DIRECTION = {
    asc: 'asc',
    desc: 'desc',
};
