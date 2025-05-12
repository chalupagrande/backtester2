"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = void 0;
const constants_1 = require("./utils/constants");
class Portfolio {
    buyingPower = 0;
    cash = 0;
    equity = 0;
    orders = [];
    positions = new Map();
    executionProvider;
    eventBus;
    constructor(investment, executionProvider, eventBus) {
        this.buyingPower = investment;
        this.cash = investment;
        this.executionProvider = executionProvider;
        this.eventBus = eventBus;
    }
    async placeOrder(order) {
        this.executionProvider.placeOrder(order);
        this.eventBus.publish(constants_1.EVENT_TYPES.order_placed, order);
    }
    async cancelOrder(orderId) {
        this.executionProvider.cancelOrder(orderId);
        this.eventBus.publish(constants_1.EVENT_TYPES.order_canceled, orderId);
    }
    async getOrder(orderId) {
        return this.executionProvider.getOrder(orderId);
    }
    async getOrders(options) {
        return this.executionProvider.getOrders(options);
    }
    async handleOrderFilled(event) {
        console.log("Order filled:", event.data);
        const order = event.data;
    }
}
exports.Portfolio = Portfolio;
