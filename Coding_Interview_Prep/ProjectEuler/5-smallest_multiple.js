/*

Project Euler: Problem 5: Smallest multiple

2520 is the smallest number that can be divided by each of the
numbers from 1 to 10 without any remainder.

What is the smallest positive number that is evenly divisible by
all of the numbers from 1 to n?


*/

function smallestMult(n) {
  let current = n;
  // let maxLoops = 10000;
  let isDivisable = false;
  while (!isDivisable) {
    for (let i = n - 1; i > 1; i -= 1) {
      if (current % i === 0) {
        isDivisable = true;
      } else {
        isDivisable = false;
        current += n;
        // console.log(current);
        break;
      }
    }
    // maxLoops -= 1;
    // if (maxLoops === 0) break;
  }
  return current;
}

const br = `\n---------------------------------------------\n`;
var timeit = function (label, f, ...args) {
  console.time(label);
  result = f(...args);
  console.log(`${br}RESULT RETURNED: ${result}`);
  console.timeEnd(label);
};

timeit(`RESULT EXPECTED: 60\t\tTime`, smallestMult, 5);
timeit(`RESULT EXPECTED: 420\t\tTime`, smallestMult, 7);
timeit(`RESULT EXPECTED: 232792560\t\tTime`, smallestMult, 20);
