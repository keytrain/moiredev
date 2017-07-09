import React from 'react';
import MdToys from 'react-icons/lib/md/toys';


class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style : {
        opacity:0,
        transition: '325ms ease-in-out',
        verticalAlign: 'top'
      },
      loader : true,
    }

    this.handleImageError = this.handleImageError.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded() {
    this.setState((prevState) => {
      prevState.loader = false;
      prevState.style = {
        opacity: 1,
        transition: 'opacity 325ms ease-in-out',
        verticalAlign: 'top'
      }
    })
    if (typeof this.props.loaded === 'function') {
      this.props.loaded();
    }
  }

  handleImageError() {
    if (typeof this.props.error === 'function') {
      this.props.error();
    }
  }

  render() {
    const container = {
      position: 'relative'
    }
    return (
      <div className={this.props.containerClass} style={container}>
        <img className={this.props.imgClass} style={this.state.style} src={this.props.src} alt={this.props.alt} onLoad={this.handleImageLoaded} onError={this.handleImageError} />
        {this.state.loader &&
        <MdToys size={24} style={{
          animation: 'spin 2s linear infinite',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#333'
        }} />}
      </div>
    );
  }
}

export default Image;
