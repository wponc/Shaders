const fragmentShader = `

precision highp float;

uniform sampler2D u_texture; // <---------------------------------- texture sampler uniform

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

    
void main() {
    
    // gl_FragColor = vec4((sin(u_time)) * .4,(cos(u_time) * .2) * .4,.2, 1.0);
    gl_FragColor = vec4(.61,.4,u_scroll * .025,1.);
}
`

export default fragmentShader