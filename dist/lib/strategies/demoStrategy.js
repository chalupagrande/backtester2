"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStrategy = void 0;
const Order_1 = require("../Order");
const alpacaDataProvider_1 = require("../providers/alpacaDataProvider");
const Strategy_1 = require("../Strategy");
class DemoStrategy extends Strategy_1.Strategy {
    portfolio;
    constructor(portfolio) {
        super('Demo Strategy', 'A demo strategy that fetches the latest bars from Alpaca.');
        this.portfolio = portfolio;
    }
    async handleTick(event) {
        console.log('Executing Demo Strategy...', event);
        const symbols = 'AAPL,MSFT,GOOGL';
        const data = await (0, alpacaDataProvider_1.getBarsLatest)(symbols);
        console.log('Latest bars data:', data);
        const order = new Order_1.Order({
            symbol: 'AAPL',
            quantity: 1,
            side: 'buy',
            type: 'market',
            timeInForce: 'gtc',
        });
        console.log("Portfolio", this.portfolio);
        await this.portfolio.placeOrder(order);
    }
    async handleOrder(order) {
        console.log('Handling order:', order);
        // Implement your order handling logic here
    }
}
exports.DemoStrategy = DemoStrategy;
