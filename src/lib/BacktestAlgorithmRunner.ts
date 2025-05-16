import { AlgorithmRunner } from '@lib/AlgorithmRunner';
import { EVENT_TYPES } from '@lib/utils/constants';
import { Event } from '@lib/Event';
import { sortEventsByTimestamp } from '@lib/utils/eventData';

export class BacktestAlgorithmRunner extends AlgorithmRunner {
  private events: Event<any>[] = [];
  private currentIndex: number = 0;
  private results: any = {};
  private startDate: Date;
  private endDate: Date;

  constructor(options: {
    strategy: any;
    eventBus: any;
    executionProvider: any;
    portfolioProvider: any;
    events: Event<any>[];
    startDate?: Date;
    endDate?: Date;
  }) {
    super(options);
    this.events = sortEventsByTimestamp(options.events);
    this.startDate = options.startDate || new Date(0);
    this.endDate = options.endDate || new Date();

    // Filter events by date range if provided
    if (options.startDate || options.endDate) {
      this.events = this.events.filter(event =>
        event.timestamp >= this.startDate &&
        event.timestamp <= this.endDate
      );
    }
  }

  async start(): Promise<void> {
    console.log(`Starting backtest with ${this.events.length} events`);

    // Run through each event
    for (this.currentIndex = 0; this.currentIndex < this.events.length; this.currentIndex++) {
      const event = this.events[this.currentIndex];

      // Emit the event to the event bus
      this.eventBus.emit(event.type, event.data);

      // If this is a tick event, process any pending orders
      if (event.type === EVENT_TYPES.TICK) {
        await this.processOrders(event.data);
      }
    }

    // Calculate final results
    this.calculateResults();
  }

  async stop(): Promise<void> {
    // Nothing to stop in backtesting
    this.currentIndex = this.events.length;
  }

  getResults(): any {
    return this.results;
  }

  private async processOrders(tickData: any): Promise<void> {
    // Use the BacktestExecutionProvider to process orders
    const provider = this.executionProvider as any;
    if (provider && typeof provider.processPendingOrders === 'function') {
      provider.processPendingOrders(tickData);
    }
  }

  private calculateResults(): void {
    // Get performance metrics from the portfolio provider
    const provider = this.portfolioProvider as any;
    if (provider && typeof provider.getPerformanceMetrics === 'function') {
      this.results = provider.getPerformanceMetrics();
    } else {
      // Fallback to basic metrics if the portfolio provider doesn't support performance metrics
      this.results = {
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        message: "Portfolio provider doesn't support detailed performance metrics"
      };
    }

    // Add backtest metadata
    this.results.backtestInfo = {
      startDate: this.startDate,
      endDate: this.endDate,
      eventsProcessed: this.events.length,
      runDate: new Date()
    };
  }
}
