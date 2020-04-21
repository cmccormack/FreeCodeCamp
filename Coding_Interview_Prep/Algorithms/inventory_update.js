/*
Compare and update the inventory stored in a 2D array against a 
second 2D array of a fresh delivery. Update the current existing 
inventory item quantities (in arr1). If an item cannot be found, add
the new item and quantity into the inventory array. The returned inventory 
array should be in alphabetical order by item.
*/
function updateInventory(arr1, arr2) {
  // All inventory must be accounted for or you're fired!
  const inventory = new Map(arr1.map((v) => [v[1], v[0]]));
  for (const [qty, item_name] of arr2) {
    if (inventory.has(item_name)) {
      inventory.set(item_name, inventory.get(item_name) + qty);
    } else {
      inventory.set(item_name, qty);
    }
  }
  return [...inventory.entries()]
    .sort((a, b) => a[0].localeCompare(b))
    .map((v) => [v[1], v[0]]);
}

// Example inventory lists
var curInv = [
  [21, "Bowling Ball"],
  [2, "Dirty Sock"],
  [1, "Hair Pin"],
  [5, "Microphone"],
];

var newInv = [
  [2, "Hair Pin"],
  [3, "Half-Eaten Apple"],
  [67, "Bowling Ball"],
  [7, "Toothpaste"],
];

var timeit = function (label, f, arg1, arg2) {
  console.time(label);
  console.log();

  result = f(arg1, arg2);

  console.log(`RESULT RETURNED: ${JSON.stringify([...result])}`);
  console.timeEnd(label);
};

timeit(
  'RESULT EXPECTED: [[88,"Bowling Ball"],[2,"Dirty Sock"],[3,"Hair Pin"],[3,"Half-Eaten Apple"],[5,"Microphone"],[7,"Toothpaste"]]\t\tTime',
  updateInventory,
  curInv,
  newInv
);
