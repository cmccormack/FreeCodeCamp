const BLOCKS = [
  ["B", "O"],
	["X", "K"],
	["D", "Q"],
	["C", "P"],
	["N", "A"],
	["G", "T"],
	["R", "E"],
	["T", "G"],
	["Q", "D"],
	["F", "S"],
	["J", "W"],
	["H", "U"],
	["V", "I"],
	["A", "N"],
	["O", "B"],
	["E", "R"],
	["F", "S"],
	["L", "Y"],
	["P", "C"],
	["Z", "M"],
]


const allLetters = (b) => Array.concat(...b)

const letterPos = (l, b) => Math.floor(allLetters(b).indexOf(l) / 2)

const removeBlock = (l, b) => [...b.slice(0, letterPos(l,b)), ...b.slice(letterPos(l,b)+1)]



const allLettersObj = (blocks) => allLetters(blocks).reduce(
    (a,v) => Object.assign(a, { [v]: a[v] ? a[v] + 1 : 1 }
  ), {})

function canMakeWord (word) {
  word = word.toUpperCase()
  let blocks = BLOCKS

  for (let letter of word){
    if (!allLetters(blocks).includes(letter)) {
      return false
    }
   blocks = removeBlock(letter, blocks)
  }
  return true
}

