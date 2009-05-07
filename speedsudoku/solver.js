// ==UserScript==
// @name           Sudoku Solver
// @namespace      jack
// @include        http://www.speedsudoku.com/game.php*
// ==/UserScript==

/*
 * Load the data from the table
 */
var tbody = document.getElementsByClassName('board')[0].getElementsByTagName('tbody')[0];
var puzzle = [];

for (var i=0; i<9; i++) {
	puzzle.push([]);
	puzzle.push([]);
	for (var j=0; j<9; j++) {
		var cell = tbody.rows[i].cells[j].firstChild;
		if (cell.tagName == 'INPUT') {
			puzzle[i][j] = 0;
		} else {
			puzzle[i][j] = parseInt(cell.data);
		}
	}
}

/*
 * Solve the puzzle
 *
 * We define the sudoku puzzle as a Constraint Satisfaction Problem.
 * - One variable per cell on the 9x9 grid
 * - Domain of each cell is {1,2,...,9}
 * - Constrains:
 *   - cells in subgrid have different values
 *   - cells in a row have different values
 *   - cells in a column have different values
 *
 * We'll solve this CSP using a backtracking algorithm.
 *
 */
if (solve()) {
	for (var i=0; i<9; i++) {
		for (var j=0; j<9; j++) {
			var cell = tbody.rows[i].cells[j].firstChild;
			if (cell.tagName == 'INPUT') {
				cell.value = puzzle[i][j];
			}
		}
	}
}

function remaining(i, j) {
    // values[i] true if value i+1 is valid for (i,j)
    var values = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    var count = 0;
   
    // check (i,j)'s row
    for (var k=0; k<9; k++) {
        if (puzzle[i][k] !== 0) {
            // cannot be neighbour's value!
            values[ puzzle[i][k] - 1 ] = 0;
        }
    } // for
       
    // check (i,j)'s column
    for (var l=0; l<9; l++) {
        if (puzzle[l][j] !== 0) {
            // cannot be neighbour's value!
            values[ puzzle[l][j] - 1 ] = 0;
        }
    } // for
       
    var a = 3 * parseInt(i / 3);
    var b = 3 * parseInt(j / 3);
   
    // check (i,j)'s square
    for (var p=a; p<a+3; p++) {
        for (var r=b; r<b+3; r++) {
            if (puzzle[p][r] !== 0) {
            // cannot be neighbour's value!
                values[ puzzle[p][r] - 1 ] = 0;
            }
        } // for
    } // for
       
    // Add up all remaining legal values for (i,j)
    for (var s=0; s<9; s++) {
        count += values[s] ? 1 : 0;
    }
   	
    return count;    // return
}

function setNum(i, j, val) {
    // Check val against row of (i,j)
    for (var k=0; k<9; k++) {
        // There is a violation of constraint
        if (puzzle[i][k] == val) return false;
    } // for
   
    for (var l=0; l<9; l++) {
        // There is a violation of constraint
        if (puzzle[l][j] == val) return false;
    } // for
         
    var a = 3 * parseInt(i / 3);
    var b = 3 * parseInt(j / 3);
    
    for (var p=a; p<a+3; p++) {
        for (var r=b; r<b+3; r++) {
            // There is a violation of constraint
            if (puzzle[p][r] == val) return false;
        } // for
    } // for
   
    // Everything is fine!
    puzzle[i][j] = val;   
    return true;
}

function solve() {
    var i;
    var j;
    var min = 10;
   
    // Pick the node with the most remaining value
    for (var k=0; k<9; k++) {
        for (var l=0; l<9; l++) {
            // if non-zero, then it does not need to be solved (it's a default value)
            if (puzzle[k][l] !== 0) continue;
           
            var curr = remaining(k, l);
           
            if (curr < min) {
                min = curr;
                i = k;
                j = l;
            }
        }
    }
    
    if (min > 9) return true; // base case: no nodes left with legal values
    
    // Try all values on node (i,j)
    for (var k=1; k<10; k++) {
        // Try setting value for (i,j)
        if (setNum(i, j, k)) {
            // 9ow try solving the next node
            if (solve()) return true;
        }
        // reset node
        puzzle[i][j] = 0;
    }
   
    // no valid values found
    return false;
}
