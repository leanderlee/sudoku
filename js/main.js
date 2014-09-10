var Sudoku = Sudoku || {};
console.log(Sudoku)
$(function () {
  var ui;

  ui = new Sudoku.UI($("#app"));
  ui.newGame();

})
