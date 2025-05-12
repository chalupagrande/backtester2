"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestExecutionProvider = void 0;
class BacktestExecutionProvider {
    constructor() {
    }
    async placeOrder(order) {
    }
    async cancelOrder(orderId) {
        console.log("canceling order");
    }
    async getOrder(orderId) {
        console.log('get order');
        return null;
    }
    async getOrders() {
        console.log('getting orders');
        return [];
    }
    async getPositions() {
        console.log("getting positions");
        return [];
    }
}
exports.BacktestExecutionProvider = BacktestExecutionProvider;
