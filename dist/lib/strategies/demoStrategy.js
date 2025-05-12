"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoStrategy = DemoStrategy;
const alpacaDataProvider_1 = require("../providers/alpacaDataProvider");
async function DemoStrategy() {
    console.log('thinging');
    const r = await (0, alpacaDataProvider_1.getBarsLatest)('AAPL,TSLA');
    console.log(r);
}
