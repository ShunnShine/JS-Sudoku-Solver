
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
        else {
            ctx.fillText(this.number.toString(), boxClickedX * 50 + 25, boxClickedY * 50 + 39); 
        }
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
        this.listenForChanges = false;
        var sudoku = this.sudoku;
        ctx.fillStyle = "grey";
        var slider = document.getElementById("timingSlider");
        var nextGuessAgain = null;
        var x = 8;                  
        var y = 8;   
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
        
        function makeGuess(){
            var guess = (sudoku[x][y].getNumber() + 1);

            function isValid(){  //written by Alex Klein
                for(let i = 0; i < 9; i++){ //position
                    var boxY = ~~(y / 3)*3 + ~~(i/3); //row checker for the 3x3 box
                    var boxX = ~~(x/3)*3 + i % 3; //column checker for the 3x3 box
                    if(guess == sudoku[i][y].getNumber() || guess == sudoku[x][i].getNumber() || guess == sudoku[boxX][boxY].getNumber()){ //checks if value is found in row, column, and a 3x3 box respectively
                        return false; //returns false if found
                    }
                }
                return true; //returns true if not found
            }

            if(guess==10){
                sudoku[x][y].setNumber(guess);
                return false;
            }
            else if(isValid()){
                ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                ctx.fillText(guess.toString(), x * 50 + 25, y * 50 + 39);
                sudoku[x][y].setNumber(guess);
                return false;
            }
            else{
                ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                ctx.fillStyle = "#ff0000";
                ctx.fillText(guess.toString(), x * 50 + 25, y * 50 + 39);
                ctx.fillStyle = "grey";
                sudoku[x][y].setNumber(guess);
                return true;
            }

        }

        function main(guessAgain) {
            if (x <= lastx || y <= lasty) {
                if ((x == 0 && y == 0) && sudoku[0][0].getKnown()) { nextEmpty(); }
                
                if(guessAgain){
                    nextGuessAgain = makeGuess();
                }
                else if(sudoku[x][y].getNumber() == 10){
                    sudoku[x][y].setNumber(0);
                    ctx.clearRect(x * 50 + 3, y * 50 + 3, 45, 45);
                    previousEmpty();
                    nextGuessAgain = makeGuess();
                }
                else{
                    nextEmpty();
                    nextGuessAgain = makeGuess();
                }
                
                setTimeout(function(){main(nextGuessAgain)},slider.value*1000);
        
            }
            else {
                //this.sudoku = sudoku;
                return;
            }
        }
        
        setTimeout(function(){main(true)}, slider.value*1000);
        ctx.fillStyle = "#000000"; //change color back to black if I want to implement more number changes later
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