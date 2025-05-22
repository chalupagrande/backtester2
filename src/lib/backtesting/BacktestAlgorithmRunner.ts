import { AlgorithmRunner } from '../AlgorithmRunner';
import { EVENT_TYPES } from '../utils/constants';
import { Event } from '../Event';
import { sortEventsByTimestamp } from '../utils/eventData';
import { EventLogger } from '../EventLogger';
import { EventBus } from '../EventBus';
import { Strategy } from '../Strategy';
import { ExecutionProvider } from '../ExecutionProvider';

export class BacktestAlgorithmRunner extends AlgorithmRunner {
  private events: Event<any>[] = [];
  private currentIndex: number = 0;
  private results: any = {};
  private startDate: Date;
  private endDate: Date;
  private eventLogger: EventLogger;

  constructor(options: {
    strategy: Strategy;
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
    events: Event<any>[];
    startDate?: Date;
    endDate?: Date;
  }) {
    super(options);
    this.events = sortEventsByTimestamp(options.events);
    this.startDate = options.startDate || new Date(0);
    this.endDate = options.endDate || new Date();

    // Initialize the event logger
    this.eventLogger = new EventLogger(this.eventBus, { logToConsole: true });

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

    // Emit backtest started event
    this.eventBus.emit(EVENT_TYPES.BACKTEST_STARTED, {
      startDate: this.startDate,
      endDate: this.endDate,
      eventsCount: this.events.length
    });

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

    // Emit backtest completed event
    this.eventBus.emit(EVENT_TYPES.BACKTEST_COMPLETED, {
      startDate: this.startDate,
      endDate: this.endDate,
      eventsProcessed: this.events.length
    });

    // Calculate final results
    this.calculateResults();
  }

  async stop(): Promise<void> {
    // Nothing to stop in backtesting
    this.currentIndex = this.events.length;
  }

  getResults(): any {
    return {
      ...this.results,
      eventLogs: this.eventLogger.getLogs()
    };
  }

  private async processOrders(tickData: any): Promise<void> {
    // Use the BacktestExecutionProvider to process orders
    const provider = this.executionProvider as any;
    if (provider && typeof provider.processPendingOrders === 'function') {
      provider.processPendingOrders(tickData);
    }
  }

  private calculateResults(): void {
    // Get performance metrics from the execution provider
    const provider = this.executionProvider as any;
    if (provider && typeof provider.getPerformanceMetrics === 'function') {
      this.results = provider.getPerformanceMetrics();
    } else {
      // Fallback to basic metrics if the execution provider doesn't support performance metrics
      this.results = {
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        message: "Execution provider doesn't support detailed performance metrics"
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
