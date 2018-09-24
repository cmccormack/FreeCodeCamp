const smallestCommons = arr => {
    const [min, max] = arr.sort((a,b) => a-b)
    const filledArr = Array(max-min).fill(max-1).map((v,i) => v-i)
    let result = max
    while (true) {
        if (filledArr.every(v => result % v === 0)) {
            return result
        }
        result += max
    }    
}

const smallestCommons2 = arr => {
    const [min, max] = arr.sort((a,b) => a-b)

    let result = max

    while (true) {
        for (let i = min; i < max; i+=1) {
            if (result % i !== 0) {
                result += max
                break
            }
            if (i === max-1) {
                return result
            }
        }
    }
}


const gcd = (a, b) => b === 0 ? a : gcd(b, a%b)
const lcm = (a, b) => (a*b) / gcd(a, b)
const smallestCommons3 = ([a,b]) => (
    Array(Math.abs(a-b)+1).fill(Math.min(a,b)).map((v,i) => v+i).reduce(lcm)
)


const test = [23,18]

console.time('Test 1 - Using Array.prototype.every')
let result = smallestCommons(test)
console.timeEnd('Test 1 - Using Array.prototype.every')
console.log(result)

console.time('Test 2 - Using for loop')
let result2 = smallestCommons2(test)
console.timeEnd('Test 2 - Using for loop')
console.log(result2)

console.time('Test 3 - Using LCM')
let result3 = smallestCommons3(test)
console.timeEnd('Test 3 - Using LCM')
console.log(result3)