const vertexShader = `
    uniform float u_time;
    varying vec3 pos;
    varying vec2 vUv;
    uniform vec2 u_mouse;

    void main()	{
      pos = position;
      vec3 p = position;
      p.y = sin(pow(4., p.x) - u_time) * sin(p.z - u_time) * .2;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    }

`

export default vertexShader