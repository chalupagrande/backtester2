import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index';
import WebSocket from 'ws'
import { EventBus } from './lib/EventBus';
import { DemoStrategy } from './lib/strategies/demoStrategy';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';
import { AlpacaPortfolioProvider } from './lib/providers/alpacaPortfolioProvider';
import { AlpacaDataProvider } from './lib/providers/alpacaDataProvider';
import { BacktestExecutionProvider } from './lib/providers/backtestExecutionProvider';
import { BacktestPortfolioProvider } from './lib/providers/backtestPortfolioProvider';
import { LiveAlgorithmRunner } from './lib/runners/LiveAlgorithmRunner';
import { BacktestAlgorithmRunner } from './lib/runners/BacktestAlgorithmRunner';
import { quiverClient } from './lib/clients/quiverClient';
import { EVENT_TYPES, ORDER_SIDE, ORDER_TYPE, TIME_IN_FORCE } from './lib/utils/constants';
import type { Bar } from './lib/utils/types';
import { Order } from './lib/Order';
import type { Order as TOrder } from './lib/Order';
import { Event } from './lib/Event';
import { CronJob } from 'cron';


type InitialContextType = {
  last14Bars: Bar[];
}

const alpacaDataProvider = new AlpacaDataProvider();
const initialContext: InitialContextType = { last14Bars: [] }
const eventBus = new EventBus();
const portfolio = new AlpacaPortfolioProvider()
const executionProvider = new AlpacaExecutionProvider()
const strategy = new DemoStrategy<InitialContextType>({ initialContext, executionProvider, portfolio, eventBus });
eventBus.subscribe(EVENT_TYPES.TICK, strategy.handleTick)
eventBus.subscribe(EVENT_TYPES.ORDER_FILLED, strategy.handleOrderFilled)

// Create a live algorithm runner
const liveRunner = new LiveAlgorithmRunner({
  strategy,
  eventBus,
  executionProvider,
  portfolioProvider: portfolio
});

// Example of how to run a backtest
const runBacktest = async () => {
  const backtestEventBus = new EventBus();
  const backtestExecutionProvider = new BacktestExecutionProvider();
  const backtestPortfolioProvider = new BacktestPortfolioProvider();
  const backtestStrategy = new DemoStrategy<InitialContextType>({
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

// Example of loading event data from a file and running a backtest
const runBacktestFromFile = async () => {
  const backtestEventBus = new EventBus();
  const backtestExecutionProvider = new BacktestExecutionProvider();
  const backtestPortfolioProvider = new BacktestPortfolioProvider();
  const backtestStrategy = new DemoStrategy<InitialContextType>({
    initialContext: { last14Bars: [] },
    executionProvider: backtestExecutionProvider,
    portfolio: backtestPortfolioProvider,
    eventBus: backtestEventBus
  });
  
  backtestEventBus.subscribe(EVENT_TYPES.TICK, backtestStrategy.handleTick);
  backtestEventBus.subscribe(EVENT_TYPES.ORDER_FILLED, backtestStrategy.handleOrderFilled);
  
  // Load events from a JSON file
  const { loadEventDataFromFile } = require('./lib/utils/eventData');
  const events = await loadEventDataFromFile('./src/lib/utils/sampleEventData.json');
  
  const backtest = new BacktestAlgorithmRunner({
    strategy: backtestStrategy,
    eventBus: backtestEventBus,
    executionProvider: backtestExecutionProvider,
    portfolioProvider: backtestPortfolioProvider,
    events: events,
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


//   ___   _ _____ _    
//  |   \ /_\_   _/_\  
//  | |) / _ \| |/ _ \ 
//  |___/_/ \_\_/_/ \_\ 
//   _____ ___    _   ___  ___   _   _ ___ ___   _ _____ ___ ___ 
//  |_   _| _ \  /_\ |   \| __| | | | | _ \   \ /_\_   _| __/ __|
//    | | |   / / _ \| |) | _|  | |_| |  _/ |) / _ \| | | _|\__ \
//    |_| |_|_\/_/ \_\___/|___|  \___/|_| |___/_/ \_\_| |___|___/

// Start the live runner when needed
// liveRunner.start().catch(err => console.error('Error starting live runner:', err));

// To stop the live runner
// process.on('SIGINT', async () => {
//   console.log('Stopping live runner...');
//   await liveRunner.stop();
//   process.exit(0);
// });


//    ___ ___  _  _  ___ ___ ___ ___ ___ 
//   / __/ _ \| \| |/ __| _ \ __/ __/ __|
//  | (_| (_) | .` | (_ |   / _|\__ \__ \
//   \___\___/|_|\_|\___|_|_\___|___/___/


const job = new CronJob('* * * * *', async () => {
  console.log('Running Quiver Data Fetch Job');
  const response = await quiverClient.request("/bulk/congresstrading", {
    params: {
      page_size: 20,
      normalized: false
    }
  })

  console.log('Quiver Data:', response.status, await response.json());
}, null, true, "America/Chicago")

// job.start()


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
