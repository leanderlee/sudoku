var Sudoku = Sudoku || {};
Sudoku.Puzzle = function (grid, candidates, n) {
  var self = {};

  // Gets the N number of the puzzle.
  // N=3 is 9x9 Sudoku.
  self.n = function () {
    return n;
  }

  // Sets v at (x,y) on the puzzle
  self.set = function (x,y,v) {
    grid[y][x] = v;
  }

  // Gets the value at (x,y), 0 means empty.
  self.get = function (x,y) {
    return grid[y][x];
  }

  // Marks v at (x,y) to be not the value
  self.markNo = function (x,y,v) {
    var id = candidates[y][x].indexOf(v);
    if (id >= 0) {
      candidates[y][x].splice(id, 1);
    }
  }

  // Marks v at (x,y) to be the value
  self.markYes = function (x,y,v) {
    candidates[y][x] = [v];
  }

  // Marks v at (x,y) to be a potential value
  self.markPossible = function (x,y,v) {
    var id = candidates[y][x].indexOf(v);
    if (id < 0) {
      candidates[y][x].push(v);
    }
  }

  // Marks (x,y) is one of the values in arr
  self.markOneOf = function (x,y,arr) {
    candidates[y][x] = arr;
  }

  // Gets the potential numbers for (x,y)
  // If the number is already set, then there is no need to check.
  self.candidates = function (x,y) {
    return (self.get(x,y) && [self.get(x,y)]) || candidates[y][x];
  }

  // Returns a boolean for if v is a candidate at (x,y)
  self.isCandidate = function (x,y,v) {
    return (candidates[y][x].indexOf(v) >= 0);
  }

  // Sets the grid to 0
  self.resetGrid = function () {
    grid = [];
    for (var i = 0; i < n*n; i++) {
      grid[i] = [];
      for (var j = 0; j < n*n; j++) {
        grid[i][j] = 0;
      }
    }
  };

  // Resets the annotations
  self.resetCandidates = function () {
    candidates = [];
    for (var i = 0; i < n*n; i++) {
      candidates[i] = [];
      for (var j = 0; j < n*n; j++) {
        candidates[i][j] = [];
        for (var k = 1; k <= n*n; k++) {
          self.markPossible(j,i,k);
        }
      }
    }
  }

  // solved
  self.isSolved = function () {
    for (var i = 0; i < n*n; i++) {
      for (var j = 0; j < n*n; j++) {
        if (self.get(i,j) == 0) return false;
      }
    }
    return true;
  }

  // Clones the puzzle
  self.clone = function () {
    var newGrid = [];
    var newCandidates = [];
    for (var i = 0; i < n*n; i++) {
      newCandidates[i] = [];
      newGrid[i] = grid[i].slice();
      for (var j = 0; j < n*n; j++) {
        newCandidates[i][j] = candidates[i][j].slice(0);
      }
    }

    return new Sudoku.Puzzle(newGrid, newCandidates, n);
  }

  // toString
  self.toString = function () {
    var str = "";
    for (var i = 0; i < n*n; i++) {
      if (i%n == 0 && i != 0) {
        str += "\n";
      }
      for (var j = 0; j < n; j++) {
        if (j != 0) str += " ";
        str += " ";
        str += grid[i].slice(j*n,(j+1)*n).join(" ")
      }
      str += "\n";
    }
    return str;
  }

  var init = function () {

    // Attempt to infer the value of n otherwise n=3
    if (grid && !n) {
      n = Math.ceil(Math.sqrt(grid.length))
    } else if (!n) {
      n = 3;
    }

    // Initialize candidates and grids
    if (!candidates) {
      self.resetCandidates();
    }
    if (!grid) {
      self.resetGrid();
    }

  }
  init();

  return self;
};
