import { writeFile } from 'fs/promises';
import { AlpacaDataProvider } from './src/providers/alpacaDataProvider';
import path from 'path';
import { CronJob } from 'cron';
import { quiverClient } from './src/clients/quiverClient';
import WebSocket from 'ws'


const alapcaDataProvider = new AlpacaDataProvider();

//    __     _      _      _                 
//   / _|___| |_ __| |_   | |__  __ _ _ _ ___
//  |  _/ -_)  _/ _| ' \  | '_ \/ _` | '_(_-<
//  |_| \___|\__\__|_||_| |_.__/\__,_|_| /__/

//fetch data from Alpaca API and write to file
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

job.start()


//  __      _____ ___ ___  ___   ___ _  _____ _____ ___ 
//  \ \    / / __| _ ) __|/ _ \ / __| |/ / __|_   _/ __|
//   \ \/\/ /| _|| _ \__ \ (_) | (__| ' <| _|  | | \__ \
//    \_/\_/ |___|___/___/\___/ \___|_|\_\___| |_| |___/


// const ws1 = new WebSocket("wss://paper-api.alpaca.markets/stream");
// ws1.on('open', () => {
//   console.log('Connected for Trade Updates');
//   // authenticate
//   ws1.send(JSON.stringify({
//     action: 'authenticate',
//     key: process.env.ALPACA_API_KEY_ID,
//     secret: process.env.ALPACA_API_SECRET
//   }));
// });

// ws1.on('message', (buffer: Buffer) => {
//   const messageData = JSON.parse(buffer.toString());
//   switch (messageData.stream) {
//     // TRADE UPDATES
//     case 'trade_updates': {
//       console.log('Trade updates:', messageData.data)
//       const data = messageData.data;
//       const order = data.order;
//       if (order && data.event === 'fill') {
//         console.log("Calling Order Filled Event");
//         const curOrder = new Order({
//           symbol: order?.symbol,
//           qty: data?.qty,
//           side: order?.side,
//           type: order?.type,
//           timeInForce: order?.time_in_force,
//           limitPrice: order?.limit_price,
//           stopPrice: order?.stop_price,
//           trailPrice: order?.trail_price,
//           trailPercent: order?.trail_percent
//         })
//         const orderFilledEvent = new Event<TOrder>(EVENT_TYPES.ORDER_FILLED, curOrder)
//         eventBus.emit(EVENT_TYPES.ORDER_FILLED, orderFilledEvent);
//       }
//       break;
//     }

//     //AUTHORIZATION
//     case 'authorization': {
//       if (messageData.data.status === 'authorized') {
//         // once authorized, listen to the trade_updates stream
//         console.log('WebSocket connection authorized');
//         ws1.send(JSON.stringify({
//           action: 'listen',
//           data: {
//             streams: ['trade_updates']
//           }
//         }));
//       } else {
//         console.error('WebSocket connection not authorized');
//       }
//       break;
//     }

//     //LISTENING
//     case 'listening': {
//       console.log('Listening to streams:', messageData.data.streams);
//       if (messageData.data.streams.includes('trade_updates')) {
//         const curOrder = new Order({
//           symbol: "AAPL",
//           qty: 1,
//           side: ORDER_SIDE.BUY,
//           type: ORDER_TYPE.MARKET,
//           timeInForce: TIME_IN_FORCE.GTC,
//         })
//         const e = new Event<TOrder>(EVENT_TYPES.TICK, curOrder)
//         eventBus.emit(EVENT_TYPES.TICK, e);
//       }
//       break;
//     }

//     default: {
//       console.log('Unknown stream:', messageData.stream);
//       break;
//     }
//   }
// })

//   __  __   _   ___ _  _____ _____   ___   _ _____ _   
//  |  \/  | /_\ | _ \ |/ / __|_   _| |   \ /_\_   _/_\  
//  | |\/| |/ _ \|   / ' <| _|  | |   | |) / _ \| |/ _ \ 
//  |_|  |_/_/ \_\_|_\_|\_\___| |_|   |___/_/ \_\_/_/ \_\


const ws2 = new WebSocket("wss://stream.data.alpaca.markets/v2/test");
ws2.on('open', () => {
  console.log('Connected to Market Data');
  // authenticate
  ws2.send(JSON.stringify({
    action: 'auth',
    key: process.env.ALPACA_API_KEY_ID,
    secret: process.env.ALPACA_API_SECRET
  }));

  // wait for authentication
  setTimeout(() => {
    ws2.send(JSON.stringify({
      action: 'subscribe',
      bars: ["FAKEPACA"],
    }));
  }, 3000)
});
