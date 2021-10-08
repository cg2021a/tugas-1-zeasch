function main()
{
    /**
   * @type {HTMLCanvasElement} canvas
   */
  const canvas = document.getElementById('myCanvas');

  /**
   * @type {WebGLRenderingContext} gl
   */
  const gl = canvas.getContext('webgl');

  /*
         A---B
        /     \
       /       \
      /         \
     D-----------C
     E|___________|F
  */

     const object_left = {
        left_color: [0.8, 0.8, 0.8],
        left_color_2: [0.7, 0.7, 0.7],
        left_point_d: [-0.7, 0.8],
        left_point_c: [-0.8, 0.0,],
        left_point_g: [-0.3, 0.8,],
        left_point_h: [-0.2, 0.0,],
        left_point_i: [ -0.8, -0.1,],
        left_point_j: [-0.2, -0.1,],
    };


    const object_right = {
        right_color: [0.8, 0.8, 0.8], // head color
        right_color_2: [0.7, 0.7, 0.7], // body color
        point_c: [ 0.0, 0.0,],
        point_d: [0.1, 0.4,],
        point_e: [0.9, 0.0,],
        point_f: [0.8, 0.4,],
        point_g: [0.0, -0.1,],
        point_h: [0.9, -0.1,],
    };

    const vertices = [

        //Left Object
        ...object_left.left_point_d, ...object_left.left_color,
        ...object_left.left_point_c, ...object_left.left_color, 
        ...object_left.left_point_h, ...object_left.left_color, 
        ...object_left.left_point_h, ...object_left.left_color, 
        ...object_left.left_point_g, ...object_left.left_color,
        ...object_left.left_point_d, ...object_left.left_color,

        ...object_left.left_point_c, ...object_left.left_color_2,
        ...object_left.left_point_i, ...object_left.left_color_2, 
        ...object_left.left_point_j, ...object_left.left_color_2, 
        ...object_left.left_point_j, ...object_left.left_color_2, 
        ...object_left.left_point_h, ...object_left.left_color_2,
        ...object_left.left_point_c, ...object_left.left_color_2,

        //Right Object
        ...object_right.point_c, ...object_right.right_color,
        ...object_right.point_d, ...object_right.right_color,
        ...object_right.point_e, ...object_right.right_color,


        ...object_right.point_f, ...object_right.right_color,
        ...object_right.point_d, ...object_right.right_color,
        ...object_right.point_e, ...object_right.right_color,

        ...object_right.point_c, ...object_right.right_color_2,
        ...object_right.point_e, ...object_right.right_color_2,
        ...object_right.point_g, ...object_right.right_color_2,

        ...object_right.point_e, ...object_right.right_color_2,
        ...object_right.point_g, ...object_right.right_color_2,
        ...object_right.point_h, ...object_right.right_color_2,
        
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;
        void main() {
            gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);


    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);


    var shaderProgram = gl.createProgram();


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);


    gl.linkProgram(shaderProgram);


    gl.useProgram(shaderProgram);


    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aColor);

    var freeze = false;
    // Interactive graphics with mouse
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Interactive graphics with keyboard
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = true;
    }

    function onKeyup(event) {
        if (event.keyCode == 32) freeze = false;
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    var speed = 0.0081;
    var change = 0;
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");

    function moveVertices() {

        if (vertices[116] < -1.0 || vertices[76] > 1.0) {
            speed = speed * -1;
        }

        for (let i = 61; i < vertices.length; i += 5) {
            vertices[i] = vertices[i] + speed;
        }
    }


    function render() {
        moveVertices();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        change = change + speed;
        gl.uniform1f(uChange, change);

        gl.clearColor(0.0, 0.0, 0.0, 0.1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var primitive = gl.TRIANGLES;
        var offset = 0;
        var nVertex = 30;
        gl.drawArrays(primitive, offset, nVertex);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

    /*
          D----------A
         /            \
        C--------------B
        F|_____________|E
     */
  
        /*var vertices2 =
        [
            0.0, 0.0, //titik C
            0.1, 0.4, //titik D
            0.8, 0.4, //titik A
            0.9, 0.0, //titik B
            0.0, 0.0, //titik C
            0.0, -0.1,  //titik F
            0.9, -0.1,  //titik E
            0.9, 0.0, //titik B
        ];
   
       var positionBuffer2 = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
       gl.bindBuffer(gl.ARRAY_BUFFER, null);
   
       var vertexShaderCode2 = `
       attribute vec2 a_Position2;
           void main()
           {
               gl_Position = vec4 (a_Position2, 0.0, 1.0);
               gl_PointSize = 20.0;
           }`;
   
       var vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
       gl.shaderSource(vertexShader2, vertexShaderCode2);
       gl.compileShader(vertexShader2);
   
       var fragmentShaderCode2 = `
       void main()
           {
               gl_FragColor = vec4 (0.0, 0.0, 0.0, 0.5);
           }
       `;
   
       var fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
       gl.shaderSource(fragmentShader2, fragmentShaderCode2);
       gl.compileShader(fragmentShader2);
   
       var shaderProgram2 = gl.createProgram();
       gl.attachShader(shaderProgram2, vertexShader2);
       gl.attachShader(shaderProgram2, fragmentShader2);
       gl.linkProgram(shaderProgram2);
       gl.useProgram(shaderProgram2);
   
       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
       var aPosition2 = gl.getAttribLocation(shaderProgram2, "a_Position2");
       gl.vertexAttribPointer(aPosition2, 2, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(aPosition2);

       gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
   
       gl.drawArrays(gl.LINE_LOOP, 0, 8);*/
