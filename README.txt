# jQuery Maze Generator

This is a fun jQuery library that allows you to generate a maze using
Javascript.

To create a maze, include jquery, jquery.maze.js and jquery.maze.css into
your page, and then add a DIV or other HTML object to your page to contain
your maze:

    <div id="maze"></div>

Then, using jQuery, call generateMaze([settings]) on it:

    <script language="javascript" type="text/javascript">
      (function($) {
        $(document).ready(function() {
          $('#maze').generateMaze();
        });
      })(jQuery)
    </script>

The maze automatically picks a starting and ending positions within the maze.
The user viewing it in the browser can use the arrow keys or WSAD in order 
to move the active marker around, from the starting position. Upon 
reaching the ending position, the victory callback is triggered.

The maze is randomly generated each time, from scratch.

There are several settings you can pass to the generateMaze call in order
to customize the maze that is created:

* __size_x__: How many cells will be created in the X axis. Default is
  50.
* __size_y__: How many cells will be created in the Y axis. Defaults to
  the same number as the X axis.
* __trace__: Setting this to true will cause cells that have been visited
  to have an extra class (which turns grey with the default styles).
* __callback__: This function will be called upon completing the maze.
  It takes one parameter which is a boolean indicating whether or not
  the cheat code was used. Default is a function that clears the maze
  and posts a generic victory message.
* __cheater__: This is a boolean value indicating whether or not the
  cheat code can be used to win. Defaults to false.
* __complexity__: This is an integer between 1 and 4. It controls how
  many options are generated (at most) from each new step in the maze creation
  process. For example, setting it to 1 will generate only one path
  for the user to follow. Setting it to 2 will allow up to 2 branches
  at each point. Setting it to 4 will allow all possibilities to be explored.
  The default value is 2.
* __variability__: This is a real value between 0 and 1. It affects the 
  chance of a branch being added beyond the first one. For example, if
  complexity is set to 2 and variability is set to 0.5, there is a 100%
  chance of the first randomly selected adjacent path being added and a 50%
  chance of the second randomly selected path being added, and then a 0%
  chance for the other two. The default value is 0.8.
* __min_steps__: This is an integer value greater than or equal to 0. If
  greater than 0, the variability factor will be ignored for that many steps.
  The default value is 30.
* __min_distance__: This is a real value between 0 and 1. It controls the 
  minimum distance between the starting position and the ending position.
  The minimum distance is equal to the distance between the starting
  position and the furthest reachable point times this value. A 
  setting of 0 would allow the starting position to be right beside 
  the ending position whereas a setting of 1 would force the ending 
  position to one of the furthest points from the starting point. The
  default value is 0.5
