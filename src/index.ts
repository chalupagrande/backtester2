import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index';
import { DemoStrategy } from './strategies/demoStrategy';
import { BacktestExecutionProvider } from './lib/backtesting/BacktestExecutionProvider';
import { EventBus } from './lib/EventBus';
import { BacktestAlgorithmRunner } from './lib/backtesting/BacktestAlgorithmRunner';
import { EVENT_TYPES } from './lib/utils/constants';
import { Event } from './lib/Event';

import { AlpacaDataProvider } from './providers/alpacaDataProvider';
import { writeFile } from 'fs/promises';
import path from 'path';



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
