import React from 'react';
import MdToys from 'react-icons/lib/md/toys';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';

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
      show: false
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
      prevState.show = true;
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
    const duration = 325;
    const defaultStyle = {
      opacity:0,
      transition: `opacity ${duration}ms ease-in-out`,
      verticalAlign: 'top'
    }
    const transitionStyles = {
      entering: {
        opacity: 1
      },
      entered: {
        opacity: 1
      },
      exiting: {
        opacity: 0
      },
      exited: {
        opacity: 0
      }
    }

    return (
      <div className={this.props.containerClass} style={container}>
        <Transition in={this.props.show} timeout={duration} key={this.props.src}>
          {(state) => (
            <img className={this.props.imgClass} 
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }} 
            src={this.props.src} alt={this.props.alt} 
            onLoad={this.handleImageLoaded} 
            onError={this.handleImageError} />
          )}
        </Transition>
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
