import * as THREE from "three";
import Common from "./Common";
import TWEEN from '@tweenjs/tween.js'

// Shaders
import vertexShader from "./glsl/shape.vert";
import fragmentShader from "./glsl/shape.frag";

// Eventbus, for animation etc. Could move to VueX
import EventBus from "~/utils/event-bus";

// Using this for a random factor a bit lower, in the createOrb function
const start = Date.now();


// Animation functions
function move(orb){
  
  let start = {
    x: orb.shape.position.x,
    y: orb.shape.position.y,
    z: orb.shape.position.z,
    rX: orb.shape.rotation.x,
    rY: orb.shape.rotation.y,
    rZ: orb.shape.rotation.z
  }

  let finish = {
    x: (orb.shape.position.x +  .5*Math.sin(Math.floor(Math.random() * 201) - 100)),
    y: (orb.shape.position.y +  .5*Math.sin(Math.floor(Math.random() * 201) - 100)),
    z: (orb.shape.position.z +  .5*Math.sin(Math.floor(Math.random() * 201) - 100)),
    rX: orb.shape.rotation.x - Math.sin(Math.floor(Math.random() * 201) - 100),
    rY: orb.shape.rotation.y - Math.sin(Math.floor(Math.random() * 201) - 100),
    rZ: orb.shape.rotation.z - Math.sin(Math.floor(Math.random() * 201) - 100)
  }



  let tween = new TWEEN.Tween(start).to(finish, 8000);
  // Easings examples: https://sole.github.io/tween.js/examples/03_graphs.html
  tween.easing(TWEEN.Easing.Exponential.InOut)
  
  tween.onUpdate(i => {
    orb.shape.position.set(start.x, start.y, start.z)
    orb.shape.rotation.set(start.rX, start.rY, start.rZ)
  })
  tween.start();
  tween.onComplete(i => {
    move(orb)
    // tween.start()
  });
  
  // tween.repeat(Infinity);

}
// Where we create the orb
const createOrb = function (item) {
  this.perlin = item.perlin;
  this.mat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    // Here are a bunch of uniforms I'm not using. Might delete later
    // TODO
    uniforms: {
      time: {
        type: "f",
        value: 0.1
      },
      pointscale: {
        type: "f",
        value: 0.2
      },
      decay: {
        type: "f",
        value: 0.3
      },
      size: {
        type: "f",
        value: 1
      },
      displace: {
        type: "f",
        value: 0.3
      },
      complex: {
        type: "f",
        value: 0.0
      },
      waves: {
        type: "f",
        value: 0.10
      },
      eqcolor: {
        type: "f",
        value: 0.0
      },
      rcolor: {
        type: "f",
        value: 0.0
      },
      gcolor: {
        type: "f",
        value: 0.0
      },
      bcolor: {
        type: "f",
        value: 0.0
      },
      fragment: {
        type: "i",
        value: true
      },
      redhell: {
        type: "i",
        value: true
      },
      opacity: {
        type: "f",
        value: 1
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  // Create the orb
  const orbGeo = new THREE.IcosahedronBufferGeometry(2, 6);
  const orb = new THREE.Mesh(orbGeo, this.mat);
  
  // Create catcher for mouse
  const tomGeo = new THREE.IcosahedronBufferGeometry(40, 1);
  const tomMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0
    // wireframe: true
  });

  let tom = new THREE.Mesh(tomGeo, tomMat);

  const shapeGroup = new THREE.Group();
  
  shapeGroup.add(orb)
  shapeGroup.add(tom)
  
  
  // Add meta for linking in vue app
  
  shapeGroup.userData = { ...item.meta, startPosition: { ...item.position } }
  this.shape = shapeGroup

  // This is where we are using time, for a random factor
  this.mat.uniforms['time'].value = (this.perlin.speed / 1000) * (Date.now());

  // Set all the uniforms based on the options we passed in "item"
  this.mat.uniforms['pointscale'].value = this.perlin.perlins;
  this.mat.uniforms['decay'].value = this.perlin.decay;
  this.mat.uniforms['size'].value = this.perlin.size;
  this.mat.uniforms['displace'].value = this.perlin.displace;
  this.mat.uniforms['complex'].value  = this.perlin.complex;
  this.mat.uniforms['waves'].value = this.perlin.waves;
  this.mat.uniforms['fragment'].value = this.perlin.fragment;

  this.mat.uniforms['redhell'].value = this.perlin.redhell;
  this.mat.uniforms['eqcolor'].value = this.perlin.eqcolor;
  this.mat.uniforms['rcolor'].value = this.perlin.rcolor;
  this.mat.uniforms['gcolor'].value = this.perlin.gcolor;
  this.mat.uniforms['bcolor'].value = this.perlin.bcolor;

  this.mat.uniforms['opacity'].value = this.perlin.opacity;

  return this;
  
}

export default class Shape {
  constructor(orbSettings) { 
    // Create Orbs (start)
    // array to add the created orbs to
    this.orbs = [];
    this.settings = orbSettings
    this.transitioning = false;
    this.init();
  }

  init() {
    // Make Orbs
    this.createdOrbs = this.settings.map(item => new createOrb(item))


    // Add shapes to the scene
    this.createdOrbs.map(item => {
      // item.shape.position.x = Math.random()*100
      item.shape.position.x = 0
      // item.shape.position.y = Math.random()*100
      item.shape.position.y = 0
      // item.shape.position.z = Math.random()*100
      item.shape.position.z = 0
      
      // item.shape.position.set(0.1,10,0)
      Common.scene.add(item.shape)
    })

    // Animate orbs
    this.createdOrbs.map(move)

    // Listen for events passed by the eventbus
    // EventBus.$on("TRANSITION", this.onTransition.bind(this));
  }


  
  resize(orb) {
    // Resize animation
    const start = 200;
    let finish = 30;
    let current = { x: start };

    let tweenPopup = new TWEEN.Tween(current).to({ x: finish }, 2000);
    // Easings examples: https://sole.github.io/tween.js/examples/03_graphs.html
    tweenPopup.easing(TWEEN.Easing.Sinusoidal.InOut)
    
    tweenPopup.onUpdate(i => orb.mat.uniforms['size'].value = current.x)
    tweenPopup.start();
  }

  onTransition(path) {
    // Not using the path param at this point, this might be used in  a switch
    this.transitioning = false;
    this.createdOrbs.map(orb => this.resize(orb, 100))
  }

  animation(orb) {
    
    orb.mat.uniforms['time'].value = (orb.perlin.speed /1000) * (Date.now() - start);
  }

  update() {
    TWEEN.update();
    this.createdOrbs.map(this.animation)
  }
}