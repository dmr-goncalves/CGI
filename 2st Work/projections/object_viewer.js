var gl, canvas, program, program1, program2;
var mNormals, mNormalsLoc;
var FrontView = mat4(), TopView = rotateX(90), SideView = rotateY(90), OtherView = mat4(), mModelView = mat4(), axonometricXRotationMatrix = mat4(), axonometricYRotationMatrix = mat4();
var mModelViewLoc, mProjectionLoc, colorLoc;
var mProjection = mat4();
var perspectiveDiv, obliquousDiv, axonometricDiv;
var cube = false, sphere = true, pyramid = false, torus = false, WireFrame = true, Filled = false, obliqua = false, axonometrica = false, perspectiva = false;
var resetShaders;
var menuOption1 = 0, menuOption2 = 0, menuOption3 = 0;
var sliderD, sliderL, sliderAlfa, sliderTheta, sliderGamma;
var d = 1.0, l = 1.0, alfa = 45.0, theta = -20.30, gamma = 19.4;
var dMouse, lMouse, alfaMouse, thetaMouse, gammaMouse;
var resetShadersDone = false, color = 1;

function load_file() {
    var selectedFile = this.files[0];
    var reader = new FileReader();
    var id = this.id == "vertex" ? "vertex-shader-2" : "fragment-shader-2";
    reader.onload = (function(f){
        var fname = f.name;
        return function(e) {
            console.log(fname);
            console.log(e.target.result);
            console.log(id);
            document.getElementById(id).textContent = e.target.result;
            program2 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
            reset_program(program2);
            program = program2;
        }
    })(selectedFile);
    reader.readAsText(selectedFile);
}

function reset_program(prg) {
    gl.useProgram(prg);
    mModelViewLoc = gl.getUniformLocation(prg, "mModelView");
    mNormalsLoc = gl.getUniformLocation(prg, "mNormals");
    mProjectionLoc = gl.getUniformLocation(prg, "mProjection");
    colorLoc = gl.getUniformLocation(prg, "color");
    program = prg;
}

