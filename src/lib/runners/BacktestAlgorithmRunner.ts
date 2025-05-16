import { AlgorithmRunner } from './AlgorithmRunner';
import { EVENT_TYPES } from '../utils/constants';
import { Event } from '../Event';
import { Bar } from '../utils/types';
import { AlpacaDataProvider } from '../providers/alpacaDataProvider';

export class BacktestAlgorithmRunner extends AlgorithmRunner {
  private historicalData: Bar[] = [];
  private currentIndex: number = 0;
  private startDate: Date;
  private endDate: Date;
  private symbols: string[];
  private results: any = {};
  private dataProvider: AlpacaDataProvider;
  
  constructor(options: {
    strategy: any;
    eventBus: any;
    executionProvider: any;
    portfolioProvider: any;
    startDate: Date;
    endDate: Date;
    symbols: string[];
    dataProvider?: AlpacaDataProvider;
  }) {
    super(options);
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.symbols = options.symbols;
    this.dataProvider = options.dataProvider || new AlpacaDataProvider();
  }
  
  async start(): Promise<void> {
    // Load historical data
    await this.loadHistoricalData();
    
    // Run through each bar
    for (this.currentIndex = 0; this.currentIndex < this.historicalData.length; this.currentIndex++) {
      const bar = this.historicalData[this.currentIndex];
      
      // Emit tick event
      const tickEvent = new Event(EVENT_TYPES.TICK, bar);
      this.eventBus.emit(EVENT_TYPES.TICK, tickEvent);
      
      // Process any orders that would have been filled at this price
      await this.processOrders(bar);
    }
    
    // Calculate final results
    this.calculateResults();
  }
  
  async stop(): Promise<void> {
    // Nothing to stop in backtesting
    this.currentIndex = this.historicalData.length;
  }
  
  getResults(): any {
    return this.results;
  }
  
  private async loadHistoricalData(): Promise<void> {
    // Format dates for API
    const startStr = this.startDate.toISOString().split('T')[0];
    const endStr = this.endDate.toISOString().split('T')[0];
    
    try {
      // Load data for each symbol
      for (const symbol of this.symbols) {
        const data = await this.dataProvider.getBars({
          symbols: symbol,
          timeframe: '1Day',
          start: startStr,
          end: endStr
        });
        
        if (data && data.bars && data.bars[symbol]) {
          // Add symbol to each bar for identification
          const symbolBars = data.bars[symbol].map((bar: Bar) => ({
            ...bar,
            symbol
          }));
          
          this.historicalData.push(...symbolBars);
        }
      }
      
      // Sort by timestamp
      this.historicalData.sort((a, b) => 
        new Date(a.t).getTime() - new Date(b.t).getTime()
      );
      
      console.log(`Loaded ${this.historicalData.length} bars for backtest`);
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  }
  
  private async processOrders(bar: Bar): Promise<void> {
    // This is a simplified simulation
    // In a real implementation, you would:
    // 1. Check for any open orders
    // 2. Determine if they would have been filled based on the bar's price range
    // 3. Emit ORDER_FILLED events for filled orders
    
    // For now, we'll just simulate that all orders are filled immediately
    // at the current bar's price
    
    // This would be implemented based on your specific backtesting needs
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
