"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_js_1 = require("./server/index.js");
const eventbus_js_1 = require("./lib/eventbus.js");
const alpacaDataProvider_js_1 = require("./lib/alpacaDataProvider.js");
const eventBus = new eventbus_js_1.EventBus();
async function strategy() {
    console.log('thinging');
    const r = await (0, alpacaDataProvider_js_1.getBarsLatest)('AAPL,TSLA');
    console.log(r);
}
eventBus.subscribe('tick', strategy);
console.log(eventBus.getEventTypes());
eventBus.publish('tick', { tick: 1 });
index_js_1.app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