window.onload = function init() {
        
    // Get the canvas
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    // Setup the contexts and the program
    gl = WebGLUtils.setupWebGL(canvas);
    program1 = initShaders(gl, "vertex-shader", "fragment-shader");
    
    document.getElementById("vertex").onchange = load_file;
    document.getElementById("fragment").onchange = load_file;


    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    aspect = canvas.width / canvas.height;
    
    
    if(aspect > 1){
        mProjection = ortho(-aspect, aspect, -1.0, 1.0, -1.0, 1.0);
    }else if(aspect < 1){
        mProjection = ortho(-1.0, 1.0, -1/aspect, 1/aspect, -1.0, 1.0);
    }

    resetShaders = document.getElementById("resetShaders");
    resetShaders.onmousedown = handleMouseDownResetShaders;
    resetShaders.onmouseup = handleMouseUpResetShaders;
    
    perspectiveDiv = document.getElementById("perspectiveDiv");
    obliquousDiv = document.getElementById("obliquousDiv");
    axonometricDiv = document.getElementById("axonometricDiv");
    
    obliquousDiv.style.display='none';
    perspectiveDiv.style.display='none';
    axonometricDiv.style.display='none';
    
    //Listeners
    sliderD = document.getElementById("dSlider");
    sliderL = document.getElementById("lSlider");
    sliderAlfa = document.getElementById("alfaSlider");
    sliderTheta = document.getElementById("thetaSlider");
    sliderGamma = document.getElementById("gammaSlider");

    sliderD.onchange = function() {
       d = event.srcElement.value;
    };
    
    sliderL.onchange = function() {
       l = event.srcElement.value;
    };
    
    sliderAlfa.onchange = function(){
       alfa = event.srcElement.value;  
    };
    
    sliderTheta.onchange = function() {
       theta = event.srcElement.value;
    };
    
    sliderGamma.onchange = function() {
       gamma = event.srcElement.value;
    };
    
    var menu1 = document.getElementById("ObjectMenu");
    
    /**
    * Listener to menu changes
    */
    menu1.addEventListener("input", function() {
       
        switch (menu1.selectedIndex) {
            case 0:
                menuOption1 = 0;
                menuOption2 = 0;
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                OtherView = mat4();
                cube = false;
                sphere = true;
                pyramid = false;
                torus = false;         
                Filled = false;
                WireFrame = true;
                obliqua = false;
                perspectiva = false;
                axonometrica = false;
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 1: 
                menuOption1 = 1;
                menuOption2 = 0;
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                cube = true;
                sphere = false;
                pyramid = false;
                torus = false;
                Filled = false;
                WireFrame = true;
                obliqua = false;
                perspectiva = false;
                axonometrica = false;
                OtherView = mat4();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 2: 
                menuOption1 = 2;
                menuOption2 = 0;
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                cube = false;
                sphere = true;
                pyramid = false;
                torus = false;
                Filled = false;
                WireFrame = true;
                obliqua = false;
                perspectiva = false;
                axonometrica = false;
                OtherView = mat4();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 3:
                menuOption1 = 3;
                menuOption2 = 0;
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                cube = false;
                sphere = false;
                pyramid = true;
                torus = false;
                Filled = false;
                WireFrame = true;
                obliqua = false;
                perspectiva = false;
                axonometrica = false;
                OtherView = mat4();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 4: 
                menuOption1 = 4;
                menuOption2 = 0;
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                cube = false;
                sphere = false;
                pyramid = false;
                torus = true;
                Filled = false;
                WireFrame = true;
                obliqua = false;
                perspectiva = false;
                axonometrica = false;
                OtherView = mat4();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;               
        }
    }); 
    
    var menu2 = document.getElementById("TypeMenu");
    
    /**
    * Listener to menu changes
    */
    menu2.addEventListener("input", function() {
       
        switch (menu2.selectedIndex) {
            case 0:
                menuOption2 = 0;
                WireFrame = true;
                Filled = false;
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 1: 
                menuOption2 = 1;
                WireFrame = true;
                Filled = false;
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 2: 
                menuOption2 = 2;
                WireFrame = false;
                Filled = true;
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
        }
    });
    
    var menu3 = document.getElementById("ProjectionMenu");
    
    /**
    * Listener to menu changes
    */
    menu3.addEventListener("input", function() {
       
        switch (menu3.selectedIndex) {
            case 0:
                menuOption3 = 0;
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                obliqua = false;
                axonometrica = false;
                perspectiva = false;
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 1: 
                menuOption3 = 1;
                obliquousDiv.style.display='block';
                perspectiveDiv.style.display='none';
                axonometricDiv.style.display='none';
                obliqua = true;
                axonometrica = false;
                perspectiva = false;
                d = 1.0;
                l = 1.0;
                alfa = 45.0;
                theta = -20.30;
                gamma = 14.9;
                updateSliders();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 2: 
                menuOption3 = 2;
                axonometricDiv.style.display='block';
                obliquousDiv.style.display='none';
                perspectiveDiv.style.display='none';
                obliqua = false;
                axonometrica = true;
                perspectiva = false;
                d = 1.0;
                l = 1.0;
                alfa = 45.0;
                theta = -20.30;
                gamma = 14.90;
                updateSliders();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
            case 3:
                menuOption3 = 3;
                perspectiveDiv.style.display='block';
                obliquousDiv.style.display='none';
                axonometricDiv.style.display='none';
                obliqua = false;
                axonometrica = false;
                perspectiva = true;
                d = 1.0;
                l = 1.0;
                alfa = 45.0;
                theta = -20.30;
                gamma = 19.4;
                updateSliders();
                updateMenus(menuOption1, menuOption2, menuOption3);
                break;
        }
    });
    
    var menu4 = document.getElementById("ColorMenu");
    
    menu4.addEventListener("input", function() {
        switch (menu4.selectedIndex) {
            case 0:
                vP = false;
                break;
            case 1:
                color = 1;
                break;
            case 2:
                color = 2;
                break;
            case 3:
                color = 3;
        }
    });
    
    sphereInit(gl);
    cubeInit(gl);
    pyramidInit(gl);
    torusInit(gl);
    
    window.onresize = function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        aspect = canvas.width / canvas.height;
        
        if(aspect > 1){
            mProjection = ortho(-aspect, aspect, -1.0, 1.0, -1.0, 1.0);
        }else if(aspect < 1){
            mProjection = ortho(-1.0, 1.0, -1/aspect, 1/aspect, -1.0, 1.0);
        }
    }
    
    sliderD.onmousedown = handleMouseDownSliderD;
    sliderD.onmouseup = handleMouseUpSliderD; 
    sliderD.onmousemove = handleMouseMoveSliderD;
    
    sliderAlfa.onmousedown = handleMouseDownSliderAlfa;
    sliderAlfa.onmouseup = handleMouseUpSliderAlfa; 
    sliderAlfa.onmousemove = handleMouseMoveSliderAlfa;
    
    sliderL.onmousedown = handleMouseDownSliderL;
    sliderL.onmouseup = handleMouseUpSliderL; 
    sliderL.onmousemove = handleMouseMoveSliderL;
    
    sliderTheta.onmousedown = handleMouseDownSliderTheta;
    sliderTheta.onmouseup = handleMouseUpSliderTheta; 
    sliderTheta.onmousemove = handleMouseMoveSliderTheta;
    
    sliderGamma.onmousedown = handleMouseDownSliderGamma;
    sliderGamma.onmouseup = handleMouseUpSliderGamma; 
    sliderGamma.onmousemove = handleMouseMoveSliderGamma;
    
    reset_program(program1);
        
    gl.uniform1i(colorLoc, color);
    
    render();
}

