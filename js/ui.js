var Sudoku = Sudoku || {};
Sudoku.UI = function (container) {
  var self = {};

  var solver = new Sudoku.Solver();
  var puzzle = null;
  var currentPuzzle = null;
  var shiftDown = false;

  self.dismissDialog = function () {
    var element = $(".dialog", container).get(0);
    $(".dialog", container).removeClass("appear");
    element.offsetWidth = element.offsetWidth;
    $(".dialog", container).addClass("dismissed");
    dismissTimeout = setTimeout(function () { $(".dialog").hide().removeClass("dismissed"); }, 400);
    $(".overlay", container).fadeOut(300);
  }
  self.showDialog = function (message, btn1, btn2) {
    var noop = function (){};
    $(".overlay", container).fadeIn(700);
    $(".dialog", container).removeClass("dismissed").addClass("appear").show();
    $(".dialog .message", container).html(message || "");
    if (btn1) {
      $(".dialog .button.btn1", container).show().text(btn1.text || "Yes").off("click").on("click", function (e) {
        if ((btn1.action || noop)(e) !== false) {
          self.dismissDialog();
        }
      });
    } else {
      $(".dialog .button.btn1", container).hide();
    }
    if (btn2) {
      $(".dialog .button.btn2", container).show().text(btn2.text || "No").off("click").on("click", function (e) {
        if ((btn2.action || noop)(e) !== false) {
          self.dismissDialog();
        }
      });
    } else {
      $(".dialog .button.btn2", container).hide();
    }
  };
  self.showAbout = function () {

  }
  self.clearPuzzle = function () {
    $(".puzzle", container).remove();
  }
  self.newGame = function () {
    self.clearPuzzle();
    var grid = Sudoku.Maker.random();
    puzzle = new Sudoku.Puzzle(grid);
    currentPuzzle = puzzle.clone();
    self.draw(puzzle).appendTo(container);
  }
  self.solveGame = function () {
    if (!puzzle) return;
    var markedPuzzle = currentPuzzle.clone();
    solved = solver.solve(markedPuzzle);
    if (!solved) {
      self.showDialog("We can't solve this puzzle! It's impossible!", { text: "Oh no!" });
      return false;
    }
    $(".puzzle .cell input", container).each(function () {
      var x = $(this).data("x");
      var y = $(this).data("y");
      if (markedPuzzle.get(x,y) == 0) {
        $(this).val(solved.get(x,y));
      }
    })
  }
  self.checkPuzzle = function () {
    if (!currentPuzzle) return;
    var markedPuzzle = currentPuzzle.clone();
    var markAll = solver.markAll(markedPuzzle);
    var deduce = solver.deduce(markedPuzzle);
    var reduce = solver.reduce(markedPuzzle);
    console.log("markAll:", markAll+'', "deduce:", deduce, "reduce:", reduce);
    if (!markAll ||
        deduce === undefined ||
        reduce === undefined) {
      self.showDialog("Uh oh, something doesn't look right!", { text: "Okay..." });
    } else {
      self.showDialog("Yay, everything looks good!", { text: "Okay!" });
    }
  }

  $("header", container).click(function () {
    $("header .trigger", container).removeClass("appear");
    $(this).addClass("shown");
    return false;
  })
  $("header nav .new", container).click(function () {
    self.showDialog("Start a new game?<br />This will clear your progress!",
      { action: function () {
          return self.newGame();
      }}, {});
  })
  $("header nav .solve", container).click(function () {
    self.showDialog("Solve this puzzle for you?<br />(Complex puzzles may take a while!)",
      { action: function () {
          return self.solveGame();
      }}, {});
  })
  $("header nav .check", container).click(function () {
    self.checkPuzzle();
  })
  $("header nav .about", container).click(function () {
    self.showDialog([
      "This Sudoku game was crafted with love.", "",
      "Made in Toronto, Canada.",
      "Leander Lee &copy 2014."
    ].join("<br />"), { text: "Okay!" });
  })
  $("body").click(function () {
    $("header .trigger", container).addClass("appear");
    $("header").removeClass("shown");
  })

  self.draw = function (puzzle) {
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
            var x = (j*n) + m;
            var y = (i*n) + k;
            var v = puzzle.get(x,y);
            if (v !== 0) {
              $input.val(v);
              $input.addClass('given');
              $input.attr('readonly', true);
              $input.attr("data-v", v);
            }
            $input.attr("data-x", x);
            $input.attr("data-y", y);
            $input.appendTo($cell);
            $input.blur(function(e) {
              $(".puzzle input.guide").removeClass("guide");
              $(".puzzle input.similar").removeClass("similar");
            });
            $input.focus(function(e) {
              var x = $(this).data("x");
              var y = $(this).data("y");
              var n = currentPuzzle.n()*currentPuzzle.n();
              var v = currentPuzzle.get(x,y);
              for (var i = 0; i < n; i++) {
                if (i != x) $(".puzzle input[data-x=" + i + "][data-y=" + y + "]", container).addClass("guide");
                if (i != y) $(".puzzle input[data-x=" + x + "][data-y=" + i + "]", container).addClass("guide");
              }
              if (v) {
                $(".puzzle input[data-v='" + v + "']", container).addClass("similar");
              }
            });
            $input.keyup(function(e) {
              var keyCode = (window.event) ? e.which : e.keyCode;
              switch (keyCode) {
                case VK_SHIFT: shiftDown = false; break;
                default: break;
              }
            });
            $input.keydown(function(e) {
              var keyCode = (window.event) ? e.which : e.keyCode;
              var n = currentPuzzle.n()*currentPuzzle.n();
              var x = $(this).data("x");
              var y = $(this).data("y");
              switch (keyCode) {
                case VK_SHIFT: shiftDown = true; break;
                case VK_LEFT: $(".puzzle input[data-x=" + ((n+x-1)%n) + "][data-y=" + y + "]", container).focus(); break;
                case VK_RIGHT: $(".puzzle input[data-x=" + ((x+1)%n) + "][data-y=" + y + "]", container).focus(); break;
                case VK_UP: $(".puzzle input[data-x=" + x + "][data-y=" + ((n+y-1)%n) + "]", container).focus(); break;
                case VK_DOWN: $(".puzzle input[data-x=" + x + "][data-y=" + ((y+1)%n) + "]", container).focus(); break;
                case VK_ENTER:
                case VK_TAB:
                  if (shiftDown) {
                    $(".puzzle input[data-x=" + (x == 0 ? n-1 : x-1) + "][data-y=" + ((n+y-(x == 0 ? 1 : 0))%n) + "]", container).focus(); break;
                  } else {
                    $(".puzzle input[data-x=" + (x == n-1 ? 0 : x+1) + "][data-y=" + ((y+(x == n-1 ? 1 : 0))%n) + "]", container).focus(); break;
                  }
                case VK_BACKSPACE:
                case VK_NUMBER_0:
                case VK_NUMPAD_0: currentPuzzle.set(x,y,0); $(this).attr('data-v', '').val('').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_1:
                case VK_NUMPAD_1: currentPuzzle.set(x,y,1); $(this).attr('data-v', '1').val('1').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_2:
                case VK_NUMPAD_2: currentPuzzle.set(x,y,2); $(this).attr('data-v', '2').val('2').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_3:
                case VK_NUMPAD_3: currentPuzzle.set(x,y,3); $(this).attr('data-v', '3').val('3').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_4:
                case VK_NUMPAD_4: currentPuzzle.set(x,y,4); $(this).attr('data-v', '4').val('4').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_5:
                case VK_NUMPAD_5: currentPuzzle.set(x,y,5); $(this).attr('data-v', '5').val('5').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_6:
                case VK_NUMPAD_6: currentPuzzle.set(x,y,6); $(this).attr('data-v', '6').val('6').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_7:
                case VK_NUMPAD_7: currentPuzzle.set(x,y,7); $(this).attr('data-v', '7').val('7').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_8:
                case VK_NUMPAD_8: currentPuzzle.set(x,y,8); $(this).attr('data-v', '8').val('8').trigger("blur").trigger("focus"); break;
                case VK_NUMBER_9:
                case VK_NUMPAD_9: currentPuzzle.set(x,y,9); $(this).attr('data-v', '9').val('9').trigger("blur").trigger("focus"); break;
                default: break;
              }
              e.preventDefault();
            });
            $input.keyup(function(e) {
              var val = parseInt($(this).val());
              currentPuzzle.set($(this).data("x"), $(this).data("y"), (!isNaN(val) ? val : 0));
            });
            $input.hide().fadeIn(2000+Math.random()*2000);
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
