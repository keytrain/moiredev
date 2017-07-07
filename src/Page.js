import React from 'react';
import Image from './Image';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageState: undefined
    }
    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);
  }

  handleRightLoaded() {
    console.log('loaded')
  }

  handleRightError() {
    console.log('error')
  }



  render() {
    return (
      <div>
        <Image src={this.props.src} loaded={this.handleRightLoaded} error={this.handleRightError} />
      </div>
    );
  }
}

export default Page;