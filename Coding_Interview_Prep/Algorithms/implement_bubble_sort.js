/*

Algorithms: Implement Bubble Sort
This is the first of several challenges on sorting algorithms. Given an array 
of unsorted items, we want to be able to return a sorted array. We will see 
several different methods to do this and learn some tradeoffs between these 
different approaches. While most modern languages have built-in sorting methods 
for operations like this, it is still important to understand some of the common 
basic approaches and learn how they can be implemented.

Here we will see bubble sort. The bubble sort method starts at the beginning of
 an unsorted array and 'bubbles up' unsorted values towards the end, iterating 
 through the array until it is completely sorted. It does this by comparing 
 adjacent items and swapping them if they are out of order. The method continues 
 looping through the array until no swaps occur at which point the array is sorted.

This method requires multiple iterations through the array and for average and
 worst cases has quadratic time complexity. While simple, it is usually 
 impractical in most situations.

Instructions: Write a function bubbleSort which takes an array of integers as 
input and returns an array of these integers in sorted order from least to greatest.

Note:
We are calling this function from behind the scenes; the test array we are 
using is commented out in the editor. Try logging array to see your 
sorting algorithm in action!

*/

function bubbleSort(array) {
  for (let i = 0; i < array.length - 1; i += 1) {
    for (let j = 0; j < array.length - i - 1; j += 1) {
      if (array[j] > array[j + 1]) {
        array[j] = array[j] ^ array[j + 1];
        array[j + 1] = array[j] ^ array[j + 1];
        array[j] = array[j] ^ array[j + 1];
      }
    }
  }
  return array;
}

var timeit = function (label, f, args) {
  console.time(label);
  console.log();
  result = f(args);
  console.log(`RESULT RETURNED: ${JSON.stringify(result)}`);
  console.timeEnd(label);
};

const res = [
  1,
  4,
  2,
  8,
  345,
  123,
  43,
  32,
  5643,
  63,
  123,
  43,
  2,
  55,
  1,
  234,
  92,
].sort((a, b) => a - b);
timeit(`RESULT EXPECTED: ${JSON.stringify(res)}\t\tTime`, bubbleSort, [
  1,
  4,
  2,
  8,
  345,
  123,
  43,
  32,
  5643,
  63,
  123,
  43,
  2,
  55,
  1,
  234,
  92,
]);
