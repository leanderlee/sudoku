## Leander's Sudoku Solver

#### A Front End Engineer Coding Challenge.
Using HTML, CSS and JavaScript, create a functional and stylized Sudoku game.


#### About this README
This README outlines the structure of your application and technologies used,
the reasoning behind your technical choices, and any trade-offs I made or 
changes I would have implemented if I had additional time.

#### Preface
Firstly, I am really enjoying working on this project. I appreciate having the
time to make something awesome from the beginning to the end, and show it to
like-minded people that care in the same way.

This project was primarily sparked by the good guys at Uber that wanted to see
the way I code, and structure my projects. Hopefully, this is up to standard!

#### Using this solver
So, this tool I made is entirely web based. You will need Node.JS 0.8+, Grunt
and ideally a browser or phone to view the app.

You can run it simply by cloning this repo, and running the following commands.

```
   npm install
   grunt
```

You can also run the QUnit tests with
```
   grunt test
```

======

### Technology Choices

 - SASS (for styling)
 - jQuery (for DOM manipulation)
 - Grunt (for live updates and auto build .scss)
 - QUnit (for tests)
 - Bower (for external library management)

Most of these technologies were chosen because I knew them well, and also because
they are quite mainstream. They are well supported and have been relatively well
battle-tested for production environments.
 
### Compatibility
 - Chrome
 - Safari
 - Firefox
 - IE (9+ functional; limited visuals)
 - Opera (now Chrome)
 - iOS (Works well!)
 - Android (Emulation tested only)

### Features

This Sudoku game features a bunch of cool things I wanted to make, including:

 - Custom solver engine
 - Puzzle inconsistency detection
 - Hints
 - Annotation system
 - Responsive layout (for screens of all sizes!)
 - Open font ([Montserrat](http://www.google.com/fonts/specimen/Montserrat))
 - Icon fonts (from [Fontello](http://fontello.com/))
 - CSS3 animated dialogs
 - Row/column tracking
 - Number highlighting
 - Mobile numpad (on iOS, at least)
 - Simplistic UI
 - Start/stop timer

======

### Technical Design

##### Puzzle/Solver Relationship
I decided it would be best to have an object, `Puzzle`, that is controlled by
a `Solver` entity that manipulates the puzzle until it is in a solved state.

I chose this approach compared to other approach because it separates the
data access into the `Puzzle` object, and the nitty-gritty rules about Sudoku
into the `Solver` class. This means that if we wanted, we could plug in an
open source solver that has already been performance tested.

##### Solver Algorithm
The solver currently employs a backtracking approach. Simple approach to this
in psuedo code is something like:
```
solve (puzzle) -> puzzle {
   while reducible
     make a guess
     reduce again
     if inconsistent, try another guess.
     if solved, return
   end
   return false (it is irreducible)
}
```
This is based off a reduce function, which can significantly speed up the
algorithm by implementing [more techniques](http://www.su-doku.net/tech.php).

Currently our reduce algorithm cancels out candidates, as well as checks for
really obvious candidates (naked singles). There is another way to do this 
algorithm, where you fill in the candidates as you go.

##### Maker/Puzzle Relationship
Instead of defining puzzles from the instantiation, I decided it would
be a good idea to use a Maker object. This allows us to add more logic in the
future to create puzzles (with various levels of difficulties).

##### DOM/UI Class Relationship
I decided to use a `UI` class to control the state of the DOM elements. There is a Main.js controller
that kicks off the interface. All it does is instantiate the UI and start a new game.

The `UI` class is the main controller, that assigns the DOM references for the board, timer and dialog
box. It is responsible for the behaviours of the header, such as starting a new game, start/stopping
the timer and coordinating between the puzzle on the board and the menu options. The `UI` class owns a
`Solver` that is responsible for checking consistency of the puzzle and possibly solving the entire
puzzle upon the user's request.

##### Board/UI Class Relationship
The `Board` class is responsible for the activities of the actual Sudoku board. This includes generating
the cells, syncing the puzzle model state with the DOM elements on screen, properly colouring and 
displaying the puzzle, and the annotations system.

### Further Expansion

##### Adding more techniques
As we have aluded to from above, we can make significant performance improvements
by simply implementing more techniques that allow the puzzles to go further
before resolving to a "stuck" state that requires guessing.

Specifically, the ability to recognize more [complex techniques](http://www.su-doku.net/tech2.php),
as described in the link, such as Swordfish, X-Wing and X-Y Wing, and looking at the relationships 
between linked candidates (the principle behind colouring technique.)

##### Keeping track of critical decisions
As we solve the puzzle, the solver should also keep track of which guess would be
the most valuable to completing the puzzle (which decisions will have the most impact.)
I think this might be possible using a priority heap and keeping track of how candidate
decisions will affect other candidates (maybe with a ref count or point system.)

##### Improving the maker
Turns out, creating Sudoku puzzles of varying difficulty efficiently is a fairly challenging problem.
[This paper](http://zhangroup.aporc.org/images/files/Paper_3485.pdf) has a very good approach that I
think we could potentially implement into the maker in the future.

##### N > 3
Sudoku of 16x16, 25x25, and more! That would be awesome. Technically, it's already implemented!

##### Offline storage
Using `localStorage` you could store the serialized version of the puzzle state. That way even if
you accidentally close the page, or hit refresh, you won't lose your puzzle! It's these kinds of
details that will really make this app a usable and pleasant experience for people.

##### Undo/redo stack
I noticed while playing that if I accidentally hit a number while something was selected I would 
overwrite the number in that grid. For better user experience, it would be great if you could undo
your last change!


