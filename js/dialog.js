var Sudoku = Sudoku || {};
Sudoku.Dialog = function ($dialog, $overlay) {
  var self = {};

  var dismissTimeout = null;

  self.dismiss = function () {
    var element = $dialog.get(0);
    $dialog.removeClass("appear");
    element.offsetWidth = element.offsetWidth;
    $dialog.addClass("dismissed");
    dismissTimeout = setTimeout(function () { $dialog.hide().removeClass("dismissed"); }, 400);
    $overlay.fadeOut(300);
  }

  self.show = function (message, btn1, btn2) {
    var noop = function (){};
    $overlay.fadeIn(700).click(function () { self.dismiss(); });
    $dialog.removeClass("dismissed").addClass("appear").show();
    $(".message", $dialog).html(message || "");
    if (btn1) {
      $(".button.btn1", $dialog).show().text(btn1.text || "Yes").off("click").on("click", function (e) {
        if ((btn1.action || noop)(e) !== false) {
          self.dismiss();
        }
      });
    } else {
      $(".button.btn1", $dialog).hide();
    }
    if (btn2) {
      $(".button.btn2", $dialog).show().text(btn2.text || "No").off("click").on("click", function (e) {
        if ((btn2.action || noop)(e) !== false) {
          self.dismiss();
        }
      });
    } else {
      $(".button.btn2", $dialog).hide();
    }
  };

  return self;
}
