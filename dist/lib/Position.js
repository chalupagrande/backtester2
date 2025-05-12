"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
class Position {
    symbol;
    quantity;
    averageEntryPrice;
    currentPrice;
    lastUpdated;
    constructor(symbol, quantity, averageEntryPrice, currentPrice) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.averageEntryPrice = averageEntryPrice;
        this.currentPrice = currentPrice;
        this.lastUpdated = new Date();
    }
    getMarketValue() {
        return this.quantity * this.currentPrice;
    }
    getUnrealizedPnL() {
        return (this.currentPrice - this.averageEntryPrice) * this.quantity;
    }
    getUnrealizedPnLPercentage() {
        return ((this.currentPrice - this.averageEntryPrice) / this.averageEntryPrice) * 100;
    }
    updateCurrentPrice(price) {
        this.currentPrice = price;
        this.lastUpdated = new Date();
    }
}
exports.Position = Position;
