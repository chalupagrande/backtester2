import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index';
import { EventBus } from './lib/EventBus';
import { getBarsLatest } from './lib/providers/alpacaDataProvider';
import { Portfolio } from './lib/Portfolio';
import { AlpacaExecutionProvider } from './lib/providers/alpacaExecutionProvider';

const eventBus = new EventBus();

async function strategy() {
  console.log('thinging');
  const r = await getBarsLatest('AAPL,TSLA');
  console.log(r);
}

const executionProvider = new AlpacaExecutionProvider()

eventBus.subscribe('tick', strategy)
console.log(eventBus.getEventTypes())
eventBus.publish('tick', { tick: 1 });
const portfolio = new Portfolio(10000, executionProvider)


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});