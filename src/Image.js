import React from "react";

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {},
      loader: true,
    };

    this.handleImageError = this.handleImageError.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded() {
    this.setState({
      loader: false,
      show: Object.assign(
        {},
        {
          opacity: 1,
        }
      ),
    });

    if (typeof this.props.loaded === "function") {
      this.props.loaded();
    }
  }

  handleImageError() {
    if (typeof this.props.error === "function") {
      this.props.error();
    }
  }

  render() {
    const container = {
      position: "relative",
    };
    const duration = 200;
    const defaultStyle = {
      opacity: 0,
      transition: `opacity ${duration}ms ease-out`,
      verticalAlign: "top",
    };
    // const defaultLoaderStyle ={
    //   animation: 'spin 500ms linear infinite',
    //   position: 'absolute',
    //   left: '50%',
    //   top: '50%',
    //   transform: 'translate(-50%, -50%)',
    //   color: '#333',
    //   transition: `opacity ${duration}ms ease-in-out`,
    // }
    return (
      <div className={this.props.containerClass} style={container}>
        <img
          className={this.props.imgClass}
          style={{
            ...defaultStyle,
            ...this.state.show,
          }}
          src={this.props.src}
          alt={this.props.alt}
          onLoad={this.handleImageLoaded}
          onError={this.handleImageError}
        />
        {/* {this.state.loader &&
        <MdToys size={24} style={{
          ...defaultLoaderStyle
        }} />} */}
      </div>
    );
  }
}

export default Image;
