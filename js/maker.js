var Sudoku = Sudoku || {};
Sudoku.Maker = {};
Sudoku.Maker.random = function (difficulty, n) {
  n = n || 3;
  // Maybe a later expansion?
  return [
    [1,0,0, 0,0,0, 0,0,2],
    [0,9,0, 4,0,0, 0,5,0],
    [0,0,6, 0,0,0, 7,0,0],

    [0,5,0, 9,0,3, 0,0,0],
    [0,0,0, 0,7,0, 0,0,0],
    [0,0,0, 8,5,0, 0,4,0],

    [7,0,0, 0,0,0, 6,0,0],
    [0,3,0, 0,0,9, 0,8,0],
    [0,0,2, 0,0,0, 0,0,1]
  ]
}

