import * as THREE from "three";
import EventBus from "~/utils/event-bus";



class Common{
    constructor(){
        this.scene = null;
        this.camera = null;
        this.raycaster = null;
        this.mouse = null;
        this.intersected = null;
        this.renderer = null;

        this.size = {
            windowW: null,
            windowH: null
        };

        this.clock = null;

        this.time = {
            total: null,
            delta: null
        };
    }

    onMouseDown( event ) {
      console.log( event )
    }

    onMouseMove( event ) {
      
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      // TODO: Fix this, seems like i'm not getting the right coordinates

      
      this.mouse.x = ( event.clientX / this.size.windowW ) * 2 - 1;
      this.mouse.y = - ( event.clientY / this.size.windowH ) * 2 + 1;
      // console.log(this.mouse.x, this.mouse.y)      
      // this.mouse.x = event.clientX;
      // this.mouse.y = event.clientY;

      
      // console.log(this.scene.children)
      this.raycaster.setFromCamera( this.mouse, this.camera );  
      let intersects = this.raycaster.intersectObjects(this.scene.children );
      // console.log(this.raycaster.intersectObjects( this.scene.children ))
      // console.log(this.scene.children)
				if ( intersects.length > 0 ) {
          
					if ( this.intersected != intersects[ 0 ].object ) {
						// if ( this.intersected ) this.intersected.material.emissive.setHex( this.intersected.currentHex );
            
            this.intersected = intersects[ 0 ].object;
            console.log(this.intersected)
            this.intersected.material.uniforms['size'].value =  2
            EventBus.$emit("MOUSEOVER", this.intersected.meta);


            if(this.intersected.material.uniforms['size'].value > 2) return;
            // if(this.transitioning === true ) return;
            // orb.mat.uniforms['size'].value = orb.mat.uniforms['size'].value + 2
            // requestAnimationFrame(() => { this.resize(orb, 100); });



					}

				} else {
          // console.log('we here')
					if ( this.intersected ) this.intersected.material.uniforms['size'].value =  10

					this.intersected = null;

				}


    
    }
    

    init($canvas){
        this.canvas = $canvas;
        this.setSize();
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45, 
            this.size.windowW / this.size.windowH,
            0.1, 
            10000
        );
        
        this.camera.position.set(0, 10, -10);
        this.camera.lookAt(this.scene.position);
        
        // Raycaster for mouse over and clicks
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // update the picking ray with the camera and mouse position
        
	      // // calculate objects intersecting the picking ray
        // let intersects = this.raycaster.intersectObjects( this.scene.children );
        // // console.log("intersected", intersects)

        // for ( var i = 0; i < intersects.length; i++ ) {
        //   intersects[ i ].object.material.color.set( 0xff0000 );
        // }


        
        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas,
            alpha:true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // this.renderer.setClearColor(0xEAF2F5);
        this.renderer.setClearColor( 0x000000, 0 ); // the default
        this.renderer.setSize(this.size.windowW, this.size.windowH);

        this.clock = new THREE.Clock();
        this.clock.start();
        this.canvas.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        this.canvas.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
        // $canvas.
        
        
    }

    setSize(){
      console.log('setSize')
      const canvas = document.getElementById("blobs");
      this.size = {
        windowW: canvas.offsetWidth,
        windowH: canvas.offsetHeight
      }
      
    }

    
    resize(){
      console.log('resize')
      this.setSize();
      this.camera.aspect = this.size.windowW / this.size.windowH;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.size.windowW, this.size.windowH);
  }

    render(){
      
      this.time.delta = this.clock.getDelta();
      this.time.total += this.delta;
      // console.log(this.scene.children)
      // console.log(typeof this.scene.children)
   


      this.renderer.render(this.scene, this.camera);
      
    }
}

export default new Common();