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
    constructor(options) {
        this.id = Math.random().toString(36).substring(7);
        this.symbol = options.symbol;
        this.quantity = options.quantity;
        this.side = options.side;
        this.type = options.type;
        this.status = constants_1.ORDER_STATUS.new;
        this.timeInForce = constants_1.TIME_IN_FORCE.day;
        this.limitPrice = options.limitPrice;
        this.stopPrice = options.stopPrice;
        this.filledQuantity = 0;
        this.averageFilledPrice = 0;
        this.trailPrice = options.trailPrice;
        this.trailPercent = options.trailPercent;
        this.notes = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.Order = Order;
