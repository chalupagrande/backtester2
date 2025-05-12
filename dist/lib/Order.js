"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const constants_1 = require("./utils/constants");
class Order {
    id;
    symbol;
    quantity;
    side;
    type;
    status;
    timeInForce;
    limitPrice;
    stopPrice;
    filledQuantity;
    averageFilledPrice;
    createdAt;
    updatedAt;
    trailPrice;
    trailPercent;
    notes;
    constructor(symbol, quantity, side, type, limitPrice, stopPrice, trailPrice, trailPercent) {
        this.id = Math.random().toString(36).substring(7);
        this.symbol = symbol;
        this.quantity = quantity;
        this.side = side;
        this.type = type;
        this.status = constants_1.ORDER_STATUS.new;
        this.timeInForce = constants_1.TIME_IN_FORCE.day;
        this.limitPrice = limitPrice;
        this.stopPrice = stopPrice;
        this.filledQuantity = 0;
        this.averageFilledPrice = 0;
        this.trailPrice = trailPrice;
        this.trailPercent = trailPercent;
        this.notes = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.Order = Order;
