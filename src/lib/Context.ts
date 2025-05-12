import { EventBus } from "./EventBus"
import { EVENT_TYPES } from "./utils/constants"

export class Context<T> {
  private ctx: T
  private lastUpdated: Date
  private eventBus: EventBus

  constructor(ctx: T, eventBus: EventBus) {
    this.ctx = ctx
    this.update = this.update.bind(this)
    this.eventBus = eventBus
    this.lastUpdated = new Date()
  }

  async update(ctx: Partial<T>) {
    const newCtx = { ...this.ctx, ...ctx }
    this.ctx = newCtx
    this.lastUpdated = new Date()
    this.eventBus.emit(EVENT_TYPES.context_updated, newCtx)
  }

  async get() {
    return { ctx: this.ctx, lastUpdated: this.lastUpdated }
  }
}