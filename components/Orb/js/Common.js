import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js'
import EventBus from "~/utils/event-bus";


// const EffectComposer = require('three-effectcomposer')(THREE)


class Common {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.raycaster = null;
    this.mouse = null;
    this.renderer = null;
    this.objectsToCheckIntersects = [];
    this.activeOrb = null;
    this.orbDev = null;
    this.hoverStatus = 'NOHOVER';
    this.size = {
      width: null,
      height: null
    };
  }

  init() {
    this.canvas = document.getElementById('canvas');
    this.setSize();
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( this.size.width / - 1, this.size.width / 1, this.size.height / 1, this.size.height / - 1, 1, 1000 );

    // Raycaster for mouse over and clicks
    this.raycaster = new THREE.Raycaster();

    // Coordinate for cursor
    this.mouse = new THREE.Vector2();

    // Renderer with transparent background (alpha)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });


    // Event Listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);

    window.addEventListener("resize", this.onResize.bind(this), false);

    this.onResize()

    // Event bus coming from vue app
    EventBus.$on("ACTIVATEORB", data => {
      let activeGroup = null;
      if(data.room !== null) activeGroup = this.scene.children.filter(i => i.children[0].userData.room === data.room)
      if(data.link !== null) activeGroup = this.scene.children.filter(i => i.children[0].userData.index === data.link)
      if(activeGroup.length < 1) return;
      this.activeOrb = activeGroup[0].children[0]
      this.hoverStatus = 'HOVERING'
      this.onHover(this.activeOrb)
    });

    
    EventBus.$on("DEACTIVATEORB", data => {  
      this.hoverStatus = 'NOHOVER'
      if(this.activeOrb === null) return;
      this.onHover(this.activeOrb)
      // this.activeOrb = null;
    });













    
    // let TEXTURE = new THREE.TextureLoader().load(bg);
    // console.log(TEXTURE) 
    // let mesh = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(this.size.width, this.size.height, 32), 
    //   new THREE.MeshBasicMaterial({map: TEXTURE})
    // )
    // mesh.position.z = -100

    // // post processing
    
    // this.composer = new EffectComposer(this.renderer);
    // const renderPass = new EffectComposer.RenderPass(this.scene, this.camera);
    // this.composer.addPass(renderPass);

    // var myEffect = {
    //   uniforms: {
    //     "tDiffuse": { value: null },
    //     "resolution": { value: new THREE.Vector2(1.,this.size.height/this.size.width) },
    //     "uMouse": { value: new THREE.Vector2(-10,-10) },
    //     "uVelo": { value: 0 },
    //   },
    //   vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
    //   fragmentShader: `uniform float time;
    //   uniform sampler2D tDiffuse;
    //   uniform vec2 resolution;
    //   varying vec2 vUv;
    //   uniform vec2 uMouse;
    //   float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    //     uv -= disc_center;
    //     uv*=resolution;
    //     float dist = sqrt(dot(uv, uv));
    //     return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
    //   }
    //   void main()  {
    //       vec2 newUV = vUv;
    //       float c = circle(vUv, uMouse, 0.0, 0.2);
    //       float r = texture2D(tDiffuse, newUV.xy += c * (0.1 * .5)).x;
    //       float g = texture2D(tDiffuse, newUV.xy += c * (0.1 * .525)).y;
    //       float b = texture2D(tDiffuse, newUV.xy += c * (0.1 * .55)).z;
    //       vec4 color = vec4(r, g, b, 1.);
    //       gl_FragColor = color;
    //   }`
    // }

    // this.customPass = new EffectComposer.ShaderPass(myEffect);
    // this.customPass.renderToScreen = true;
    // this.composer.addPass(this.customPass);







  }

  onMouseDown(event) {
    this.setMouseCoordinates(event.clientX, event.clientY)
    this.setIntersects();
    
    
    if(event.altKey) {
      const size = this.size.width
      this.orbDev.position.set(size * this.mouse.x , size * this.mouse.y, 0);
    }


    if(event.metaKey) {
      alert(`"x":${this.mouse.x}, "y":${this.mouse.y}`)
    }
    if(this.activeOrb === null) return;

    
    
    if(event.shiftKey) {
      this.orbDev = this.activeOrb.parent.clone()
      this.scene.add(this.orbDev)
      
      return;
    } else {
      EventBus.$emit("MOUSEDOWNONORB", this.activeOrb.userData); 
      return;
    }
  }

  onMouseMove(event) {
    this.setMouseCoordinates(event.clientX, event.clientY)
    this.setIntersects()
  }

  setIntersects() {
    // Set the raycaster correctly (mouse position changed)
    this.raycaster.setFromCamera( this.mouse, this.camera );
    // Get intersected objects
    const intersects = this.raycaster.intersectObjects( this.objectsToCheckIntersects, true )
    if (intersects.length > 0) {
      if(this.hoverStatus === 'HOVERING') return;
      this.hoverStatus = 'HOVERING';
      if(this.activeOrb === intersects[0].object.parent.children[0]) return;
      this.activeOrb = intersects[0].object.parent.children[0];
      EventBus.$emit("MOUSEOVERORB", this.activeOrb.userData);  
      this.onHover(this.activeOrb)
    } else {
      if(this.hoverStatus === 'NOHOVER') return;
      this.hoverStatus = 'NOHOVER';
      EventBus.$emit("MOUSEOVERORB", null);
      this.onHover(this.activeOrb)
      this.activeOrb = null
    }
  }

  setSize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const offsetLeft =  this.canvas.getBoundingClientRect().left;
    const offsetTop =  this.canvas.getBoundingClientRect().top;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.size = {
        width: width,
        height: height,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft
      }
    }
  }

  onHover(orb){
    let start = {}
    let finish = {}
    if(this.hoverStatus === 'HOVERING') {
      start.opacity = orb.material.uniforms.opacity.value,
      finish.opacity = orb.material.uniforms.opacity.value * 1.4,
      start.size = orb.material.uniforms.size.value,
      finish.size = orb.userData.originalSettings.size * 0.8,
      start.displace = orb.material.uniforms.displace.value
      finish.displace = 2.2
    }
  
    if(this.hoverStatus === 'NOHOVER') {
      start.opacity = orb.material.uniforms.opacity.value,
      finish.opacity = orb.userData.originalSettings.opacity,
      start.size = orb.material.uniforms.size.value,
      finish.size = orb.userData.originalSettings.size,
      start.displace = orb.material.uniforms.displace.value,
      finish.displace = orb.userData.originalSettings.displace
    }
  
    let tween = new TWEEN.Tween(start).to(finish, 500);
    // Easings examples: https://sole.github.io/tween.js/examples/03_graphs.html
    tween.easing(TWEEN.Easing.Exponential.Out)
    
    tween.onUpdate(i => {
      orb.material.uniforms.opacity.value = start.opacity
      orb.material.uniforms.size.value = start.size
      orb.material.uniforms.displace.value = start.displace
    })
    tween.start();
    // tween.onStart(i => {})
    tween.onComplete(i => {
      if(this.hoverStatus === 'NOHOVER') {
        this.activeOrb = null;
      }
    });
  }

  setMouseCoordinates = function(mousePosX, mousePosY){
    this.mouse.x = ( (mousePosX - this.size.offsetLeft) / this.size.width ) * 2 - 1;
    const mouseY = mousePosY + window.scrollY
    this.mouse.y = - ( (mouseY- this.size.offsetTop) / this.size.height ) * 2 + 1

  }

  onResize() {
    this.setSize();
    this.renderer.setSize(this.size.width, this.size.height, false);
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    // this.customPass.uniforms.uMouse.value = this.mouse;
    // this.composer.render()
  }
}

export default new Common();