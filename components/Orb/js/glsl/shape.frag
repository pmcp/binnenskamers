  varying float qnoise;
  uniform float rcolor;
  uniform float gcolor;
  uniform float bcolor;
  uniform float opacity;
  
  void main() {
    float r, g, b;
    r = sin(qnoise + rcolor);
    g = sin(qnoise + gcolor);
    b = sin(qnoise + bcolor);
    gl_FragColor = vec4(r, g, b, opacity);
  }