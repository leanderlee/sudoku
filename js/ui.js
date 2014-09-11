var Sudoku = Sudoku || {};
Sudoku.UI = function (container) {
  var self = {};

  var solver = new Sudoku.Solver();
  var dialog = new Sudoku.Dialog($(".dialog", container), $(".overlay", container));
  var board = new Sudoku.Board($(".puzzle", container), $(".notes", container), finishHandler);

  var $header = $("header", container);

  var pauseHandler = function () {
    $("body").trigger("click");
    $header.addClass("paused");
    board.hide();
  };
  var resumeHandler = function () {
    $header.removeClass("paused");
    board.show();
  };

  var timer = new Sudoku.Timer($(".timer", container), pauseHandler, resumeHandler);

  var finishHandler = function () {
    timer.pause();
    dialog.show("Congratulations! You have finished this puzzle in " + timer.duration() + "!", { text: "Awww yeah!" });
  };
  var newHandler = function () {
    var newPuzzle = function () {
      self.newGame();
    }
    dialog.show("Start a new game?<br />This will clear your progress!", { action: newPuzzle }, {});
  };
  var solveHandler = function () {
    var solvePuzzle = function () {
      var markedPuzzle = board.puzzle();
      solved = solver.solve(markedPuzzle);
      if (!solved) {
        dialog.show("We can't solve this puzzle! It's impossible!", { text: "Oh no!" });
        return false;
      }
      board.fill(solved);
    };
    dialog.show("Solve this puzzle for you?<br />(Complex puzzles may take a while!)", { action: solvePuzzle }, {});
  };
  var checkHandler = function () {
    if (solver.isConsistent(board.puzzle())) {
      dialog.show("Yay, everything looks good!", { text: "Okay!" });
    } else {
      dialog.show("Uh oh, something doesn't look right!", { text: "Okay..." });
    }
  };
  var aboutHandler = function () {
    dialog.show([
      "This Sudoku game was crafted with love.", "",
      "Made in Toronto, Canada.",
      "Leander Lee &copy 2014.", "",
      "<a target='_blank' href='https://github.com/leanderlee/sudoku'>Fork me on <i class='icon-github-circled'></i></a>",
      "<a target='_blank' href='https://twitter.com/leanderlee'>Follow me on <i class='icon-twitter'></i></a>",
      "<a target='_blank' href='https://linkedin.com/in/leanderlee'>Connect with me on <i class='icon-linkedin'></i></a>",
    ].join("<br />"), { text: "Okay!" });
  };

  var setupHeader = function () {
    $("header .trigger", container).click(function () {
      if (timer.isPaused()) return;
      $(".trigger", $header).removeClass("appear");
      $header.addClass("shown");
      return false;
    });
    $("body").click(function () {
      $(".trigger", $header).addClass("appear");
      $header.removeClass("shown");
    });
  };
  var setupNavigation = function () {
    $("header nav .new", container).click(newHandler)
    $("header nav .solve", container).click(solveHandler)
    $("header nav .check", container).click(checkHandler)
    $("header nav .about", container).click(aboutHandler)
  };

  setupHeader();
  setupNavigation();


  // The only public method. It starts a new game.
  // Defaults to easiest and 9x9 Sudoku.
  self.newGame = function (difficulty, n) {
    difficulty = difficulty || 0;
    n = n || 3;

    timer.start();
    puzzle = Sudoku.Maker.random(difficulty, n);
    board.puzzle(puzzle);
    board.clear();
    board.draw();
  };

  return self;
};
