import React, { Component } from 'react';
import './Dropdown.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClicked = this.handleClicked.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur() {
    this.setState({open:false});
  }
  handleClicked() {
    this.setState({open:true});
  }

  render() {
    return (
      <div>
        <div className='attachPoint' 
          onClick={this.handleClicked} 
          onBlur={this.handleBlur} 
          tabIndex='0'>
          
          {this.props.attach}

          {this.state.open &&
          <div className='menu'>
            {this.props.children}
          </div>
          }

        </div>
      </div>
    );
  }
}

export default Dropdown;