"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpacaExecutionProvider = void 0;
const fetchClient_1 = require("../utils/fetchClient");
const executionClient = new fetchClient_1.FetchClient('https://paper-api.alpaca.markets/v2');
class AlpacaExecutionProvider {
    client;
    constructor() {
        this.client = executionClient;
    }
    async placeOrder(order) {
        try {
            const response = await this.client.request("/orders", {
                method: 'POST',
                body: JSON.stringify({
                    symbol: order.symbol,
                    side: order.side,
                    qty: order.quantity,
                    type: order.type,
                    time_in_force: order.timeInForce,
                    limit_price: order.limitPrice,
                    stop_price: order.stopPrice,
                    trail_price: order.trailPrice,
                    trail_percent: order.trailPercent,
                }),
            });
            return await response.json();
        }
        catch (err) {
            console.log(err);
        }
    }
    async cancelOrder(orderId) {
        try {
            const response = await this.client.request(`/orders/${orderId}`, {
                method: 'DELETE',
            });
            return await response.json();
        }
        catch (err) {
            console.log(err);
        }
    }
    async getOrder(orderId) {
        try {
            const response = await this.client.request(`/orders/${orderId}`, {
                method: 'GET',
            });
            return await response.json();
        }
        catch (err) {
            console.log(err);
        }
    }
    async getOrders(options) {
        try {
            let params = {};
            for (const key in options) {
                if (options[key] !== undefined) {
                    params[key] = options[key];
                }
            }
            const response = await this.client.request("/orders", {
                method: 'GET',
                params: params
            });
            return await response.json();
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.AlpacaExecutionProvider = AlpacaExecutionProvider;
