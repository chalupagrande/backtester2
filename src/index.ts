import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index';
import { BacktestExecutionProvider } from './lib/backtesting/BacktestExecutionProvider';
import { EventBus } from './lib/EventBus';
import { BacktestAlgorithmRunner } from './lib/backtesting/BacktestAlgorithmRunner';
import { EVENT_TYPES } from './lib/utils/constants';
import { Event } from './lib/Event';
import { AlpacaDataProvider } from './providers/alpacaDataProvider';
import { writeFile } from 'fs/promises';
import path from 'path';
import { DualSMAStrategy } from './strategies/DualSMAStrategy';
import AppleStockData from './data/AAPL-2023-1D.json';
import { Bar } from './lib/utils/types';
import testing from "./test"

const AAPLBars = AppleStockData.bars.AAPL
const AAPLTickEvents = AAPLBars.map((bar: Bar) => {
  return new Event(EVENT_TYPES.TICK, {
    data: bar
  }, new Date(bar.t))
})

const backtestEventBus = new EventBus();
const backtestExecutionProvider = new BacktestExecutionProvider({
  eventBus: backtestEventBus,
  initialCash: 10000,
})

const strategy = new DualSMAStrategy({
  eventBus: backtestEventBus,
  executionProvider: backtestExecutionProvider,
})

const backtestRunner = new BacktestAlgorithmRunner({
  strategy,
  eventBus: backtestEventBus,
  executionProvider: backtestExecutionProvider,
  events: AAPLTickEvents,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
})

backtestEventBus.subscribe(EVENT_TYPES.TICK, strategy.handleTick);

backtestRunner.start()
  .then(() => {
    console.log('Backtest completed');
    // console.log('Results:', backtestRunner.getResults());
  })

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
