var Sudoku = Sudoku || {};
Sudoku.Board = function ($board, $notes, onSolve) {
  var self = {};

  // Keyboard Codes
  var VK_LEFT = 37;
  var VK_RIGHT = 39;
  var VK_UP = 38;
  var VK_DOWN = 40;
  var VK_BACKSPACE = 8;
  var VK_TAB = 9;
  var VK_ENTER = 13;
  var VK_SHIFT = 16;
  var VK_NUMPAD_0 = 96;
  var VK_NUMPAD_1 = 97;
  var VK_NUMPAD_2 = 98;
  var VK_NUMPAD_3 = 99;
  var VK_NUMPAD_4 = 100;
  var VK_NUMPAD_5 = 101;
  var VK_NUMPAD_6 = 102;
  var VK_NUMPAD_7 = 103;
  var VK_NUMPAD_8 = 104;
  var VK_NUMPAD_9 = 105;
  var VK_NUMBER_0 = 48;
  var VK_NUMBER_1 = 49;
  var VK_NUMBER_2 = 50;
  var VK_NUMBER_3 = 51;
  var VK_NUMBER_4 = 52;
  var VK_NUMBER_5 = 53;
  var VK_NUMBER_6 = 54;
  var VK_NUMBER_7 = 55;
  var VK_NUMBER_8 = 56;
  var VK_NUMBER_9 = 57;

  var annotationMode = false;
  var shiftDown = false;
  var givens = null;
  var puzzle = null;

  // Board utility functions

  // Clears the board in preparation for a new puzzle.
  self.clear = function () {
    $board.empty();
  }

  // Fills the board with a solution.
  self.fill = function (solution) {
    $(".cell input", $board).each(function () {
      var x = $(this).data("x");
      var y = $(this).data("y");
      if (puzzle.get(x,y) == 0) {
        var v = solution.get(x,y);
        puzzle.set(x,y,v);
        $(this).attr("data-v", v+'');
        $(this).val(v);
      }
    })
  }

  // Hide the board
  self.hide = function () {
    $board.addClass("blurred");
  }
  // Show the board
  self.show = function () {
    $board.removeClass("blurred");
  }

  // Get/Set Puzzle
  self.puzzle = function (set) {
    if (set !== undefined) {
      givens = set;
      puzzle = set.clone();
      var n = puzzle.n();
      for (var i = 0; i < n*n; i++) {
        for (var j = 0; j < n*n; j++) {
          for (var k = 1; k <= n*n; k++) {
            puzzle.markNo(j,i,k);
          }
        }
      }
    } else {
      return puzzle.clone();
    }
  }

  // Draw the selected puzzle.
  self.draw = function () {
    if (!puzzle) return;
    var n = puzzle.n();
    for (var i = 0; i < n; i++) {
      var $boxRow = $("<div />").addClass("row");
      for (var j = 0; j < n; j++) {
        var $box = $("<div />").addClass("box");
        for (var k = 0; k < n; k++) {
          var $row = $("<div />").addClass("row");
          for (var m = 0; m < n; m++) {
            var $cell = $("<div />").addClass("cell");
            var $annotations = $("<div />").addClass("annotations");
            var $input = $("<input />").attr("type", "tel");
            var x = (j*n) + m;
            var y = (i*n) + k;
            var v = puzzle.get(x,y);
            if (v !== 0) {
              $input.val(v);
              $input.addClass('given');
              $input.attr('readonly', true);
              $input.attr("data-v", v);
            } else {
              self.updateAnnotations(x,y);
            }
            $annotations.appendTo($cell);
            $input.attr("data-x", x);
            $input.attr("data-y", y);
            $input.appendTo($cell);
            $input.hide().fadeIn(2000+Math.random()*2000);
            $cell.appendTo($row);
          }
          $row.appendTo($box);
        }
        $box.appendTo($boxRow);
      }
      $boxRow.appendTo($board);
    }
  };

  // Grabs the input field at (x,y)
  self.getByCoord = function (x,y) {
    return $("input[data-x=" + x + "][data-y=" + y + "]", $board);
  }
  self.getByValue = function (v) {
    return $("input[data-v='" + v + "']", $board);
  }
  self.setLastFocused = function ($input) {
    $("input.last-focus", $board).removeClass("last-focus");
    $input.addClass("last-focus");
  }
  self.getLastFocused = function () {
    return $("input.last-focus", $board);
  }

  // Get/Set annotation mode on board
  self.annotationMode = function (set) {
    if (set !== undefined) {
      annotationMode = !!set;
      if (set) {
        $notes.addClass("on");
        $board.addClass("annotate");
      } else {
        $notes.removeClass("on");
        $board.removeClass("annotate");
      }
      self.getLastFocused().focus();
    }
    return annotationMode;
  }


  // Update the annotations div at (x,y)
  self.updateAnnotations = function (x,y) {
    var candidates = puzzle.candidates(x,y);
    var $annotations = self.getAnnotations(x,y);
    if (puzzle.get(x,y) !== 0) return $annotations.empty();
    $(".number", $annotations).each(function () {
      if (candidates.indexOf($(this).data("num")) < 0) {
        $(this).remove();
      }
    })
    for (var p = 0; p < candidates.length; p++) {
      if (!$(".number[data-num=" + candidates[p] + "]", $annotations).size()) {
        var $number = $("<span />").addClass("number");
        $number.attr("data-num", candidates[p]).text(candidates[p]).appendTo($annotations);
      }
    }
  }

  // Get Annotations
  self.getAnnotations = function (x,y) {
    return self.getByCoord(x,y).parents(".cell").find(".annotations");
  }

  // Toggles the annotation of v at (x,y). If v is 0, then remove the last one.
  self.toggleAnnotation = function (x,y,v) {
    var vn = v ? parseInt(v) : 0;
    if (vn == 0) {
      var vn = $(".number:last", self.getAnnotations(x,y)).attr("data-num");
    }
    if (puzzle.isCandidate(x,y,vn)) {
      puzzle.markNo(x,y,vn);
    } else {
      puzzle.markPossible(x,y,vn);
    }
    self.updateAnnotations(x,y);
  }

  self.setValueAtCoord = function (x,y,v) {
    var vn = v ? parseInt(v) : 0;
    clearColours();
    puzzle.set(x,y,vn);
    if (vn != 0) {
      self.updateAnnotations(x,y);
    }
    self.getByCoord(x,y).attr('data-v', v).val(v).trigger("focus");
  }

  var clearColours = function () {
    $("input.guide", $board).removeClass("guide");
    $("input.similar", $board).removeClass("similar");
  };
  var blurHandler = function() {
    clearColours();
    setTimeout(function() { // iOS fix for CSS fixed header
      window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
    }, 0);
  };
  var focusHandler = function () {
    self.setLastFocused($(this));

    // Cell information
    var x = $(this).data("x");
    var y = $(this).data("y");
    var n = puzzle.n()*puzzle.n();
    var v = puzzle.get(x,y);

    // Colour row/col
    for (var i = 0; i < n; i++) {
      if (i != x) self.getByCoord(i,y).addClass("guide");
      if (i != y) self.getByCoord(x,i).addClass("guide");
    }

    // Colour similar cells
    if (v) self.getByValue(v).not(this).addClass("similar");
  };
  var keyupHandler = function (e) {
    var keyCode = (window.event) ? e.which : e.keyCode;
    var val = parseInt($(this).val());
    puzzle.set($(this).data("x"), $(this).data("y"), (!isNaN(val) ? val : 0));
    switch (keyCode) {
      case VK_SHIFT: self.annotationMode(false); shiftDown = false; break;
      default: break;
    }
  };
  var keydownHandler = function (e) {
    var keyCode = (window.event) ? e.which : e.keyCode;

    // Cell information
    var $input = $(this);
    var x = $(this).data("x");
    var y = $(this).data("y");
    var n = puzzle.n()*puzzle.n();
    var v = puzzle.get(x,y);

    var inputNum = function (val) {
      if (annotationMode) {
        self.toggleAnnotation(x,y,val);
      } else {
        self.setValueAtCoord(x,y,val);
      }
    }

    switch (keyCode) {
      case VK_SHIFT:  self.annotationMode(true); shiftDown = true; break;
      case VK_LEFT:   self.getByCoord((n+x-1)%n, y).focus();  break;
      case VK_RIGHT:  self.getByCoord((x+1)%n, y).focus();    break;
      case VK_UP:     self.getByCoord(x, (n+y-1)%n).focus();  break;
      case VK_DOWN:   self.getByCoord(x, (y+1)%n).focus();    break;
      case VK_ENTER:
      case VK_TAB:
        if (shiftDown) {
          self.getByCoord((x == 0 ? n-1 : x-1), ((n+y-(x == 0 ? 1 : 0))%n)).focus();
        } else {
          self.getByCoord((x == n-1 ? 0 : x+1), ((y+(x == n-1 ? 1 : 0))%n)).focus();
        }
        break;
      default: break;
    }

    // This part manipulates the puzzle.
    if (givens.get(x,y) !== 0) return e.preventDefault();
    switch (keyCode) {
      case VK_BACKSPACE:
      case VK_NUMBER_0:
      case VK_NUMPAD_0: inputNum(''); break;
      case VK_NUMBER_1:
      case VK_NUMPAD_1: inputNum('1'); break;
      case VK_NUMBER_2:
      case VK_NUMPAD_2: inputNum('2'); break;
      case VK_NUMBER_3:
      case VK_NUMPAD_3: inputNum('3'); break;
      case VK_NUMBER_4:
      case VK_NUMPAD_4: inputNum('4'); break;
      case VK_NUMBER_5:
      case VK_NUMPAD_5: inputNum('5'); break;
      case VK_NUMBER_6:
      case VK_NUMPAD_6: inputNum('6'); break;
      case VK_NUMBER_7:
      case VK_NUMPAD_7: inputNum('7'); break;
      case VK_NUMBER_8:
      case VK_NUMPAD_8: inputNum('8'); break;
      case VK_NUMBER_9:
      case VK_NUMPAD_9: inputNum('9'); break;
      default: break;
    }
    if (puzzle.isSolved()) {
      onSolve.call(self, puzzle);
    }
    e.preventDefault();
  }

  var setupBoard = function () {
    $board.on("blur", ".cell input", blurHandler);
    $board.on("focus", ".cell input", focusHandler);
    $board.on("keyup", ".cell input", keyupHandler);
    $board.on("keydown", ".cell input", keydownHandler);
  }

  var setupNotes = function () {
    $notes.on("click", function () {
      self.annotationMode(!self.annotationMode());
    });
  }

  setupBoard();
  setupNotes();

  return self;
}
