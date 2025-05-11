"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarsLatest = getBarsLatest;
const fetchClient_1 = require("./fetchClient");
const dataClient = (0, fetchClient_1.FetchClient)('https://data.alpaca.markets/v2');
async function getBarsLatest(symbol) {
    try {
        const response = await dataClient("/stocks/bars/latest", {
            method: 'GET',
            params: {
                symbols: symbol,
            },
        });
        return await response.json();
    }
    catch (err) {
        console.log(err);
    }
}
