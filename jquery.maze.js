function generateMaze(height, width, allow_connections, min_goal_distance, maze_max_branches, maze_branch_include, min_steps) {
  var maze = {};
  var grid = {};
  for (var k = 0; k < height; k++) {
    grid[k] = {};
    for (var j = 0; j < width; j++) {
      grid[k][j] = {
        open: false,
        start: false,
        available: false,
        skip: false,
        goal: false
      };
    }
  }
  
  var locations = [];
  if (min_goal_distance > 1) {
    min_goal_distance = 1;
  }
  if (maze_max_branches === undefined) {
    maze_max_branches = 4;
  }
  maze.min_steps = min_steps;
  if (maze.min_steps < 20) {
    maze.min_steps = 20;
  }
  maze.allow_connections = allow_connections;
  maze.max_branch = maze_max_branches;
  maze.branch_include = maze_branch_include;
  if (maze.branch_include < 0.05) {
    maze.branch_include = 0.05;
  }
  else if (maze.branch_include > 1) {
    maze.branch_include = 1;
  }
  maze.steps = 0;
  maze.start_x = Math.floor(Math.random() * (height));
  maze.start_y = Math.floor(Math.random() * (width));
  
  maze.max_x = height - 1;
  maze.max_y = width - 1;
  locations.push({x: maze.start_x, y: maze.start_y});
  maze.locations = locations;
  maze.grid = grid;
  maze.grid[maze.start_x][maze.start_y].available = true;
  maze.grid[maze.start_x][maze.start_y].start = true;
  maze.best_distance = 0;
  mazeStep(maze);
  maze.min_goal = maze.best_distance * min_goal_distance;
  mazePickWinner(maze);
  return maze;
}

function mazePickWinner(maze) {
  var winners = [];
  for (var k = 0; k <= maze.max_x; k++) {
    for (var j = 0; j <= maze.max_y; j++) {
      if (maze.grid[k][j].open) {
        var x_diff = Math.abs(k - maze.start_x);
        var y_diff = Math.abs(j - maze.start_y);
        var distance = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
        if (distance >= maze.min_goal) {
          winners.push({x: k, y: j});
        }
      }
    }
  }
  var winner = winners[Math.floor(Math.random() * winners.length)];
  if (winner !== undefined) {
    maze.goal_x = winner.x;
    maze.goal_y = winner.y;
    maze.grid[winner.x][winner.y].goal = true;
  }
}

function removeMazeOption(maze, x, y) {
  for (var k = 0; k < maze.locations.length; k++) {
    if (maze.locations[k].x == x &&
          maze.locations[k].y == y) {
      maze.locations.splice(k, 1);
      return;
    }
  }
}

function mazeStep(maze) {
  var key = Math.floor(Math.random() * maze.locations.length);
  var locationSelect = maze.locations[key];
  maze.locations.splice(key, 1);
  maze.grid[locationSelect.x][locationSelect.y].open = true;
  maze.grid[locationSelect.x][locationSelect.y].available = false;
  var distance = Math.sqrt(
          Math.pow(Math.abs(locationSelect.x - maze.start_x), 2) + 
          Math.pow(Math.abs(locationSelect.y - maze.start_y), 2)
  );
  if (distance > maze.best_distance) {
    maze.best_distance = distance;
  }
  var optionsSorted = [];
  optionsSorted.push({x: locationSelect.x + 1, y: locationSelect.y});
  optionsSorted.push({x: locationSelect.x - 1, y: locationSelect.y});
  optionsSorted.push({x: locationSelect.x, y: locationSelect.y + 1});
  optionsSorted.push({x: locationSelect.x, y: locationSelect.y - 1});
  var options = [];
  while (optionsSorted.length > 0) {
    var index = Math.floor(Math.random() * optionsSorted.length);
    options.push(optionsSorted[index]);
    optionsSorted.splice(index, 1);
  }
  var acceptable = maze.max_branch + 0;
  var added = false;
  for (k = 0; k < options.length; k++) {
    if (options[k].x < 0 || 
            options[k].y < 0 || 
            options[k].x > maze.max_x || 
            options[k].y > maze.max_y ||
          maze.grid[options[k].x][options[k].y].skip ||
        maze.grid[options[k].x][options[k].y].open) {
      
    }
    else if (!maze.allow_connections && maze.grid[options[k].x][options[k].y].available) {
      removeMazeOption(maze, options[k].x, options[k].y);
      maze.grid[options[k].x][options[k].y].skip = true;
      maze.grid[options[k].x][options[k].y].available = false;
    }
    else {
      maze.grid[options[k].x][options[k].y].available = true;
      if (acceptable > 0) {
        var add = true;
        if (added && maze.steps > maze.min_steps) {
          add = Math.random() < maze.branch_include;
        }
        if (add) {
          added = true;
          maze.locations.push(options[k]);
          acceptable--;
        }
      }
    }
  }
  maze.steps++;
  if (maze.locations.length > 0) {
    mazeStep(maze);
  }
}

