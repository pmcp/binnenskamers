import Common from "./Common";
import Shape from "./Shape"
import TWEEN from '@tweenjs/tween.js'

// const start = Date.now();
export default class OrbGL{
  constructor(props){
    this.init(props);
  }

  init(props){
    Common.init(props)    
    this.render();
  }

  render() {
    Common.render();
    TWEEN.update()
    requestAnimationFrame(this.render.bind(this));
  }
}