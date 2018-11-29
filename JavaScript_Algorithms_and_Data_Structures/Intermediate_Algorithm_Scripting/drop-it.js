const dropElements = (arr, fn, done=false) =>  arr.filter(v => done || (done = fn(v)))
