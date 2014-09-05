var Sudoku = Sudoku || {};
Sudoku.Maker = {};
Sudoku.Maker.blank = function (n) {
  n = n || 3; // grid size

  var grid = [];
  for (var i = 0; i < n*n; i++) {
    for (var j = 0; j < n*n; j++) {
      grid[i][j] = 0;
    }
  }
  
  return grid;
}

Sudoku.Maker.random = function (n, difficulty) {
  n = n || 3;
  // Maybe a later expansion?
}

