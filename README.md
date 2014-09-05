Sudoku Solver
======

### A Front End Engineer Coding Challenge.
Using HTML, CSS and JavaScript, create a functional and stylized Sudoku game.


## About this README
This README outlines the structure of your application and technologies used,
the reasoning behind your technical choices, and any trade-offs I made or 
changes I would have implemented if I had additional time.

## Technical Design

### Puzzle/Solver Relationship
I decided it would be best to have an object, `Puzzle`, that is controlled by
a `Solver` entity that manipulates the puzzle until it is in a solved state.

I chose this approach compared to other approach because it separates the
nitty-gritty rules about Sudoku into the `Puzzle` class, and the `Solver` just
focuses on what to do when we are stuck (backtracking; see next section).

The good thing with this design is that we can always expand `Puzzle` to be
more useful by adding [http://www.su-doku.net/tech.php](more techniques).

### Solver Algorithm
Once the puzzle can no longer be solved "obviously", i.e. a guess needs to be
made, we need to keep track of the guesses we have made, and backtrack when
we have decided that it is no longer feasible. Luckily, this is easy to do
since the `Puzzle` class already handles checking if the solution is feasible
or not.

### Maker/Puzzle Relationship
Instead of defining puzzles from the instantiation, I decided it would
be a good idea to use a Maker object. This allows us to add more logic in the
future to create puzzles (with various levels of difficulties).

### DOM/UI Class Relationship
I decided to use a UI class to control the state of the DOM elements.

## Further Expansion
