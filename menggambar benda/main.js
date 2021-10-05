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

     var vertices =
     [
         -0.8, 0.0, //titik D
        -0.7, 0.8, //titik A
        -0.3, 0.8, //titik B
        -0.2, 0.0, //titik C
        -0.8, 0.0, //titik D
        -0.8, -0.1,  //titik E
        -0.2, -0.1, //titik F
        -0.2, 0.0, //titik C
     ];

     var positionBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
     var vertexShaderCode = `
     attribute vec2 a_Position;
         void main()
         {
             gl_Position = vec4 (a_Position, 0.0, 1.0);
             gl_PointSize = 20.0;
         }`;
 
     var vertexShader = gl.createShader(gl.VERTEX_SHADER);
     gl.shaderSource(vertexShader, vertexShaderCode);
     gl.compileShader(vertexShader);
 
     var fragmentShaderCode = `
     void main()
         {
             gl_FragColor = vec4 (0.0, 0.0, 0.0, 0.5);
         }
     `;
 
     var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
     gl.shaderSource(fragmentShader, fragmentShaderCode);
     gl.compileShader(fragmentShader);
 
     var shaderProgram = gl.createProgram();
     gl.attachShader(shaderProgram, vertexShader);
     gl.attachShader(shaderProgram, fragmentShader);
     gl.linkProgram(shaderProgram);
     gl.useProgram(shaderProgram);
 
     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     var aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
     gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(aPosition);
 
     gl.clearColor(1.0, 1.0, 1.0, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
 
     gl.drawArrays(gl.LINE_LOOP, 0, 8);
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
