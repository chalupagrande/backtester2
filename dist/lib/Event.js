"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    type;
    timestamp;
    data;
    constructor(type, data, timestamp) {
        this.type = type;
        this.timestamp = timestamp || new Date();
        this.data = data;
    }
}
exports.Event = Event;
