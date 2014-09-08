var Sudoku = Sudoku || {};
Sudoku.UI = function (container) {
  var self = {};

  self.draw = function (puzzle) {
    var $puzzle = $("<div />").addClass("puzzle");
    var n = puzzle.n();
    for (var i = 0; i < n; i++) {
      var $boxRow = $("<div />").addClass("row");
      for (var j = 0; j < n; j++) {
        var $box = $("<div />").addClass("box");
        for (var k = 0; k < n; k++) {
          var $row = $("<div />").addClass("row");
          for (var m = 0; m < n; m++) {
            var $cell = $("<div />").addClass("cell");
            var $input = $("<input />").attr("type", "tel");
            $input.appendTo($cell);
            $input.keydown(function(e) {
              var a=[8,9,13,16,17,18,20,27,35,36,37,38,39,40,45,46,91,92];
              var k = e.which;
              for (i = 49; i < 58; i++) a.push(i);
              for (i = 97; i < 106; i++) a.push(i);
              if (a.indexOf(k) < 0) e.preventDefault();
              $(this).val('');
            });
            $cell.appendTo($row);
          }
          $row.appendTo($box);
        }
        $box.appendTo($boxRow);
      }
      $boxRow.appendTo($puzzle);
    }
    return $puzzle;
  }

  return self;
};
