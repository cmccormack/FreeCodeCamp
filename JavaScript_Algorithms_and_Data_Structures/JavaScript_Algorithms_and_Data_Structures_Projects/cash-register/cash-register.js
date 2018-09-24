
const denominations = [100, 20, 10, 5, 1, .25, .10, .05, .01].map(v => v * 100)

const checkCashRegister = (price, cash, cid) => {
    let due = cash * 100 - price * 100
    const change = []

    const finalDrawer = [...cid].reverse().map((slot, i) => {
        let [text, amt] = slot
        amt = Math.round(amt * 100)
        const unit = denominations[i]

        if (unit > due) { return slot }

        let unitChange = 0
        while (amt > 0 && due > 0 && due >= unit) {
            due -= unit
            amt -= unit
            unitChange += unit
        }

        change.push([text, unitChange / 100])
        return [text, amt / 100]
    })

    if (due) {
        return { status: "INSUFFICIENT_FUNDS", change: [] }
    }
    if (finalDrawer.filter(([text, amt]) => amt !== 0).length === 0) {
        return { status: "CLOSED", change: cid }
    }
    return { status: "OPEN", change }
}



checkCashRegister(19.5, 20, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
]);
// {status: "OPEN", change: [["QUARTER", 0.5]]}.

checkCashRegister(3.26, 100, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
])
// {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.


checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
// {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}
