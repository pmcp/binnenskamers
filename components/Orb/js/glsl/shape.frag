varying float qnoise;
  varying float noise;
  
  uniform float time;
  uniform bool redhell;
  uniform float rcolor;
  uniform float gcolor;
  uniform float bcolor;
  uniform float opacity;
  
  void main() {
    float r, g, b;
    
    if (!redhell == true) {
      r = sin(qnoise + rcolor);
      g = normalize(qnoise + (gcolor / 2.0));
      b = tan(qnoise + bcolor);
    } else {
      r = cos(rcolor);
      g = cos(qnoise + gcolor);
      b = cos(bcolor);
    }
    
    gl_FragColor = vec4(r, g, b, opacity);
  }