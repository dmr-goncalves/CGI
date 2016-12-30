var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;
var mProjection;

var projection = mat4();
var modelView;
var view;

var sliderTheta, sliderGamma, thetaMouse, gammaMouse, slidertheta = -20.30, slidergamma = 19.4;
var axonometricXRotationMatrix = mat4(), axonometricYRotationMatrix = mat4();

matrixStack = [];

var Tx = 0.0, Tz = 0.0, theta = 0.0, lambda = 0.0, phi = 0.0, gamma = 0.0, leftFingerT = 0.0, rightFingerT = 0.0; 

var red = vec3(1.0, 0.0, 0.0);
var green = vec3(0.0, 1.0, 0.0);
var blue = vec3(0.0, 0.0, 1.0);
var yellow = vec3(1.0, 1.0, 0.0);
var grey = vec3(0.3, 0.3, 0.3);

var axonometricDiv;

var axonometricProjection = true;

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    axonometricDiv = document.getElementById("axonometricDiv");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    mProjection = gl.getUniformLocation(program, "mProjection");
    setupProjection();
    setupView();
}

function toRadian(angle){
    return angle * Math.PI / 180;
}

function Axonometric(){
    axonometricYRotationMatrix = rotateY(theta);
    axonometricXRotationMatrix = rotateX(gamma);
    return mult(axonometricXRotationMatrix, axonometricYRotationMatrix);
}

function setupProjection() {
    if(axonometricProjection){
        projection = ortho(-3,3,-3,3,-10,10);
    }else{
        projection = perspective(60, 1, 0.1, 100);
    }
}

function setupView() {
    if(axonometricProjection){
        view = Axonometric();}
    else{
        view = lookAt([0,0,5], [0,0,0], [0,1,0]);  
    }
    
    modelView = mat4(view[0], view[1], view[2], view[3]);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}



