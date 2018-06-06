const fiboEvenSum = (num) => {
  let count = 0
  let fib1 = 1
  let fib2 = 2
  let sum = 0
  let temp = 0

  while ( count < num ) {
    sum += fib2 % 2 === 0 ? fib2 : 0

    temp = fib2
    fib2 += fib1
    fib1 = temp
    count += 1
  }

  return sum
}

fiboEvenSum(10);
