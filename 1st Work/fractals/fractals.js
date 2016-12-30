var gl;
var canvas; //Canvas
var slider; //Slider Variable
var Tx = 0.0, Ty = 0.0, Tz = 0.0; //Translation 
var vPosition, factorLoc, centerLoc, MandelbrotLoc, cLoc; //Uniform Variables Location 
var lastX = 0.0, lastY = 0.0, newX = 0.0, newY = 0.0, lastX = 0.0, lastY = 0.0, deltaX = 0.0, deltaY = 0.0, auxX = 0.0, auxY = 0.0; //Mouse Position 
var factor =0.24, scale = 1, Mandelbrot = true, centerX = 0.0, centerY = 0.0, cX = 0.0, cY = 0.0,mouseDown = false, factorMouse = false; //User interaction 


window.onload = function init() {
    
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Four vertices
    var vertices = [
        vec2(-1,1),
        vec2(-1,-1),
        vec2(1,1),
        vec2(1,-1)
    ];
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); //Change canvas color
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //Location for the uniform variables
    factorLoc = gl.getUniformLocation(program, 'factor');
    scaleLoc = gl.getUniformLocation(program, 'scale');
    centerLoc = gl.getUniformLocation(program, 'center');
    MandelbrotLoc = gl.getUniformLocation(program, 'Mandelbrot');    
    cLoc = gl.getUniformLocation(program, 'c');
        
    //Listeners
    slider = document.getElementById("factorSlide");
    
    /**
    * Listener to slider changes
    */
    slider.onchange = function() {
        factor = event.srcElement.value;
        factor = factor / 100;
    };
        
    var menu = document.getElementById("fractalTypeMenu");
    
    /**
    * Listener to menu changes
    */
    menu.addEventListener("input", function() {
       
        switch (menu.selectedIndex) {
            //Mandelbrot
            case 0: 
                Mandelbrot = true;
                cX = 0;
                cY = 0;
                scale = 1.0;
                centerX = 0.0;
                centerY = 0.0;
                break;
            //Julia c=-0.4+0.6i
            case 1: 
                Mandelbrot = false;
                cX = -0.4;
                cY = 0.6;
                scale = 1.0;
                centerX = 0.0;
                centerY = 0.0;
                break;
            //Julia c=0.285+0i
            case 2:
                Mandelbrot = false;
                cX = 0.285;
                cY = 0.0;
                scale = 1.0;
                centerX = 0.0;
                centerY = 0.0;
                break;
            //Julia c=0.285+0.01i
            case 3: 
                Mandelbrot = false;
                cX = 0.285;
                cY = 0.01;
                scale = 1.0;
                centerX = 0.0;
                centerY = 0.0;
                break;
            //Julia c=-0.8+0.156i
            case 4:
                Mandelbrot = false;
                cX = -0.8;
                cY = 0.156;
                scale = 1.0;
                centerX = 0.0;
                centerY = 0.0;
                break;
            //Julia c=0.8+0.0i
            case 5: 
                Mandelbrot = false;
                cX = 0.8;
                cY = 0.0;
                scale = 1.0;  
                centerX = 0.0;
                centerY = 0.0;
                break;      
                
        }
    }); 
    
    /**
    * Listener to keyboard inputs
    */
    document.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
            switch (key) {
                case 'Q': //Zoom In
                    scale *= 1.01;
                    break;
                case 'A': //Zoom Out
                    scale /= 1.01;
                    break;
            }
    };
    
    canvas.onmousedown = handleMouseDown; 
    canvas.onmouseup = handleMouseUp; 
    canvas.onmousemove = handleMouseMove; 
    slider.onmousedown = handleMouseDownSlider;
    slider.onmouseup = handleMouseUpSlider; 
    slider.onmousemove = handleMouseMoveSlider; 
    
    //Draw the scene
    render();
}

/**
* Mouse is pressed
*/
function handleMouseDown(event) { 
    mouseDown = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
}

/**
* Mouse pressed in slider
*/
function handleMouseDownSlider() { 
    factorMouse = true;
}

/**
* Mouse is released
*/
function handleMouseUp(event) {
    if(mouseDown){
        mouseDown = false;
    }
}

/**
* Mouse is released in slider
*/
function handleMouseUpSlider() {
    if(factorMouse){
        factorMouse = false;
    }
}

/**
* Mouse is moved
*/
function handleMouseMove(event) {
    if (!mouseDown) {
      return;
    }
        
    newX = event.offsetX;
    newY = event.offsetY;
    
    deltaX = newX - lastX;
    deltaY = newY - lastY;
    
    centerX -= 2 * (deltaX) / (canvas.width * scale);
    centerY += 2 * (deltaY) / (canvas.height * scale);
            
    lastX = newX;
    lastY = newY;                      
}

/**
* Mouse is moved in slider. 
* This listener's goal is to make update slider's value in real time 
*/
function handleMouseMoveSlider() { 
    if (!factorMouse) {
      return;
    }
    factor = slider.value; //Get slider value
    factor = factor / 100;  
    console.log(factor);
    
}

/**
* Draw the scene
*/
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimFrame(render);
    //Send values to the uniform variables
    gl.uniform1f(factorLoc, factor);
    gl.uniform1f(scaleLoc, scale);
    gl.uniform2f(centerLoc, centerX, centerY);
    gl.uniform1i(MandelbrotLoc, Mandelbrot);
    gl.uniform2f(cLoc, cX, cY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

