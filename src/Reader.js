import React from 'react';
import './Reader.css';
import cData from './chapterData';
import Page from './Page';

class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageMode: localStorage.getItem('pageMode')
    }
  }

  componentWillMount() {
    console.log(this.props.match)
  }

  componentWillUnmount() {

  }

  render() {
    let selection = this.props.match.params.series;
    let index = this.props.match.params.index;
    let chapter = cData.series[selection][index];
    return (
      <div className='reader-container'>
        <div className='reader'>
          <Page src={`${chapter.src}/img000001.jpg`} />
        </div>
      </div>
    );
  }
}

export default Reader;