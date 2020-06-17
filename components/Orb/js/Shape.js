import * as THREE from "three";
import Common from "./Common";
import TWEEN from '@tweenjs/tween.js'

// Shaders
import vertexShader from "./glsl/shape.vert";
import fragmentShader from "./glsl/shape.frag";

// Using this for a random factor a bit lower, in the createOrb function
const start = Date.now();

const createOrb = function (item) {
  this.perlin = item.perlin;
  this.mat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    // TODO: Here are a bunch of uniforms I'm not using. Might delete later
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

  this.mouseOver = false;
  // Create the orb
  const orbGeo = new THREE.IcosahedronBufferGeometry(2, 6);
  this.orb = new THREE.Mesh(orbGeo, this.mat);

  // Create catcher for mouse
  const scaleTom = orbGeo.parameters.radius / item.perlin.size * 3

  var tomGeo = new THREE.CubeGeometry(scaleTom, scaleTom, scaleTom)

  const tomMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
    // wireframe: true
  });

  this.tom = new THREE.Mesh(tomGeo, tomMat);


  // this.shape = this.tom
  this.shape = new THREE.Object3D();
  this.shape.add(this.orb)
  this.shape.add(this.tom)

  this.mat.uniforms['time'].value = (this.perlin.speed / 1000) * (Date.now());

  // Set all the uniforms based on the options we passed in "item"
  this.mat.uniforms['pointscale'].value = this.perlin.perlins;
  this.mat.uniforms['decay'].value = this.perlin.decay;
  this.mat.uniforms['size'].value = this.perlin.size;
  this.mat.uniforms['displace'].value = this.perlin.displace;
  this.mat.uniforms['complex'].value = this.perlin.complex;
  this.mat.uniforms['waves'].value = this.perlin.waves;
  this.mat.uniforms['fragment'].value = this.perlin.fragment;

  this.mat.uniforms['redhell'].value = this.perlin.redhell;
  this.mat.uniforms['eqcolor'].value = this.perlin.eqcolor;
  this.mat.uniforms['rcolor'].value = this.perlin.rcolor;
  this.mat.uniforms['gcolor'].value = this.perlin.gcolor;
  this.mat.uniforms['bcolor'].value = this.perlin.bcolor;

  this.mat.uniforms['opacity'].value = this.perlin.opacity;



  this.shape.userData = {
    move: () => {
      // TODO: Optimize
      let start = {
        x: this.shape.position.x,
        y: this.shape.position.y,
        rX: this.shape.rotation.x,
        rY: this.shape.rotation.y,
      }

      let finish = {
        x: (this.shape.position.x + -20 * Math.sin(Math.floor(Math.random() * 201) - 10)),
        y: (this.shape.position.y + 20 * Math.sin(Math.floor(Math.random() * 201) - 100)),
        rX: this.shape.rotation.x - Math.sin(Math.floor(Math.random() * 201) - 100),
        rY: this.shape.rotation.y - Math.sin(Math.floor(Math.random() * 201) - 100),
      }
      const max = 5000;
      const min = 3000;
      const speed = Math.floor(Math.random() * (max - min + 1) + min);
      let tween = new TWEEN.Tween(start).to(finish, speed);
      tween.easing(TWEEN.Easing.Exponential.InOut)
      tween.onUpdate(i => {
        this.shape.position.set(start.x, start.y, -100)
        this.shape.rotation.set(start.rX, start.rY, -100)
      })
      tween.start();
      tween.onComplete(i => {
        this.shape.userData.move()
        tween.start()
      });
    }
  }
  
  this.orb.userData = {
    meta: item.meta,
    startValues: { ...item.position, size: this.perlin.size, opacity: this.perlin.opacity, displace: this.perlin.displace },
    animate: () => {
      this.orb.material.uniforms['time'].value = (this.perlin.speed / 1000) * (Date.now() - start)
    },

    grow: (val) => {
      if (this.big && val === 0) {
        this.orb.userData.shrink()
        return
      }

      if (val === 0) {
        this.tweenGrow.stop()
        return
      }

  

      if (this.mouseOver === true) return;
      this.mouseOver = true;
      const start = { size: this.orb.material.uniforms.size.value, opacity: this.orb.material.uniforms.opacity.value, displace: this.orb.material.uniforms.displace.value }
      const finish = { size: 0.03, opacity: 0.9, displace: this.orb.material.uniforms.displace.value*1.5}

      this.tweenGrow = new TWEEN
        .Tween(start)
        .to(finish, 500)
        .easing(TWEEN.Easing.Exponential.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
          this.mat.uniforms.size.value = start.size
          this.mat.uniforms.opacity.value = start.opacity
          this.mat.uniforms.displace.value = start.displace
        })
        .start()
        .onStart(() => {
          // console.log('started grow')
        })
        .onStop(() => {
          // console.log('stopped grow')
          this.orb.userData.shrink()
        })
        .onComplete(() => {
          // console.log('completed grow')
          this.big = true;
          // this.shrink()
        })
    },

    shrink: () => {
      this.mouseOver = false;
      
      const start = { size: this.orb.material.uniforms.size.value, opacity: this.orb.material.uniforms.opacity.value, displace: this.orb.material.uniforms.displace.value }
      const finish = { size: this.orb.userData.startValues.size, opacity: this.orb.userData.startValues.opacity, displace: this.orb.userData.startValues.displace}

      this.tweenShrink = new TWEEN
        .Tween(start)
        .to(finish, 1000)
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(() => {
          // console.log(start, finish)
          this.mat.uniforms.size.value = start.size
          this.mat.uniforms.opacity.value = start.opacity
          this.mat.uniforms.displace.value = start.displace
        })
        .start()
        .onStart(() => {
          console.log('started shrink')
        })
        .onStop(() => {
          console.log('stopped shrink')
        })
        .onComplete(() => {
          console.log('completed shrink')
        })
    },


  }
  const size = Common.size.width
  this.shape.position.x = size * item.position.x
  this.shape.position.y = size * item.position.y

  // Still needed?
  Common.objectsToCheckIntersects.push(this.tom)
  Common.scene.add(this.shape)
  return this;
}

export default class Shape {
  constructor(orb) {
    this.init(orb);
  }

  init(orb) {
    this.orb = new createOrb(orb);
    this.orb.shape.userData.move()
    
  }
}