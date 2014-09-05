$(function () {
  "use strict";

  var Sudoku = Sudoku || {};

  var ui = new Sudoku.UI($("#app"));
  var grid = Sudoku.Maker.blank();
  
  var puzzle = new Sudoku.Puzzle(grid);

  ui.begin();
  ui.draw(puzzle);

})