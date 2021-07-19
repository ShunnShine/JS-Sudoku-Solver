<html>
    <head>
        <title>sudoku Thing</title>
        <link rel="stylesheet" href="index.css">
    </head>
    <body style="background-color:#497dee">
        <div style="font-size: x-large;text-align: center; color:red;">
            <h1 style="text-align: center; color:red;">Solve Your Sudoku</h1>
        </div>
        <div style="margin: auto; top: 0; bottom: 0; left: 0; right: 0; width: 460px; height: 550px;">
            <canvas onclick="clickCounter(event)" id="canvas" width="450" height="450" style="border: 1px solid black;">
            </canvas>
            <div style="text-align: center;"><input type="range" min="0" max="1" value=".5" step=".1" class="slider" id="timingSlider">
        
            <br/>
            The current delay is: <span id="sliderValue">0.5</span> Sec
            <button id="startButton">Start</button>
            </div>
        </div>
        <script>
            var slider = document.getElementById("timingSlider");
            slider.oninput=function(){
                document.getElementById("sliderValue").innerHTML= this.value; 
            }    
        </script>
        <script src="Sudoku.js"></script>  
    </body>
</html>
