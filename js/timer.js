var Sudoku = Sudoku || {};
Sudoku.Timer = function ($timer, onPause, onResume) {
  onPause = onPause || function(){};
  onResume = onResume || function(){};

  var isPaused = false;
  var timer = null;
  var startTime = 0;
  var currentTime = 0;
  var previousDuration = 0;
  var duration = 0;
  var updateInterval = 400; // ms

  // Returns string representation of duration of timer.
  self.duration = function () {
    var hrs = Math.floor(duration/3600);
    duration = duration % 3600;
    var mins = Math.floor(duration/60);
    var secs = duration % 60;
    return (hrs > 0 ? hrs + ":" : '') + (mins < 10 ? '0':'') + mins + ":" + (secs < 10 ? '0':'') + secs;
  }

  // Starts the timer
  self.start = function () {
    previousDuration = 0;
    duration = 0;
    self.resume();
  }

  // Resumes the timer if paused, forces update if already running.
  self.resume = function () {
    startTime = new Date().getTime();
    if (timer) clearInterval(timer);
    timer = setInterval(function () { self.update() }, updateInterval);
    self.update();
    isPaused = false;
    onResume.call(self);
  }

  // Pauses the timer, if it is running. Doesn't do anything otherwise.
  self.pause = function () {
    if (isPaused) return;
    currentTime = new Date().getTime();
    duration = Math.floor((currentTime - startTime)/1000);
    previousDuration += duration;
    if (timer) clearInterval(timer);
    isPaused = true;
    onPause.call(self);
  }

  // Calls every <updateInterval> ms to update the timer text.
  self.update = function () {
    currentTime = new Date().getTime();
    duration = previousDuration + Math.floor((currentTime - startTime)/1000);
    $(".time", $timer).text(self.duration());
  }

  // Returns boolean of whether or not it is paused.
  self.isPaused = function () {
    return isPaused;
  }

  var setupTimer = function () {
    $timer.click(function (e) {
      if (isPaused) {
        self.resume();
        $("i", $timer).removeClass("icon-play").addClass("icon-pause");
      } else {
        self.pause();
        $("i", $timer).addClass("icon-play").removeClass("icon-pause");
      }
      return false;
    });
  }

  setupTimer();

  return self;
};
