var Sudoku = Sudoku || {};
console.log(Sudoku)
$(function () {

  var ui = new Sudoku.UI($("#app"));
  var grid = Sudoku.Maker.random();

  var puzzle = new Sudoku.Puzzle(grid);

  //ui.begin();
  ui.draw(puzzle).appendTo("#app");

})
