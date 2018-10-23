
// @cmccormack map and sort
const findLongestWordLength=s=>s.split(' ').map(v=>v.length).sort((a,b)=>b-a)[0]

// @cmccormack with recursion
const findLongestWordLength2 = s => {
  const nextSpace = s.indexOf(' ')
  return s.indexOf(' ') === -1 ? s.length : Math.max(s.slice(0, nextSpace).length, findLongestWordLength(s.slice(nextSpace+1)))
}

// @cmccormack stupidly ugly one liner with recursion
const findLongestWordLength3=s=>s.indexOf(' ') === -1 ? s.length : Math.max(s.slice(0, s.indexOf(' ')).length, findLongestWordLength(s.slice(s.indexOf(' ')+1)))


// @alpox for loop
function findLongestWordLength4(str) {
  let max = 0, counter;
  for(let i = 0; i < str.length; i++) {
    if(str[i] === ' ') {
      if(counter > max) max = counter;
      counter = 0;
    } else counter++;
  }

  return max;
}


// @alpox recursion and tail call optimization
const findLongestWordLength5=f=([x,...y],t=0,c=0)=>x&&(x==' '?f(y,c>t?c:t,0):f(y,t,c+1))||t


// @ezioda004 thingy
const findLongestWordLength6 = s => {
  return (function helper(arr, l = 0){
    if (arr.length == 0) return l;
    let x = arr.pop().length;
    l = x > l ? x : l;
    return helper(arr, l)
  })(s.split(' '));
}


const str = "The quick brown fox jumped over the lazy dog"
let result
console.time('map and sort')
result = findLongestWordLength(str)
console.timeEnd('map and sort')

console.time('recursion')
result = findLongestWordLength2(str)
console.timeEnd('recursion')

console.time('one-liner recursion')
result = findLongestWordLength3(str)
console.timeEnd('one-liner recursion')


console.time('alpox for loop')
result = findLongestWordLength4(str)
console.timeEnd('alpox for loop')

console.time('the what now?')
result = findLongestWordLength5(str)
console.timeEnd('the what now?')

console.time('ezioda004')
result = findLongestWordLength6(str)
console.timeEnd('ezioda004')