function mazeMoveTo(x,y) {
  if (x >= 0 &&
        y >= 0 &&
      x <= maze.max_x &&
      y <= maze.max_y &&
      maze.grid[x][y].open) {
    if (maze.trace) {
      $('.maze-active').addClass('maze-trace');
    }
    $('.maze-active').removeClass('maze-active');
    $('#maze_' + x + '_' + y).addClass('maze-active');
    maze_x = x;
    maze_y = y;
    if (maze_x == maze.goal_x &&
          maze_y == maze.goal_y) {
      mazeVictory(false);
    }
  }
}

function mazeVictory(cheater) {
  if (cheater) {
    $('#maze').html('You have beaten the maze!!');
  }
  else {
    $('#maze').html('You have beaten the maze!');
  }
}


var maze;
var maze_x;
var maze_y;
var maze_commands = [];

jQuery.fn.generateMaze = function(attributes) {
  if (attributes === undefined) {
    attributes = {};
  }
  //alert(attributes.complexity);
  settings = {
    min_distance: 0.5,
    size_x: 50,
    size_y: false,
    callback: 'mazeVictory',
    cheater: false,
    complexity: 1,
    variability: 1,
    min_steps: 20,
    trace: false,
    connect: false
  };
  jQuery.extend(settings, attributes);
  if (settings.size_y === false) {
    settings.size_y = settings.size_x;
  }
  maze = generateMaze(settings.size_y, settings.size_x, settings.connect, settings.min_distance, settings.complexity, settings.variability, settings.min_steps);
  maze.victory = settings.callback;
  maze.allowCheat = settings.cheater;
  maze.trace = settings.trace;
  maze_x = maze.start_x;
  maze_y = maze.start_y;
  var html = '';
  for (var k = 0; k <= maze.max_x; k++) {
    for (var j = 0; j <= maze.max_y; j++) {
      html = html + '<div id="maze_'+k+'_'+j+'" class="maze-cell';
      if (j == 0) {
        html += ' maze-row-start';
      }
      if (maze.grid[k][j].start) {
        html = html + ' maze-start maze-active';
      }
      else if (maze.grid[k][j].goal) {
        html = html + ' maze-goal';
      }
      else if (!maze.grid[k][j].open) {
        html = html + ' maze-block';
      }
      html = html + '"></div>';
    }
  }
  html += '<br style="clear: both;" />';
  $(this).html(html);
  //$(this).attr('style', 'height: ' + (((maze.max_y + 1) * 15) - 22) + 'px; width: '+((maze.max_x + 1) * 15)+'px;');  
}

$(document).keydown(function(event) {
  if (maze.allowCheat) {
    maze_commands.push(event.which);
    if (maze_commands.length > 8) {
      maze_commands.splice(1, 1);
    }
    if (maze_commands.length == 8 &&
        maze_commands[0] == 85 &&
        maze_commands[1] == 85 &&
        maze_commands[2] == 68 &&
        maze_commands[3] == 68 &&
        maze_commands[4] == 76 &&
        maze_commands[5] == 82 &&
        maze_commands[6] == 76 &&
        maze_commands[7] == 82
      ) {
          mazeVictory(true);
    }
  }
  switch (event.which) {
    case 119:
    case 87:
    case 38:
      mazeMoveTo(maze_x - 1, maze_y);
      // UP
      break;
    case 97:
    case 65:
    case 37:
      mazeMoveTo(maze_x, maze_y - 1);
      // LEFT
      break;
    case 115:
    case 83:
    case 40:
      mazeMoveTo(maze_x + 1, maze_y);
      // DOWN
      break;
    case 100:
    case 68:
    case 39:
      mazeMoveTo(maze_x, maze_y + 1);
      // RIGHT
      break;
    default:
  }
});