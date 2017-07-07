import React from 'react';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style : {
        opacity:0,
        transition: '325ms ease-in-out'
      }
    }

    this.handleImageError = this.handleImageError.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded() {
    this.setState((prevState) => {
      prevState.style = {
        opacity: 1,
        transition: '325ms ease-in-out'
      }
    })
  }

  handleImageError() {
    
  }

  render() {
    return (
      <img className={this.props.style} style={this.state.style} src={this.props.src} alt={this.props.alt} onLoad={this.handleImageLoaded} onError={this.handleImageError} />
    );
  }
}

export default Image;
