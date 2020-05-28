import * as THREE from "three";
import Common from "./Common";
// const TWEEN = require('@tweenjs/tween.js');
import TWEEN from '@tweenjs/tween.js'
// import * as TWEEN from '@tweenjs/tween.js';


// import calcShape from "./calcShape";

import data from "./data";

const orbs = data.orbs
import vertexShader from "./glsl/shape.vert";
import fragmentShader from "./glsl/shape.frag";

import EventBus from "~/utils/event-bus";

var start = Date.now();


var primitiveElement = function(item) {
  
  
  // const mesh = new THREE.Object3D();
  this.perlin = item.perlin;
  this.mat = new THREE.ShaderMaterial( {
    side:THREE.DoubleSide,
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
        value: 0.3
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
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  //---
  // var wir_mat = new THREE.MeshBasicMaterial({color:Theme.darker});
  const geo = new THREE.IcosahedronBufferGeometry(2, 6);
  // const wir = new THREE.IcosahedronBufferGeometry(2.3, 2);
  this.shape = new THREE.Mesh(geo, this.mat);

  this.shape.position.set(item.position.x, item.position.y, item.position.z);
  
  this.mat.uniforms['time'].value = (this.perlin.speed / 1000) * (Date.now());
  
  this.mat.uniforms['pointscale'].value =    this.perlin.perlins;
  this.mat.uniforms['decay'].value =         this.perlin.decay;
  this.mat.uniforms['size'].value =          this.perlin.size;
  this.mat.uniforms['displace'].value =      this.perlin.displace;
  this.mat.uniforms['complex'].value =       this.perlin.complex;
  this.mat.uniforms['waves'].value =         this.perlin.waves;
  this.mat.uniforms['fragment'].value =      this.perlin.fragment;
  
  this.mat.uniforms['redhell'].value =       this.perlin.redhell;
  this.mat.uniforms['eqcolor'].value =      this.perlin.eqcolor;
  this.mat.uniforms['rcolor'].value =        this.perlin.rcolor;
  this.mat.uniforms['gcolor'].value =        this.perlin.gcolor;
  this.mat.uniforms['bcolor'].value =        this.perlin.bcolor;


  // META
  this.shape.meta = item.name;
  return this;
  
}


export default class Shape{
    constructor(){
        this.createdOrbs = [];
        this.transitioning = false;
        this.init();
    }

    init(){
      this.createdOrbs = orbs.map(item => new primitiveElement(item))
      this.createdOrbs.map(item => Common.scene.add(item.shape))
      
      
      this.createdOrbs.map(this.animation)
        EventBus.$on("TRANSITION", this.onTransition.bind(this));
    }
    resize(orb, end){
      TWEEN.removeAll();
      var start = 200
      var finish = 1
      var current	= { x: start };

      orb.mat.uniforms['size'].value = 10
      // console.log(orb.mat.uniforms['size'].value)
      var tweenHead = new TWEEN.Tween(current).to({x: finish}, 2000);
      tweenHead.easing(TWEEN.Easing.Elastic.InOut)
      
      tweenHead.onUpdate(function(){
        // console.log('here', current.x)
        orb.mat.uniforms['size'].value = current.x;
      });
    
      tweenHead.start()

      // tweenBack.onUpdate(function(){
      // console.log('here')
      // orb.mat.uniforms['size'].value = finish.x;
      // });
      
  
  

    
    

    
      // console.log('start resize', orb.mat.uniforms['size'].value)
      // if(orb.mat.uniforms['size'].value > end) return;
      // if(this.transitioning === true ) return;
      // orb.mat.uniforms['size'].value = orb.mat.uniforms['size'].value + 2
      // requestAnimationFrame(() => { this.resize(orb, 100); });
    }

    onTransition(path){
      this.transitioning = true;
      switch(path){
        case "index": 
          this.transitioning = false;
          this.createdOrbs.map(orb => {
            this.resize(orb, 100);
            // requestAnimationFrame(() => { this.resize(orb, 100); });
          })
        // this.transitionTarget.set(1, 0, 0, 0);
        break;

        case "about":
          this.createdOrbs.map(orb => {
            orb.mat.uniforms['size'].value = 10
          })
        // this.transitionTarget.set(0, 1, 0, 0);
        break;

        case "contact":
        // this.transitionTarget.set(0, 0, 1, 0);
        break;

        default: 
        // this.transitionTarget.set(0, 0, 0, 1);
        break;

      }

    }

    animation(_primitive) {
      TWEEN.update();
      _primitive.mat.uniforms['time'].value = (_primitive.perlin.speed / 1000) * (Date.now() - start);
      // _primitive.mat.uniforms['pointscale'].value =    _primitive.perlin.perlins;
      // _primitive.mat.uniforms['decay'].value =         _primitive.perlin.decay;
      // _primitive.mat.uniforms['size'].value =        s  _primitive.perlin.size;
      // _primitive.mat.uniforms['displace'].value =      _primitive.perlin.displace;
      // _primitive.mat.uniforms['complex'].value =       _primitive.perlin.complex;
      // _primitive.mat.uniforms['waves'].value =         _primitive.perlin.waves;
      // _primitive.mat.uniforms['fragment'].value =      _primitive.perlin.fragment;
      
      // _primitive.mat.uniforms['redhell'].value =       _primitive.perlin.redhell;
      // _primitive.mat.uniforms['eqcolor'].value =      _primitive.perlin.eqcolor;
      // _primitive.mat.uniforms['rcolor'].value =        _primitive.perlin.rcolor;
      // _primitive.mat.uniforms['gcolor'].value =        _primitive.perlin.gcolor;
      // _primitive.mat.uniforms['bcolor'].value =        _primitive.perlin.bcolor;
    }

    update(){
      
      this.createdOrbs.map(this.animation)
    }
}