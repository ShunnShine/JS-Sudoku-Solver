
function clickCounter(e) {
    let x = e.clientX - document.getElementById("canvas").getBoundingClientRect().left;
    let y = e.clientY - document.getElementById("canvas").getBoundingClientRect().top;

    let boxClickedX = ~~(x / 50);
    let boxClickedY = ~~(y / 50);

    newBoard.clickSquare(boxClickedX, boxClickedY);
}


class numberPlace {
    constructor() {
        this.known = false;
        this.number = 0;
    }

    getKnown() {
        return this.known;
    }

    getNumber() {
        return this.number;
    }

    setNumber(x) {
        this.number = x;
    }
    startNumber(x) {
        this.number = x;
        this.known = true;
    }

    add1(boxClickedX, boxClickedY) {
        this.number++;
        this.known = true;
        ctx.clearRect(boxClickedX * 50 + 3, boxClickedY * 50 + 3, 45, 45);
        if (this.number == 10) {
            this.number = 0;
            this.known = false;
        }
        else { ctx.fillText(this.number.toString(), boxClickedX * 50 + 25, boxClickedY * 50 + 39); }
    }
}

class board {
    constructor() {
        this.sudoku = new Array(9); //makes the array full of numberPlace objects
        for (var i = 0; i < 9; i++) {
            var x = new Array(9);
            for (var count = 0; count < 9; count++) {
                x[count] = new numberPlace();
            }
            this.sudoku[i] = x;
        }

        this.listenForChanges = true;

    }

    clickSquare(boxClickedX, boxClickedY) {
        if (this.listenForChanges) {
            this.sudoku[boxClickedX][boxClickedY].add1(boxClickedX, boxClickedY);
        }
    }

    getBoard() {
        return this.sudoku;
    }

    solve() {
        var x = 8;                  //
        var y = 8;                  //makes the variables I'll need
        var sudoku = this.sudoku;     //I made it do this becuase of permissions inside of the functions below since they are unable to see the this.sudoku variable. It is not ideal and should be fixed.
        var slider = document.getElementById("timingSlider");




        function nextEmpty() {   //sets the x and y variables to the next unsolved square
            do {
                if (x == 8) {
                    y++;
                    x = 0;
                }
                else
                    x++;
            } while (sudoku[x][y].getKnown());

        }
        function previousEmpty() {  //sets the x and y variables to the previous unknown square
            do {
                if (x == 0) {
                    y--;
                    x = 8;
                }
                else
                    x--;
            } while (sudoku[x][y].getKnown());
        }

        function fill() {   //this trys guesses until it finds one that doesn't conflict anywhere on the board and then saves it to the board.
            var guess = (sudoku[x][y].getNumber() + 1); //sets the guess to the next number


            while (true) {

                if (!(duplicateRow()) && !(duplicateCol()) && !(duplicateBox())) { //if there is no conflicts with the current guess it breaks out of the loop
                    ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                    ctx.fillText(guess.toString(), x * 50 + 25, y * 50 + 39);
                    break;
                }
                else {
                    ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                    ctx.fillStyle = "#ff0000";
                    ctx.fillText(guess.toString(), x * 50 + 25, y * 50 + 39);
                    ctx.fillStyle = "#000000";
                    guess++;  // changes guess to next number
                    if (guess == 10) { break; } //if the guess gets to 10 then it means it's reached a dead end in the solution. it breaks the loop and in a different place will start to back track
                }
                sudoku[x][y].setNumber(guess);// saves current guess (this line might not be needed)
            }

            sudoku[x][y].setNumber(guess); // saves the current guess
            function duplicateRow() { //checks guess against row for conflicts
                for (var i = 0; i < 9; i++) {
                    if (i == x) { continue; }
                    if (guess == sudoku[i][y].getNumber()) { return true; }

                }
                return false;
            }
            function duplicateCol() { //checks guess against column for conflicts
                for (var i = 0; i < 9; i++) {
                    if (i == y) { continue; }
                    if (guess == sudoku[x][i].getNumber()) { return true; }

                }
                return false;
            }
            function duplicateBox() { //checks guess against 3 by 3 square for conflicts
                var XboxParam = (~~(x / 3) * 3);
                var YboxParam = (~~(y / 3) * 3);

                for (var boxY = YboxParam; boxY <= YboxParam + 2; boxY++) {
                    for (var boxX = XboxParam; boxX <= XboxParam + 2; boxX++) {
                        if (x == boxX && y == boxY) { continue; }
                        if (guess == sudoku[boxX][boxY].getNumber()) { return true; }
                    }
                }
                return false;
            }
        }



        while (this.sudoku[x][y].getKnown())   //this while loop and the 2 lines under find when the solver should stop running in the case where the last square or squares are already known
        {
            if (x == 0) {
                x = 8;
                y--;
            }
            else
                x--;
        }
        var lastx = x;
        var lasty = y;
        x = 0; y = 0;

        while ((x < lastx) || (y < lasty))  //this is essentially the main. it just calls the fill() over and over until it gets to the last square
        {
            if ((x == 0 && y == 0) && this.sudoku[0][0].getKnown()) { nextEmpty(); } //this just moves the starting point to the first unknown if the first square is known


            fill();



            if (this.sudoku[x][y].getNumber() == 10) {  //this is the catch if the guessed number gets to 10. It just sets the square back to 0 and goes moves the pointer back a square with previousEmpty()
                this.sudoku[x][y].setNumber(0);
                ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                previousEmpty();
            }
            else { nextEmpty(); }
        }

        fill(); // this fill completes the last square becuase the while loop above does everything except the last square


        this.sudoku = sudoku; //this just puts the array back into this.sudoku becuase I took it out at the top of this method.
    }
}

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.lineWidth = 2;
ctx.strokeStyle = "grey";

for (let i = 50; i < 450; i += 50) {
    if (i % 150 == 0) { continue; }
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 450);
    ctx.moveTo(0, i);
    ctx.lineTo(450, i);
}

ctx.stroke();
ctx.strokeStyle = "black";
ctx.lineWidth = 4;
ctx.beginPath();

ctx.moveTo(150, 0);
ctx.lineTo(150, 450);

ctx.moveTo(300, 0);
ctx.lineTo(300, 450);

ctx.moveTo(0, 150);
ctx.lineTo(450, 150);

ctx.moveTo(0, 300);
ctx.lineTo(450, 300);
ctx.stroke();

ctx.font = "40px Arial";
ctx.textAlign = "center";


var newBoard = new board;
document.getElementById("startButton").onclick = function () {
    newBoard.solve();
}
/*
var newBoard = new board;
var start = performance.now();
newBoard.solve();
var end = performance.now();
newBoard.logBoard();
console.log(end-start);
*/