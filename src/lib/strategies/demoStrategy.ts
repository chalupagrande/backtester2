import { getBarsLatest } from '../providers/alpacaDataProvider';
export async function DemoStrategy() {
  console.log('thinging');
  const r = await getBarsLatest('AAPL,TSLA');
  console.log(r);
}
