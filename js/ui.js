var Sudoku = Sudoku || {};
Sudoku.UI = function (container) {
  var self = {};

  var solver = new Sudoku.Solver();
  var puzzle = null;
  var currentPuzzle = null;

  self.dismissDialog = function () {
    var element = $(".dialog", container).get(0);
    $(".dialog", container).removeClass("appear");
    element.offsetWidth = element.offsetWidth;
    $(".dialog", container).addClass("dismissed");
    setTimeout(function () { $(".dialog").hide().removeClass("dismissed"); }, 400);
    $(".overlay", container).fadeOut(300);
  }
  self.showDialog = function (message, btn1, btn2) {
    var noop = function (){};
    $(".overlay", container).fadeIn(700);
    $(".dialog", container).addClass("appear").show();
    $(".dialog .message", container).html(message || "");
    if (btn1) {
      $(".dialog .button.btn1", container).show().text(btn1.text || "Yes").off("click").on("click", btn1.action || noop);
    } else {
      $(".dialog .button.btn1", container).hide();
    }
    if (btn2) {
      $(".dialog .button.btn2", container).show().text(btn2.text || "No").off("click").on("click", btn2.action || noop);
    } else {
      $(".dialog .button.btn2", container).hide();
    }
    $(".dialog .button", container).click(function () {
      self.dismissDialog();
    });
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
      return self.showDialog("We can't solve this puzzle! It's impossible!", { text: "Oh no!" });
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
          self.newGame();
      }}, {});
  })
  $("header nav .solve", container).click(function () {
    self.showDialog("Solve this puzzle for you?<br />(Complex puzzles may take a while!)",
      { action: function () {
          self.solveGame();
      }}, {});
  })
  $("header nav .check", container).click(function () {
    self.checkPuzzle();
  })
  $("header nav .about", container).click(function () {
    self.showDialog([
      "This Sudoku game was crafted with love by Leander Lee.", "",
      "Made in Toronto, ON, Canada.",
      "Leander Lee &copy 2014."
    ].join("<br />"), { text: "Okay!" });
  })
  $("body").click(function () {
    $("header .trigger", container).addClass("appear");
    $("header").removeClass("shown");
  })

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
            var x = (j*n) + m;
            var y = (i*n) + k;
            if (puzzle.get(x,y) !== 0) {
              $input.val(puzzle.get(x,y));
              $input.addClass('given');
              $input.attr('readonly', true);
            }
            $input.data("x", x);
            $input.data("y", y);
            $input.appendTo($cell);
            $input.keydown(function(e) {
              var a=[8,9,13,16,17,18,20,27,35,36,37,38,39,40,45,46,91,92];
              var k = e.which;
              for (i = 49; i < 58; i++) a.push(i);
              for (i = 97; i < 106; i++) a.push(i);
              if (a.indexOf(k) < 0) e.preventDefault();
              $(this).val('');
            });
            $input.keyup(function(e) {
              var val = parseInt($(this).val());
              console.log($(this).data("x"), $(this).data("y"), (!isNaN(val) ? val : 0));
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
