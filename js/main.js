$(function () {
  "use strict";

  var Sudoku = Sudoku || {};

  var ui = new Sudoku.UI();
  var grid = Sudoku.Maker.blank();
  
  var puzzle = new Sudoku.Puzzle(grid, 3);

  ui.begin();
  ui.draw(puzzle);

})