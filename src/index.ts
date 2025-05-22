import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index';
import { DemoStrategy } from './strategies/demoStrategy';
import { BacktestExecutionProvider } from './lib/backtesting/BacktestExecutionProvider';
import { EventBus } from './lib/EventBus';
import { BacktestPortfolioProvider } from './lib/backtesting/BacktestPortfolioProvider';
import { BacktestAlgorithmRunner } from './lib/backtesting/BacktestAlgorithmRunner';
import { EVENT_TYPES } from './lib/utils/constants';
import { Event } from './lib/Event';

import { AlpacaDataProvider } from './providers/alpacaDataProvider';
import { writeFile } from 'fs/promises';
import path from 'path';

const alapcaDataProvider = new AlpacaDataProvider();

async function run() {
  try {
    const bars = await alapcaDataProvider.getBars({
      symbols: 'AAPL',
      timeframe: '1Day',
      start: '2023-01-01',
      end: '2023-12-31'
    });

    const filePath = path.join(__dirname, '..', 'sample-tick-data.json');
    await writeFile(filePath, JSON.stringify(bars, null, 2), 'utf-8');
    console.log(`Successfully wrote bars data to ${filePath}`);
  } catch (error) {
    console.error('Error fetching or writing bars data:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Call the function
run().catch(err => {
  console.error('Fatal error in run function:', err);
  process.exit(1);
});

// Example of how to run a backtest
const runBacktest = async () => {
  const backtestEventBus = new EventBus();
  const backtestExecutionProvider = new BacktestExecutionProvider(backtestEventBus);
  const backtestPortfolioProvider = new BacktestPortfolioProvider(backtestEventBus, 100000);
  const initialContext = { last14Bars: [] };
  const backtestStrategy = new DemoStrategy<typeof initialContext>({
    initialContext: { last14Bars: [] },
    executionProvider: backtestExecutionProvider,
    portfolio: backtestPortfolioProvider,
    eventBus: backtestEventBus
  });

  backtestEventBus.subscribe(EVENT_TYPES.TICK, backtestStrategy.handleTick);
  backtestEventBus.subscribe(EVENT_TYPES.ORDER_FILLED, backtestStrategy.handleOrderFilled);

  // Example of creating events for backtest
  // In a real scenario, you would load these from a file or database
  const sampleEvents = [
    new Event(EVENT_TYPES.TICK, {
      symbol: 'AAPL',
      c: 150.0, h: 152.0, l: 149.0, o: 149.5,
      t: '2023-01-01T09:30:00Z', v: 10000, vw: 150.2, n: 100
    }, new Date('2023-01-01T09:30:00Z')),
    new Event(EVENT_TYPES.TICK, {
      symbol: 'AAPL',
      c: 151.0, h: 153.0, l: 150.0, o: 150.5,
      t: '2023-01-01T09:31:00Z', v: 12000, vw: 151.2, n: 120
    }, new Date('2023-01-01T09:31:00Z')),
    // Add more events as needed
  ];

  const backtest = new BacktestAlgorithmRunner({
    strategy: backtestStrategy,
    eventBus: backtestEventBus,
    executionProvider: backtestExecutionProvider,
    portfolioProvider: backtestPortfolioProvider,
    events: sampleEvents,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31')
  });

  await backtest.start();
  const results = backtest.getResults();
  console.log('Backtest results:', results);
};



// Uncomment to run the backtest
// runBacktest();
// runBacktestFromFile();






app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

//   ___ _  _ ___  
//  | __| \| |   \ 
//  | _|| .` | |) |
//  |___|_|\_|___/ 

// process.on('SIGTERM', async () => {
//   console.log('SIGTERM signal received: closing...');
//   await liveRunner.stop();
// });
