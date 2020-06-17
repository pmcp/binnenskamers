import * as THREE from "three";
import EventBus from "~/utils/event-bus";
import Shape from "./Shape"


function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

class Common {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.raycaster = null;
    this.mouse = null;
    this.renderer = null;
    this.objectsToCheckIntersects = [];
    this.activeOrb = null;
    this.activeOrbs = {};
    this.orbDev = null;
    this.hoverStatus = 'NOHOVER';
    this.size = {
      width: null,
      height: null,
      offsetTop: null,
      offsetLeft: null
    };
  }

  init(props) {
    
    // Let's first check if we can do webgl
    this.canvas = document.getElementById('canvas');
    this.setSize();
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera( this.size.width / - 1, this.size.width / 1, this.size.height / 1, this.size.height / - 1, 1, 1000 );
  
    this.camera.position.set(0, 10, 20);
  
    // Raycaster for mouse over and clicks
    this.raycaster = new THREE.Raycaster();
    // Coordinate for cursor
    this.mouse = new THREE.Vector2();
    // Renderer with transparent background (alpha: true)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    // Event Listeners
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener("resize", this.onResize.bind(this), false);

    // Trigger on resize already once, so everything is nicely matched up
    this.onResize()
    // Event bus coming from vue app
    EventBus.$on("ACTIVATEORB", data => {
      let activeGroup = [];
      // TODO: Might change this to id's of orbs.
      // let val = (data.room === null) ? data.link : val = data.room;
      
      activeGroup = this.scene.children.filter(i => i.children[0].userData.meta.index === data.index)
        
   
      if(activeGroup.length === 1) {
        const activeOrb = activeGroup[0].children[0];
        if(this.activeOrbs[activeOrb.uuid]) return;
        this.activeOrbs[activeOrb.uuid] = activeOrb
        activeOrb.userData.grow(1)
        
      }
      
    });

    
    EventBus.$on("DEACTIVATEORB", data => { 
      
      // if(this.activeOrbs === null) return;
      if(!isEmpty(this.activeOrbs)) {
        for (var key in this.activeOrbs) {
          if (!this.activeOrbs.hasOwnProperty(key)) continue;
          var obj = this.activeOrbs[key];
          obj.userData.grow(0)
        }

        this.activeOrbs = {}
      }

      
    });

    // Create Orbs
    props.orbSettings.map(orb => new Shape(orb))
    

  }

  onMouseDown(event) {
    this.setMouseCoordinates(event.clientX, event.clientY)
    this.setIntersects();

    if(event.metaKey) {
      alert(`"x":${this.mouse.x}, "y":${this.mouse.y}`)
    }
  
  
    if(isEmpty(this.activeOrbs)) return;
    EventBus.$emit("MOUSEDOWNONORB", this.activeOrbs[Object.keys(this.activeOrbs)[0]].userData.meta);
  }

  onMouseMove(event) {
    this.setMouseCoordinates(event.clientX, event.clientY)
    this.setIntersects()
  }

  setIntersects() {
    this.raycaster.setFromCamera( this.mouse, this.camera );

    this.intersects = this.raycaster.intersectObjects( this.scene.children, true )
    if (this.intersects.length > 0) {
      const activeOrb = this.intersects[0].object.parent.children[0]
      if(this.activeOrbs[activeOrb.uuid]) return;
      this.activeOrbs[activeOrb.uuid] = activeOrb
      activeOrb.userData.grow(1)
      EventBus.$emit("MOUSEOVERORB", this.activeOrbs[Object.keys(this.activeOrbs)[0]].userData.meta);
    } else { 
      
      if(!isEmpty(this.activeOrbs)) {
        for (var key in this.activeOrbs) {
          if (!this.activeOrbs.hasOwnProperty(key)) continue;
          var obj = this.activeOrbs[key];
          obj.userData.grow(0)
          
        }
        this.activeOrbs = {}
       
      }
      
    }
  }

  setSize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const offsetLeft =  this.canvas.getBoundingClientRect().left;
    const offsetTop =  this.canvas.getBoundingClientRect().top;
    if (this.size.width !== width || this.size.height !== height || this.size.offsetTop !== offsetTop || this.size.offsetLeft !== offsetLeft)  {
      this.size = {
        width: width, 
        height: height,
        offsetTop: offsetTop,
        offsetLeft: offsetLeft
      }
    }
  }


  setMouseCoordinates = function(mousePosX, mousePosY){
    this.mouse.x = ( (mousePosX + window.scrollX - this.size.offsetLeft) / this.size.width ) * 2 - 1;
    this.mouse.y = - ( (mousePosY + window.scrollY - this.size.offsetTop) / this.size.height ) * 2 + 1

  }

  onResize() {
    this.setSize();
    this.renderer.setSize(this.size.width, this.size.height, false);
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.scene.children.map(child => child.children[0].userData.animate())
    
  }
}

export default new Common();