import Common from "./Common";
import Shape from "./Shape"

export default class OrbGL{
  constructor(props){
    // Props passed from the vue instance
    this.init(props);
  }

  init(props){
    Common.init();
    // Create the orb 
    this.shape = new Shape(props.orbSettings);
    // Start rendering. This is a recurring function (requestAnimationFrame)
    this.render();
  }

  render() {
    // Animate the orb
    this.shape.update();
    Common.render();
    // Recursion
    requestAnimationFrame(this.render.bind(this));
  }
}