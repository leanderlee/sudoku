var Sudoku = Sudoku || {};
Sudoku.Solver = function () {
  var self = {};

  var arr_find = function (arr, query) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      if (typeof query == "function" && query(arr[i])) {
        result.push(i);
      } else if (arr[i] === query) {
        result.push(i);
      }
    }
    return result;
  }

  // Gets the values of the column at x
  self.getCol = function (x,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.get(x,i));
    }
    return result;
  }

  // Gets the values of the row at y
  self.getRow = function (y,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.get(i,y));
    }
    return result;
  }

  // Gets the values of the n by n box at x,y
  self.getBox = function (x,y,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.get(i%n + (x*n), Math.floor(i/n) + (y*n)));
    }
    return result;
  }

  // Gets the candidates of the column at x
  self.getCandidatesForCol = function (x,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.candidates(x,i));
    }
    return result;
  }

  // Gets the candidates of the row at y
  self.getCandidatesForRow = function (y,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.candidates(i,y));
    }
    return result;
  }

  // Gets the candidates of the n by n box at x,y
  self.getCandidatesForBox = function (x,y,p) {
    var n = p.n();
    var result = [];
    for (var i = 0; i < n*n; i++) {
      result.push(p.candidates(i%n + (x*n), Math.floor(i/n) + (y*n)));
    }
    return result;
  }

  // Get the box number of (x,y) given puzzle N=n
  // The order for the boxes goes:
  //
  //   0 1 2
  //   3 4 5
  //   6 7 8
  //
  //   eg (3,3) is in (1,1) box # 0.
  //      (4,3) is in (1,1) box # 1.
  //      (3,4) is in (1,1) box # 3.
  self.getBoxNum = function (x,y,n) {
    return (x%n) + ((y%n)*n);
  }

  // Sets (x,y) to be v in the given puzzle, p
  // Also, rules out the other cells in the row, col and box in (x,y)
  self.set = function (x,y,v,p) {
    var n = p.n();
    var col = self.getCol(x, p);
    var row = self.getRow(y, p);
    var box = self.getBox(Math.floor(x/n), Math.floor(y/n), p);
    var xy = self.getBoxNum(x,y,n)
    var inRow = arr_find(row, v);
    var inCol = arr_find(col, v);
    var inBox = arr_find(box, v);
    if (inRow.length || inCol.length || inBox.length) {
      return false;
    }
    p.set(x,y,v);
    for (var k = 0; k < n*n; k++) {
      if (k != x) {
        p.markNo(k, y, v);
      }
      if (k != y) {
        p.markNo(x, k, v);
      }
      if (k != xy) {
        p.markNo((Math.floor(x/n)*n) + (k%n), (Math.floor(y/n)*n) + Math.floor(k/n), v);
      }
    }
  }

  // Goes through each number, and marks the other cells as impossible,
  // as per the rules of Sudoku.
  self.markAll = function (p) {
    var n = p.n();
    for (var i = 1; i <= n*n; i++) {
      for (var j = 0; j < n*n; j++) {
        row = self.getRow(j, p);
        box = self.getBox(j%n, Math.floor(j/n), p);
        col = self.getCol(j, p);
        var inRow = arr_find(row, i);
        var inCol = arr_find(col, i);
        var inBox = arr_find(box, i);
        if (inRow.length > 1 || inCol.length > 1 || inBox.length > 1) {
          return false;
        }
        if (inRow.length) {
          var x = inRow[0];
          for (var k = 0; k < n*n; k++) {
            if (k != x) {
              p.markNo(k, j, i);
            }
          }
        }
        if (inCol.length) {
          var y = inCol[0];
          for (var k = 0; k < n*n; k++) {
            if (k != y) {
              p.markNo(j, k, i);
            }
          }
        }
        if (inBox.length) {
          var xy = inBox[0];
          for (var k = 0; k < n*n; k++) {
            if (k != xy) {
              p.markNo((n*(j%n)) + (k%n), (n*Math.floor(j/n)) + Math.floor(k/n), i);
            }
          }
        }
      }
    }
    return p;
  }

  // Takes a marked puzzle and sets new values based on its candidates.
  // Returns true if reduced, false if inconsistent or irreducible.
  self.reduce = function (p) {
    var n = p.n();
    var candidates = [];
    var reducible = false;
    for (var i = 0; i < n*n; i++) {
      for (var j = 0; j < n*n; j++) {
        candidates = p.candidates(i,j);
        if (candidates.length == 1 && p.get(i,j) == 0) {
          // Reducible!
          reducible = true;
          self.set(i,j,candidates[0],p)
        }
      }
    }
    if (reducible) {
      self.deduce(p);
    }
    return reducible;
  }

  // Takes a marked puzzle and rules out numbers based on other candidates.
  // Returns true if something was deduced, false otherwise.
  self.deduce = function (p) {
    var n = p.n();
    var deduced = false;
    for (var i = 1; i <= n*n; i++) {
      for (var j = 0; j < n*n; j++) {
        var box = self.getCandidatesForBox(j%n, Math.floor(j/n), p);
        var row = self.getCandidatesForRow(j, p);
        var col = self.getCandidatesForCol(j, p);
        var inRow = arr_find(row, function (candidates) { return (candidates.indexOf(i) >= 0) });
        var inCol = arr_find(col, function (candidates) { return (candidates.indexOf(i) >= 0) });
        var inBox = arr_find(box, function (candidates) { return (candidates.indexOf(i) >= 0) });
        if (inBox.length == 1) {
          k = inBox[0];
          deduced = true;
          p.markYes((n*(j%n)) + (k%n), (n*Math.floor(j/n)) + Math.floor(k/n), i);
        }
        if (inRow.length == 1) {
          k = inRow[0];
          deduced = true;
          p.markYes(k, j, i);
        }
        if (inCol.length == 1) {
          k = inCol[0];
          deduced = true;
          p.markYes(k, j, i);
        }
      }
    }
    return deduced;
  }

  // Attempts to solve the puzzle.
  // Returns a puzzle or null if the puzzle is inconsistent.
  self.solve = function (p) {
    p.resetCandidates();
    if (!self.markAll(p)) return false;
    var original = p.clone();
    var reduced = false;
    while (self.reduce(p)) {
      reduced = true;
    }

    // Reduce until it cannot be reduced.
    // Make a guess
    // Reduce again
    // If it becomes inconsistent, try another guess.
    // Keep guessing until it is solved.
    return p;
  }


  return self;
};
