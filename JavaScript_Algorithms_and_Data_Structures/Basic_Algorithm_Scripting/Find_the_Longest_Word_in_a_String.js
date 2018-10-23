const findLongestWordLength=s=>s.split(' ').map(v=>v.length).sort((a,b)=>b-a)[0]

// or

const findLongestWordLength=s=> {
  s.split(' ').map(v=>v.length).sort((a,b)=>b-a)[0]
}
