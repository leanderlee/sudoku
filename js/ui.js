var Sudoku = Sudoku || {};
Sudoku.UI = function (container) {
  var self = {};

  var solver = new Sudoku.Solver();
  var puzzle = null;
  var currentPuzzle = null;
  var shiftDown = false;
  var timer = null;
  var startTime = null;
  var previousDuration = 0;

  var durationStr = function (duration) {
    var hrs = Math.floor(duration/3600)
    duration = duration % 3600;
    var mins = Math.floor(duration/60)
    var secs = duration % 60;
    return (hrs > 0 ? hrs + ":" : '') + (mins < 10 ? '0':'') + mins + ":" + (secs < 10 ? '0':'') + secs;
  }
  self.startTimer = function () {
    previousDuration = 0;
    $(".timer .time").text("00:00");
    self.resumeTimer();
  }
  self.resumeTimer = function () {
    startTime = new Date().getTime();
    if (timer) clearInterval(timer);
    timer = setInterval(function () { self.updateTimer() }, 400);
    $(".puzzle,header", container).removeClass("paused");
  }
  self.pauseTimer = function () {
    var currentTime = new Date().getTime();
    var duration = Math.floor((currentTime - startTime)/1000);
    previousDuration += duration;
    if (timer) clearInterval(timer);
    $(".puzzle,header", container).addClass("paused");
  }
  self.updateTimer = function () {
    var currentTime = new Date().getTime();
    var duration = previousDuration + Math.floor((currentTime - startTime)/1000);
    $(".timer .time").text(durationStr(duration));
  }
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
    $(".overlay", container).fadeIn(700).click(function () { self.dismissDialog(); });
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
    self.startTimer();
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
        var v = solved.get(x,y);
        currentPuzzle.set(x,y,v);
        $(this).attr("data-v", v+'');
        $(this).val(v);
      }
    })
  }
  self.checkPuzzle = function () {
    if (!currentPuzzle) return;
    var markedPuzzle = currentPuzzle.clone();
    var markAll = solver.markAll(markedPuzzle);
    var deduce = solver.deduce(markedPuzzle);
    var reduce = solver.reduce(markedPuzzle);
    if (!markAll ||
        deduce === undefined ||
        reduce === undefined) {
      self.showDialog("Uh oh, something doesn't look right!", { text: "Okay..." });
    } else {
      self.showDialog("Yay, everything looks good!", { text: "Okay!" });
    }
  }

  $("header .trigger", container).click(function () {
    if ($(this).parents("header").hasClass("paused")) return;
    $("header .trigger", container).removeClass("appear");
    $(this).parents("header").addClass("shown");
    return false;
  })
  $("header .timer", container).click(function (e) {
    if ($(".puzzle", container).hasClass("paused")) {
      self.resumeTimer();
      $("i", this).removeClass("icon-play").addClass("icon-pause");
    } else {
      self.pauseTimer();
      $("i", this).addClass("icon-play").removeClass("icon-pause");
    }
    return false;
  });
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
      "Leander Lee &copy 2014.", "",
      "<a target='_blank' href='https://github.com/leanderlee/sudoku'>Fork me on <i class='icon-github-circled'></i></a>",
      "<a target='_blank' href='https://twitter.com/leanderlee'>Follow me on <i class='icon-twitter'></i></a>",
      "<a target='_blank' href='https://linkedin.com/in/leanderlee'>Connect with me on <i class='icon-linkedin'></i></a>",
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
            $input.hide().fadeIn(2000+Math.random()*2000);
            $cell.appendTo($row);
          }
          $row.appendTo($box);
        }
        $box.appendTo($boxRow);
      }
      $boxRow.appendTo($puzzle);
    }

    var clearColours = function () {
      $("input.guide", $puzzle).removeClass("guide");
      $("input.similar", $puzzle).removeClass("similar");
    };

    $(".cell input", $puzzle).on("blur", function(e) {
      clearColours();
      // iOS fix
      setTimeout(function() {
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
      }, 0);
    });
    $(".cell input", $puzzle).on("focus", function(e) {
      var x = $(this).data("x");
      var y = $(this).data("y");
      var n = currentPuzzle.n()*currentPuzzle.n();
      var v = currentPuzzle.get(x,y);
      for (var i = 0; i < n; i++) {
        if (i != x) $(".puzzle input[data-x=" + i + "][data-y=" + y + "]", container).addClass("guide");
        if (i != y) $(".puzzle input[data-x=" + x + "][data-y=" + i + "]", container).addClass("guide");
      }
      if (v) {
        $(".puzzle input[data-v='" + v + "']", container).not(this).addClass("similar");
      }
    });
    $(".cell input", $puzzle).on("keyup", function(e) {
      var keyCode = (window.event) ? e.which : e.keyCode;
      var val = parseInt($(this).val());
      currentPuzzle.set($(this).data("x"), $(this).data("y"), (!isNaN(val) ? val : 0));
      switch (keyCode) {
        case VK_SHIFT: shiftDown = false; break;
        default: break;
      }
    });
    $(".cell input", $puzzle).on("keydown", function(e) {
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
        default: break;
      }
      if (puzzle.get(x,y) !== 0) return e.preventDefault();
      switch (keyCode) {
        case VK_BACKSPACE:
        case VK_NUMBER_0:
        case VK_NUMPAD_0: currentPuzzle.set(x,y,0); clearColours(); $(this).attr('data-v', '').val('').trigger("focus"); break;
        case VK_NUMBER_1:
        case VK_NUMPAD_1: currentPuzzle.set(x,y,1); clearColours(); $(this).attr('data-v', '1').val('1').trigger("focus"); break;
        case VK_NUMBER_2:
        case VK_NUMPAD_2: currentPuzzle.set(x,y,2); clearColours(); $(this).attr('data-v', '2').val('2').trigger("focus"); break;
        case VK_NUMBER_3:
        case VK_NUMPAD_3: currentPuzzle.set(x,y,3); clearColours(); $(this).attr('data-v', '3').val('3').trigger("focus"); break;
        case VK_NUMBER_4:
        case VK_NUMPAD_4: currentPuzzle.set(x,y,4); clearColours(); $(this).attr('data-v', '4').val('4').trigger("focus"); break;
        case VK_NUMBER_5:
        case VK_NUMPAD_5: currentPuzzle.set(x,y,5); clearColours(); $(this).attr('data-v', '5').val('5').trigger("focus"); break;
        case VK_NUMBER_6:
        case VK_NUMPAD_6: currentPuzzle.set(x,y,6); clearColours(); $(this).attr('data-v', '6').val('6').trigger("focus"); break;
        case VK_NUMBER_7:
        case VK_NUMPAD_7: currentPuzzle.set(x,y,7); clearColours(); $(this).attr('data-v', '7').val('7').trigger("focus"); break;
        case VK_NUMBER_8:
        case VK_NUMPAD_8: currentPuzzle.set(x,y,8); clearColours(); $(this).attr('data-v', '8').val('8').trigger("focus"); break;
        case VK_NUMBER_9:
        case VK_NUMPAD_9: currentPuzzle.set(x,y,9); clearColours(); $(this).attr('data-v', '9').val('9').trigger("focus"); break;
        default: break;
      }
      if (currentPuzzle.isSolved()) {
        self.pauseTimer();
        self.showDialog("Congratulations! You have finished this puzzle in " + durationStr(previousDuration) + "!", { text: "Awww yeah!" });
      }
      e.preventDefault();
    });
    return $puzzle;
  }

  return self;
};
