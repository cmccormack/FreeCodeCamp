const reduceNum = (num, n) => {
  while (num % n === 0) {
    num /= n
  }
  return num
}

const largestPrimeFactor = num => {
  let maxPrime = 2
  num = reduceNum(num, maxPrime)

  for (let i=3; i <= num; i+=2) {
    if ( num % i === 0 ) maxPrime = i
    num = reduceNum(num, maxPrime)
    console.log(num, i, maxPrime)
  }

  return maxPrime
}
