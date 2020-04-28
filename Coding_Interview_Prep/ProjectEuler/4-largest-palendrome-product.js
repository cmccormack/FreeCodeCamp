/*

Project Euler: Problem 4: Largest palindrome product

A palindromic number reads the same both ways. The largest
palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.

Find the largest palindrome made from the product of two n-digit numbers.

9*9 = 81
9*8 = 72
9*7 = 63
8*8 = 64
8*7 = 56
8*6 = 48
7*7 = 49
7*6 = 42


*/

function checkPalindrome(n) {
  const strN = String(n);
  const lenN = strN.length;
  const isEven = lenN % 2 === 0;
  const mid = Math.trunc(lenN / 2);
  let left;
  let right;
  if (isEven) {
    left = strN.slice(0, mid);
    right = strN.slice(mid, lenN);
  } else {
    left = strN.slice(0, mid);
    right = strN.slice(mid + 1, lenN);
  }
  return left === right.split('').reverse().join("");
}

function largestPalindromeProduct(n) {
  // Good luck!
  const maxOperand = Math.pow(10, n) - 1;
  let max = -Infinity;
  for (let i = maxOperand; i > 0; i -= 1) {
    for (let j = i; j > 0; j -= 1) {
      if (checkPalindrome(i * j)) {
        if (i * j > max) console.log(i, j, i * j, max);
        max = Math.max(max, i * j);
      }
    }
  }
  return max;
}

const br = `\n---------------------------------------------\n`;
var timeit = function (label, f, ...args) {
  console.time(label);
  result = f(...args);
  console.log(`${br}RESULT RETURNED: ${result}`);
  console.timeEnd(label);
};

timeit(`RESULT EXPECTED: 9009\t\tTime`, largestPalindromeProduct, 2);
timeit(`RESULT EXPECTED: 906609\t\tTime`, largestPalindromeProduct, 3);
