var Sudoku = Sudoku || {};
Sudoku.Maker = {};
Sudoku.Maker.random = function (difficulty, n) {
  n = n || 3;
  difficulty = difficulty || 0;
  var numGivens = 22; // See paper in wiki.
  var maxGivens = numGivens + (Math.floor((100-difficulty)/100)*20);

  var givens = new Sudoku.Puzzle();
  var solver = new Sudoku.Solver();
  var las_vegas = function (p) {
    var makeRandom = function () {
      return {
        x: Math.floor(Math.random()*p.n()*p.n()),
        y: Math.floor(Math.random()*p.n()*p.n()),
        v: Math.floor(Math.random()*p.n()*p.n())+1,
      };
    }
    var assignment, c = 0;
    while (c < 10000 && (!assignment || !solver.isConsistent(p))) {
      c++;
      console.log("Attempting", assignment);
      if (assignment) {
        // Attempted to set assignment, but was inconsistent.
        p.set(assignment.x, assignment.y, 0);
      }
      assignment = makeRandom();
      if (p.get(assignment.x, assignment.y) !== 0) {
        assignment = false;
      } else {
        p.set(assignment.x, assignment.y, assignment.v);
      }
    }
    return p;
  }

  for (var i = 0; i < numGivens; i++) {
    givens = las_vegas(givens);
  }
  // If not solvable, try another set of random numbers.
  if (!solver.solve(givens)) {
    return Sudoku.Maker.random();
  }

  var last = null;
  var throwout = numGivens;
  while (throwout < maxGivens && solver.solve(givens) && !givens.isSolved()) {
    last = givens.clone();
    console.log("Trying", givens+'');
    givens = las_vegas(givens);
    throwout++;
  }
  if (throwout >= maxGivens) {
    return Sudoku.Maker.random();
  }

  return last;
}

