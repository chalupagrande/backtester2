import { AlgorithmRunner } from './AlgorithmRunner';
import { EVENT_TYPES } from '../utils/constants';
import { Event } from '../Event';
import { sortEventsByTimestamp } from '../utils/eventData';

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
    if (this.executionProvider && 'processPendingOrders' in this.executionProvider) {
      this.executionProvider.processPendingOrders(tickData);
    }
  }
  
  private calculateResults(): void {
    // Calculate performance metrics
    // This would be implemented based on your specific metrics
    this.results = {
      totalReturn: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      // etc.
    };
  }
}
