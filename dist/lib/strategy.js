"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
class Strategy {
    name;
    description;
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    async execute() {
        throw new Error('Method not implemented.');
    }
}
exports.Strategy = Strategy;
