import React from 'react';

import './style.css' 
import {handleClick} from "./input"
const Constants = require('../shared/constants');

class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {life:this.props.startingLife, color: this.props.originalColor, borderColor: "white"};
        this.handleClick = this.handleClick.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setLife = this.setLife.bind(this);
        this.select = this.select.bind(this);
        this.unselect = this.unselect.bind(this);
    }

    select(){
      this.setState({borderColor: "yellow"})

    }

    unselect(){
      this.setState({borderColor: "white"})

    }

    handleClick() {
        handleClick(this)
    }

    setColor(color){
        this.setState({color: color})
    }

    setLife(life){
        this.setState({life: life})
    }


    render() {
      var tuple = Constants.toAcutalLoc(this.props.X, this.props.Y)
      var X = tuple[0]
      var Y = tuple[1]
      return (
        
        <div onClick={this.handleClick}
        style={{
          marginLeft: X,
          marginTop: Y,
            backgroundColor: this.state.color,
            borderColor: this.state.borderColor
          }} className = "Circle">
          <h2 > {this.state.life}</h2>
        </div>
      );
    }
  }



  export {Circle};
