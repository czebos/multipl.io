
const Constants = require('../shared/constants');

import React from 'react';
import ReactDOM from 'react-dom';
import Keyframes from '@keyframes/core';

import './style.css'


export function myMove(packet) {
    const tuple = JSON.parse(packet)
    var visual;
  

    visual = <Dot ref= {ref => this.reference = ref}color={ "#" + tuple[4] }/>;
  
    var pane = document.createElement("ok")
    pane.zIndex = -1
    document.getElementById('renderedGame').appendChild(pane);
    ReactDOM.render(
        visual,
        pane
    );

    var duration = Constants.calcDistance(tuple[0], tuple[1], tuple[2], tuple[3])
    this.reference.animate(tuple[0], tuple[1], tuple[2], tuple[3], duration)
    setTimeout(() => {
      document.getElementById('renderedGame').removeChild(pane);
    }, duration)
  }


  class Dot extends React.Component{
    constructor(props) {
      super(props);
      this.state = {X: this.props.X, Y: this.props.Y}
      this.animate = this.animate.bind(this);
      this.ref = React.createRef()
      
  }

  animate(x1, x2, y1, y2, duration) {

    var tuple1 = Constants.toAcutalLoc(x1, y1)
    var tuple2 = Constants.toAcutalLoc(x2, y2)
    var sx1 = tuple1[0] + (25)
    var sy1 = tuple1[1] + (25)
    var sx2 = tuple2[0] + (25)
    var sy2 = tuple2[1] + (25)

    const randString =  "a"+ Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    Keyframes.define({
        name: randString,
        from: {
            marginLeft: sx1,
            marginTop: sy1
        },
        to: {
            marginLeft: sx2,
            marginTop: sy2
        }
    });


    var anim = new Keyframes(this.ref.current)
    anim.play({name: randString, duration: duration.toString() + "ms", iterationCount: 1}, )
  }

  render() {
    const style = {backgroundColor: this.props.color}

    return (
      <img style = {style}className = {"myClass"} ref ={this.ref}></img>
    );

  }
}