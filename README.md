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
Chrome, Firefox, IE, Opera, iOS, Android

### Technical Design

##### Puzzle/Solver Relationship
I decided it would be best to have an object, `Puzzle`, that is controlled by
a `Solver` entity that manipulates the puzzle until it is in a solved state.

I chose this approach compared to other approach because it separates the
data access into the `Puzzle` object, and the nitty-gritty rules about Sudoku
into the `Solver` class. This means that if we wanted, we could plug in an
open source solver that has already been performance tested.

The good thing with this design is that we can always expand `Puzzle` to be
more useful by adding [more techniques](http://www.su-doku.net/tech.php).

##### Solver Algorithm
Once the puzzle can no longer be solved "obviously", i.e. a guess needs to be
made, we need to keep track of the guesses we have made, and backtrack when
we have decided that it is no longer feasible. Luckily, this is easy to do
since the `Puzzle` class already handles checking if the solution is feasible
or not.

##### Maker/Puzzle Relationship
Instead of defining puzzles from the instantiation, I decided it would
be a good idea to use a Maker object. This allows us to add more logic in the
future to create puzzles (with various levels of difficulties).

##### DOM/UI Class Relationship
I decided to use a UI class to control the state of the DOM elements.

### Further Expansion

##### Adding more techniques
As we have aluded to from above, we can make significant performance improvements
by simply implementing more techniques that allow the puzzles to go further
before resolving to a "stuck" state that requires `Solver` intervention.

The ability to recognize Swordfish, X-Wing and X-Y Wing as well as the reduce 
possibilities from looking at multiple relationships between unrelated candidates 
(the principle behind colouring technique.)

##### Keeping track of critical decisions
As we solve the puzzle, the solver should also keep track of which guess would be
the most valuable to completing the puzzle (which decisions will have the most impact.)
I think this might be possible using a priority heap and keeping track of how candidate
decisions will affect other candidates (maybe with a ref count or point system.)

##### N > 3
Sudoku of 16x16, 25x25, and more! That would be awesome.


