import { sma } from "indicatorts";
import Dinero from 'dinero.js';

const bars = [
  { t: 1, c: 100 },
  { t: 2, c: 101 },
  { t: 3, c: 102 },
  { t: 4, c: 103 },
  { t: 5, c: 104 },
  { t: 6, c: 105 },
  { t: 7, c: 106 },
  { t: 8, c: 107 },
  { t: 9, c: 108 },
  { t: 10, c: 109 },
  { t: 11, c: 110 },
  { t: 12, c: 111 },
  { t: 13, c: 112 },
  { t: 14, c: 113 },
  { t: 15, c: 114 },
  { t: 16, c: 115 },
  { t: 17, c: 116 },
  { t: 18, c: 117 },
  { t: 19, c: 118 },
  { t: 20, c: 119 },
  { t: 21, c: 120 },
  { t: 22, c: 121 },
  { t: 23, c: 122 },
  { t: 24, c: 123 },
  { t: 25, c: 124 },
  { t: 26, c: 125 },
  { t: 27, c: 126 },
  { t: 28, c: 127 },
  { t: 29, c: 128 },
  { t: 30, c: 129 },
  { t: 31, c: 130 },
  { t: 32, c: 131 },
  { t: 33, c: 132 },
  { t: 34, c: 133 },
  { t: 35, c: 134 },
  { t: 36, c: 135 },
  { t: 37, c: 136 },
  { t: 38, c: 137 },
  { t: 39, c: 138 },
  { t: 40, c: 139 },
  { t: 41, c: 140 },
  { t: 42, c: 141 },
  { t: 43, c: 142 },
  { t: 44, c: 143 },
  { t: 45, c: 144 },
  { t: 46, c: 145 },
  { t: 47, c: 146 },
  { t: 48, c: 147 },
]

const closePrices = bars.map(b => b.c);

function average(array: number[]): number {
  if (array.length === 0) {
    throw new Error('Cannot calculate average of an empty array');
  }
  const sum = array.reduce((acc, val) => {
    const dineroVal = Dinero({ amount: val * 100, currency: 'USD' });
    const dineroAcc = Dinero({ amount: acc * 100, currency: 'USD' });
    return dineroAcc.add(dineroVal).getAmount() / 100;
  }, 0);


  const sumDinero = Dinero({ amount: sum * 100, currency: 'USD' });
  const average = sumDinero.divide(array.length).getAmount() / 100;
  return average;
}

// const bars20 = closePrices.slice(-20);
// console.log('Bars 20:', bars20);
// const sma20 = average(bars20);
// console.log('SMA 20:', sma20);

console.log('Close Prices:', closePrices);
const sma20 = average(closePrices.slice(-20));
console.log('SMA 20:', sma20);

const v1 = 100
const v2 = 100
const v3 = 100.01
const d1 = Dinero({ amount: v1 * 100, currency: 'USD' })
const d2 = Dinero({ amount: v2 * 100, currency: 'USD' })
const d3 = Dinero({ amount: v3 * 100, currency: 'USD' })
console.log("DINERO", d1.getAmount() / 100);
console.log("DINERO 2", d2.getAmount() / 100);
console.log("DINERO 3", d3.getAmount() / 100);

console.log(d1.add(d2).getAmount() / 100);
const avg = average([v1, v2, v3])
console.log("AVG DINERO", avg);
console.log("AVG", (v1 + v2 + v3) / 3);

export default { sma20 }