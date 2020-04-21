function sym(...args) {
  const sets = Array.from(args).map((a) => new Set([...a]));
  return [
    ...sets.reduce((a, b) => {
      for (const elem of b) {
        if (a.has(elem)) {
          a.delete(elem);
        } else {
          a.add(elem);
        }
      }
      return a;
    }),
  ];
}

sym([1, 2, 3], [5, 2, 1, 4]);

var timeit = function (label, f, ...args) {
  console.time(label);
  console.log();

  result = f(...args);

  console.log(`RESULT RETURNED: ${JSON.stringify([...result])}`);
  console.timeEnd(label);
};

timeit("RESULT EXPECTED: [3,4,5]\t\tTime", sym, [1, 2, 3], [5, 2, 1, 4]);
timeit("RESULT EXPECTED: [3,4,5]\t\tTime", sym, [1, 2, 3, 3], [5, 2, 1, 4]);
timeit(
  "RESULT EXPECTED: [1,4,5]\t\tTime",
  sym,
  [1, 2, 5],
  [2, 3, 5],
  [3, 4, 5]
);
