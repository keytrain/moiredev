import React from 'react';
// import Image from './Image';
import Transition from 'react-transition-group/Transition';
import MdToys from 'react-icons/lib/md/toys';

class Page extends React.Component {
  constructor(props) {
    super(props);
   this.state = {
      show : {},
      loader : true,
    }

    this.handleImageError = this.handleImageError.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }


  handleImageLoaded() {
    this.setState((prevState) => {
      prevState.loader = false;
      prevState.show = {
        opacity: 1,
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
    const duration = 425;
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
        {!this.props.show &&
        <MdToys size={30} style={{
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

export default Page;