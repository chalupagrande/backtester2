"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarsLatest = getBarsLatest;
const fetchClient_1 = require("../utils/fetchClient");
const dataClient = new fetchClient_1.FetchClient('https://data.alpaca.markets/v2');
async function getBarsLatest(symbols) {
    try {
        const response = await dataClient.request("/stocks/bars/latest", {
            method: 'GET',
            params: {
                symbols
            },
        });
        return await response.json();
    }
    catch (err) {
        console.log(err);
    }
}
