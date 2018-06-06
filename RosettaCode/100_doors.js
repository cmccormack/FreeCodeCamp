function getFinalOpenedDoors (numDoors) {
  let doors = new Array(numDoors).fill(false)

  for (let i = 1; i <= numDoors; i+=1) {
    doors = doors.map((v,j) => (j+1) % i === 0 ? !v : v)
  }

  return doors.map((v, i) => v ? i+1 : v).filter(v => v)
}

