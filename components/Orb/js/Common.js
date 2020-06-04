import * as THREE from "three";
import EventBus from "~/utils/event-bus";

class Common {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.raycaster = null;
    this.mouse = null;
    this.intersects = null;
    this.intersected = null;
    this.renderer = null;

    this.size = {
      width: null,
      height: null
    };
  }



  init() {
    this.canvas = document.getElementById('canvas');
    this.setSize();
    this.scene = new THREE.Scene();
    const fieldOfView = 75,
          aspectRatio =  this.size.width / this.size.height,
          near =  1,
          far = 1000;
  
    this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
    this.camera.lookAt(this.scene.position); // Set look at coordinate like this)
    
    // TODO: find right position
    this.camera.lookAt(this.scene.position);
    this.camera.position.z = 10;
    // this.camera.position.x = 250;
    this.camera.lookAt(0,0,0); // Set look at coordinate like this)

    // Raycaster for mouse over and clicks
    this.raycaster = new THREE.Raycaster();

    // Coordinate for cursor
    this.mouse = new THREE.Vector2();

    // Renderer with transparent background (alpha)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });

    // Set aspect ratio and all
    this.onResize()

    // Event Listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener("resize", this.onResize.bind(this), false);
  }

 

  onMouseDown(event) {
    
    
    this.setMouseCoordinates(event.clientX, event.clientY)
    
    //2. set the picking ray from the camera position and mouse coordinates
    this.setIntersects();
    
    if(this.intersected) {
      EventBus.$emit("MOUSEDOWN", this.intersected.parent.userData);
      // this.intersects[0].object.parent.children[0].material.uniforms.opacity = 0.8
      // const inverse = !this.intersects[0].object.parent.children[0].material.uniforms.redhell;
      // console.log(inverse)
      // this.intersects[0].object.parent.children[0].material.uniforms.redhell = inverse;
    }
    // for ( var i = 0; i < this.intersects.length; i++ ) {
    //   console.log( this.intersects[ i ] );  
    //   /*
    //     An intersection has the following properties :
    //     - object : intersected object (THREE.Mesh)
    //     - distance : distance from camera to intersection (number)
    //     - face : intersected face (THREE.Face3)
    //     - faceIndex : intersected face index (number)
    //     - point : intersection point (THREE.Vector3)
    //     - uv : intersection point in the object's UV coordinates (THREE.Vector2)
    //   */
    // }
  }

  onMouseMove(event) {
    this.setMouseCoordinates(event.clientX, event.clientY)
    this.setIntersects()
    if(this.intersected) {
      // console.log('here', this.intersected)
      
      // this.intersects[0].object.parent.children[0].material.uniforms.redhell = !this.intersects[0].object.parent.children[0].material.uniforms.redhell
      // TODO: TWEEN
  
    }

    // if (this.intersected != this.intersects[0].object) {
    //   // If we are over an object, trigger a change (for example, animate color)
    //   this.intersected.material.uniforms['rcolor'].value = this.intersected.material.uniforms['rcolor'].value + .1
    //   // Emitting is used to pass data or a function back to vue using the EventBus
    //   EventBus.$emit("MOUSEOVER", this.intersected.userData);
    // }
  }

  setIntersects() {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    this.intersects = this.raycaster.intersectObjects( this.scene.children, true );
  
    if (this.intersects.length > 0) {  
      console.log('found intersects')
      // Set the orb as the intersected element
      this.intersected = this.intersects[0].object
    } else {
      // console.log('no intersects')
      if(this.intersected !== null) {
        // this.intersected.material.uniforms.opacity = 0.2
        this.intersected = null;
      }
      
    }
  }

  setSize() {
    this.size = {
      width: this.canvas.offsetWidth,
      height: this.canvas.offsetHeight
    }
  }

  setMouseCoordinates = function(mousePosX, mousePosY){
    this.mouse.x = ( mousePosX / this.size.width ) * 2 - 1;
    this.mouse.y = - ( mousePosY / this.size.height ) * 2 + 1;
  }

  onResize() {
    this.setSize();
    this.renderer.setSize(this.size.width, this.size.height)
    this.camera.aspect = this.canvas.clientWidth/this.canvas.clientHeight
    this.camera.updateProjectionMatrix()

  }

  render() {
    this.renderer.render(this.scene, this.camera);
    
  }
}

export default new Common();