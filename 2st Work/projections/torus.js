var torus_points = [];
var torus_normals = [];
var torus_faces = [];
var torus_edges = [];

var torus_points_buffer;
var torus_normals_buffer;
var torus_faces_buffer;
var torus_edges_buffer;

var torus_LATS=30;
var torus_LONS=30;

function torusInit(gl) {
    torusBuild(torus_LATS, torus_LONS);
    torusUploadData(gl);
}

function getP(i,j,nlat,nlon){
    return (i % nlat) * nlon + (j % nlon);
}

// Generate points using polar coordinates
function torusBuild(nlat, nlon) 
{
    // phi will be latitude
    // theta will be longitude
 
    var d_phi = 2 * Math.PI / nlat;
    var d_theta = 2 * Math.PI / nlon;
    var r = 0.2;
    var R = 0.5;
    var center;
    
    
    // Generate middle
    for(var i = 0, phi = Math.PI/2 - d_phi; i<=nlat; i++, phi-=d_phi) {
        var center = vec3(R * Math.cos(phi), 0, -R * Math.sin(phi));
        for(var j = 0, theta=0; j<nlon; j++, theta+=d_theta) {
            var pt = vec3((R + r * Math.cos(theta)) * Math.cos(phi), r * Math.sin(theta), -Math.sin(phi) * (R + r * Math.cos(theta)));
            torus_points.push(pt);
            var normal = vec3(pt[0] - center[0], pt[1] - center[1], pt[2] - center[2]);
            torus_normals.push(normalize(normal));
        }
    }
    
    
    // Generate the faces
    for(var i=0; i<nlat; i++) {
        for(var j=0; j<nlon-1; j++) {
            
            var p = getP(i, j, nlat, nlon);
            
            torus_faces.push(p);
            torus_faces.push(p + nlon);
            torus_faces.push(p + nlon + 1);
            
            torus_faces.push(p);
            torus_faces.push(p + nlon + 1);
            torus_faces.push(p + 1);
        }
        
        var p = i * nlon + nlon - 1;
        
        torus_faces.push(p);
        torus_faces.push(p + nlon);
        torus_faces.push(p + 1);

        torus_faces.push(p);
        torus_faces.push(p + 1);
        torus_faces.push(p - nlon + 1);
    }
    
    // Build the edges
    for(var i=0; i<nlat; i++) {
        for(var j=0; j<nlon;j++) {

            var p = getP(i, j, nlat, nlon);
            var pr = getP(i, j+1, nlat, nlon);
            var pb = getP(i+1, j, nlat, nlon);
          
            torus_edges.push(p); //horizontal line
            
            if(j!=nlon-1){ 
                torus_edges.push(p+1);
            }else{
                torus_edges.push(pr);
            }
            if(i!=nlat) {
                torus_edges.push(p);   // vertical line (same longitude)
                torus_edges.push(pb);
            }
        }
    }
}



function torusUploadData(gl)
{
    torus_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_points), gl.STATIC_DRAW);
    
    torus_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_normals), gl.STATIC_DRAW);
    
    torus_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_faces), gl.STATIC_DRAW);
    
    torus_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_edges), gl.STATIC_DRAW);
}

function torusDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.drawElements(gl.LINES, torus_edges.length, gl.UNSIGNED_SHORT, 0);
}

function torusDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.drawElements(gl.TRIANGLES, torus_faces.length, gl.UNSIGNED_SHORT, 0);
}

