import React, { Component } from 'react';

class DropdownItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='dropdown-row' name={this.props.name} value={this.props.text} onClick={this.props.handle}>
        <div className='dropdown-icon'>{this.props.icon}</div>
        <div className={'dropdown-text ' + (this.props.selection === this.props.text ? 'dropdown-text-active':'')} 
         >{this.props.text}</div>
        <div className='dropdown-right'>{this.props.right}</div>
      </div>
    );
  }
}

export default DropdownItem;