function drawObject(gl, program) 
{
    if(sphere && WireFrame){
        sphereDrawWireFrame(gl, program);
    }else if(sphere && Filled ){
        sphereDrawFilled(gl, program);
    }else if(cube && WireFrame){
        cubeDrawWireFrame(gl, program);
    }else if(cube && Filled){
        cubeDrawFilled(gl, program);
    }else if(pyramid && WireFrame){
        pyramidDrawWireFrame(gl, program);
    }else if(pyramid && Filled){
        pyramidDrawFilled(gl, program);
    }else if(torus && WireFrame){
        torusDrawWireFrame(gl, program);
    }else if(torus && Filled){
        torusDrawFilled(gl, program);
    }
}

function updateSliders(){
    document.getElementById("dSlider").value = d;
    document.getElementById("lSlider").value = l;
    document.getElementById("alfaSlider").value = alfa;
    document.getElementById("thetaSlider").value = theta;
    document.getElementById("gammaSlider").value = gamma;
}

function updateMenus(option1, option2, option3){
    document.getElementById("ObjectMenu").value = option1;
    document.getElementById("TypeMenu").value = option2;
    document.getElementById("ProjectionMenu").value = option3;
}

function Axonometric(){
    axonometricYRotationMatrix = rotateY(theta);
    axonometricXRotationMatrix = rotateX(gamma);
    return mult(axonometricXRotationMatrix, axonometricYRotationMatrix);
}

function Obliquous(){
    return new mat4([
        1, 0, -l * Math.cos(toRadian(alfa)), 0,
        0, 1, -l * Math.sin(toRadian(alfa)), 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function Perspective(){
    return new mat4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1 , 0,
        0, 0, -1/d, 1
    ]);
}

function toRadian(angle){
    return angle * Math.PI / 180;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));
    gl.uniform1i(colorLoc, color);

    // Top view
    mModelView = TopView;
    mNormals = transpose(inverse(mModelView));
    gl.viewport(0,0,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    // Front view
    mModelView = FrontView;
    mNormals = transpose(inverse(mModelView));
    gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);
    
    // Side view
    mModelView = SideView;
    mNormals = transpose(inverse(mModelView));
    gl.viewport(canvas.width/2,canvas.height/2,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    
    if(obliqua){
        OtherView = Obliquous();
        mModelView = OtherView;
        mNormals = mat4();
    }else if(axonometrica){
        OtherView = Axonometric();
        mModelView = OtherView;
        mNormals = transpose(inverse(mModelView));
    }else if(perspectiva){
        OtherView = Perspective();  
        mModelView = OtherView;
        mNormals = mat4();
    }
    
    // Other view
    gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    window.requestAnimationFrame(render);
}

function handleMouseDownSliderD() { 
    dMouse = true;
}

function handleMouseDownSliderL() { 
    lMouse = true;
}

function handleMouseDownSliderAlfa() { 
    alfaMouse = true;
}

function handleMouseDownSliderTheta() { 
    thetaMouse = true;
}

function handleMouseDownSliderGamma() { 
    gammaMouse = true;
}

function handleMouseUpSliderD() { 
    dMouse = false;
}

function handleMouseUpSliderL() { 
    lMouse = false;
}

function handleMouseUpSliderAlfa() { 
    alfaMouse = false;
}

function handleMouseUpSliderTheta() { 
    thetaMouse = false;
}

function handleMouseUpSliderGamma() { 
    gammaMouse = false;
}

function handleMouseMoveSliderD() { 
    if (!dMouse) {
      return;
    }
    d = sliderD.value;
}

function handleMouseMoveSliderL() { 
    if (!lMouse) {
      return;
    }
    l = sliderL.value;
}

function handleMouseMoveSliderAlfa() { 
    if (!alfaMouse) {
      return;
    }
    alfa = sliderAlfa.value;
}

function handleMouseMoveSliderTheta() { 
    if (!thetaMouse) {
      return;
    }
    theta = sliderTheta.value;
}

function handleMouseMoveSliderGamma() { 
    if (!gammaMouse) {
      return;
    }
    gamma = sliderGamma.value;
}

function handleMouseDownResetShaders(){
    if(!resetShadersDone){
        reset_program(program1);
        document.getElementById("vertex").value = "";
        document.getElementById("fragment").value = "";
        resetShadersDone = true;
    }
}

function handleMouseUpResetShaders(){
    resetShadersDone = false;
}