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
    // private updatePortfolio(order: Order): void {
    //   const position = this.positions.get(order.symbol);
    //   const isBuyOrder = order.side === ORDER_SIDE.buy;
    //   const orderQuantity = isBuyOrder ? order.quantity : -order.quantity;
    //   if (position) {
    //     const newQuantity = position.quantity + orderQuantity;
    //     if (newQuantity === 0) {
    //       // Position is closed, remove it from positions
    //       this.positions.delete(order.symbol);
    //     } else {
    //       // Update existing position
    //       if (isBuyOrder) {
    //         // For buy orders, update average entry price
    //         position.averageEntryPrice = (
    //           (position.averageEntryPrice * position.quantity) +
    //           (order.filledPrice * order.quantity)
    //         ) / (position.quantity + order.quantity);
    //       }
    //       position.quantity = newQuantity;
    //       position.currentPrice = order.filledPrice;
    //       position.lastUpdated = new Date();
    //     }
    //   } else {
    //     // Only create new position for buy orders
    //     if (isBuyOrder) {
    //       this.positions.set(
    //         order.symbol,
    //         new Position(
    //           order.symbol,
    //           order.quantity,
    //           order.filledPrice,
    //           order.filledPrice
    //         )
    //       );
    //     }
    //   }
    //   this.orders.push(order);
    // }
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