function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene()
{
    multTranslation([0,-1.68,0]);
    pushMatrix();
        multScale([4, 1/10, 4])
        draw_cube(grey);
    popMatrix();
        multTranslation([0.3 + Tx, 0, -0.2 + Tz]);
        pushMatrix();
            multTranslation([0, 0.2, 0]);
            multScale([1.5, 1/3, 1.5]);
            draw_cube(red);
        popMatrix();
        multRotY(theta);
        pushMatrix();
            multTranslation([0, 1/3, 0]);
            multScale([1/2, 1/3, 1/2]);
            draw_cylinder(green);
        popMatrix();
            multTranslation([0, 0.1 + 1/3 + 1/4, 0]);
            multScale([1/5, 0.5, 1/5]);
            draw_cube(red);
            multTranslation([0, 0.1 + 1/3 + 1/4, 0]);
            multScale([1, 0.5, 2]);
            multRotX(90);
            draw_cylinder(blue); 
            multRotX(-90);
            multRotZ(lambda);
            pushMatrix();
                multTranslation([0, 1.7, 0]);
                multScale([1, 3, 1/2]);
                draw_cube(red);
                multTranslation([0, 0.1 + 1/3 + 1/6, 0]);
                multScale([1, 1/3, 2]);
                multRotX(90);
                draw_cylinder(yellow); 
                multRotX(-90);
                multRotZ(phi);
                pushMatrix();
                    multTranslation([0, 2, 0]);
                    multScale([1, 3.5, 1/2]);
                    draw_cube(red);
                popMatrix();
                multScale([2.5, 1, 1.5]);
                multRotY(gamma);
                multTranslation([0, 4, 0]);
                draw_cylinder(grey);
                pushMatrix();
                    multTranslation([-0.2 + leftFingerT, 1.5, 0]);
                    multScale([1/6, 2, 1/6]);
                    draw_cube(yellow);
                popMatrix();
                multTranslation([0.2 + rightFingerT, 1.5, 0]);
                multScale([1/6, 2, 1/6]);
                draw_cube(yellow);    
            popMatrix();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();

    // Send the current projection matrix
    setupProjection();
    
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    
    requestAnimFrame(render);
}


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    /**
    * Listener to keyboard inputs
    */
    document.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        
            switch (key) {
                case 'Q': //Base Rotation
                    theta++;
                    
                    if(theta > 179){
                        theta = 180;
                    }
                    break;
                case 'W': //Base Rotation
                    theta--;
                    
                    if(theta < -179){
                        theta = -180;
                    }
                    break;
                case 'A': //Lower Arm Rotation
                    lambda++;
                    
                    if(lambda > 59){
                        lambda = 60;
                    }
                    break;
                case 'S': //Lower Arm Rotation
                    lambda--;
                    
                    if(lambda < -59){
                        lambda = -60;
                    }
                    break;
                case 'Z': //Upper Arm Rotation
                    phi++;
                    
                    if(phi > 56){
                        phi = 57;
                    }      
                    break;
                case 'X': //Upper Arm Rotation
                    phi--;
                    
                    if(phi < -56){
                        phi = -57;
                    }
                    break;
                case 'O': //Finger Translation
                    leftFingerT += 0.01;
                    rightFingerT -= 0.01;
                    
                    if(leftFingerT > 0.11999999999999998){
                        leftFingerT = 0.11999999999999998;
                    }
                    
                    if(rightFingerT < -0.11999999999999998){
                        rightFingerT = -0.11999999999999998;
                    }
                    break;
                case 'P': //Finger Translation
                    leftFingerT -= 0.01;
                    rightFingerT += 0.01;
                    
                    
                    if(leftFingerT < -0.18000000000000002){
                        leftFingerT = -0.18000000000000002;
                    }
                    
                    if(rightFingerT > 0.18000000000000002){
                        rightFingerT = 0.18000000000000002;
                    }
                    break;
                case 'K': //Fist Rotation
                    gamma++;
                    
                    if(gamma > 179){
                        gamma = 180;
                    }
                    break;
                case 'L': //Fist Rotation
                    gamma--;
                    
                    if(gamma < -179){
                        gamma = -180;
                    }
                    break;
            }
        
        switch(event.keyCode) {
            case 40: //Down Arrow
                Tz += 0.01;
                
                if(Tz >= 1.0){
                    Tz = 1.0;
                }
                break;
            case 38: //Up Arrow
                Tz -= 0.01;
                
                if(Tz <= -0.5){
                    Tz = -0.5;
                }
                break;
            case 39: //Right Arrow
                Tx += 0.01;
                
                if(Tx >= 0.5){
                    Tx = 0.5;
                }
                break;
            case 37: //Left Arrow
                Tx -= 0.01;
                
                if(Tx <= -1.0){
                    Tx = -1.0;
                }
                break;                
        }
    };
    
    
    var menu1 = document.getElementById("ProjectionMenu");
    
    /**
    * Listener to menu changes
    */
    menu1.addEventListener("input", function() {
       
        switch (menu1.selectedIndex) {
            case 0:
                axonometricProjection = true;
                axonometricDiv.style.display='block';
                break;
            case 1:
                axonometricProjection = false;
                axonometricDiv.style.display='none';
                break;
        }
    }); 
                           
    sliderTheta = document.getElementById("thetaSlider");
    sliderGamma = document.getElementById("gammaSlider");
    
    sliderTheta.onchange = function() {
       slidertheta = event.srcElement.value;
    };
    
    sliderGamma.onchange = function() {
       slidergamma = event.srcElement.value;
    };
    
    sliderTheta.onmousedown = handleMouseDownSliderTheta;
    sliderTheta.onmouseup = handleMouseUpSliderTheta; 
    sliderTheta.onmousemove = handleMouseMoveSliderTheta;
    
    sliderGamma.onmousedown = handleMouseDownSliderGamma;
    sliderGamma.onmouseup = handleMouseUpSliderGamma; 
    sliderGamma.onmousemove = handleMouseMoveSliderGamma;
    
    initialize();
            
    render();
}

function updateSliders(){
    document.getElementById("thetaSlider").value = slidertheta;
    document.getElementById("gammaSlider").value = slidergamma;
}

function Axonometric(){
    axonometricYRotationMatrix = rotateY(slidertheta);
    axonometricXRotationMatrix = rotateX(slidergamma);
    return mult(axonometricXRotationMatrix, axonometricYRotationMatrix);
}

function handleMouseDownSliderTheta() { 
    thetaMouse = true;
}

function handleMouseDownSliderGamma() { 
    gammaMouse = true;
}

function handleMouseUpSliderTheta() { 
    thetaMouse = false;
}

function handleMouseUpSliderGamma() { 
    gammaMouse = false;
}

function handleMouseMoveSliderTheta() { 
    if (!thetaMouse) {
      return;
    }
    slidertheta = sliderTheta.value;
}

function handleMouseMoveSliderGamma() { 
    if (!gammaMouse) {
      return;
    }
    slidergamma = sliderGamma.value;
}