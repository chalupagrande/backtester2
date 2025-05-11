import dotenv from 'dotenv';
dotenv.config();
import { app } from './server/index.js';
import { EventBus } from './lib/eventbus.js';
import { getBarsLatest } from './lib/alpacaDataProvider.js';

const eventBus = new EventBus();

async function strategy() {
  console.log('thinging');
  const r = await getBarsLatest('AAPL,TSLA');
  console.log(r);
}

eventBus.subscribe('tick', strategy)
console.log(eventBus.getEventTypes())
eventBus.publish('tick', { tick: 1 });


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});