import React from 'react';
import './Reader.css';
import cData from './chapterData';
// import Page from './Page';
import Image from './Image';
import genLib from './generalLibrary';

class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageMode: localStorage.getItem('pageMode'),
      leftPgCount: '000001',
      leftPgType: 'png',
      rightPgCount: '000000',
      rightPgType: 'png',
    }
    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);    this.handleLeftError = this.handleLeftError.bind(this);
    this.handleLeftLoaded = this.handleLeftLoaded.bind(this);
    this.handlePages = this.handlePages.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.match)
  }

  componentWillUnmount() {

  }

  handleLeftLoaded() {
    console.log('loaded')
  }

  handleLeftError() {
    console.log('error')
    this.setState({leftPgType: 'jpg'});
  }

  handleRightLoaded() {
    console.log('loaded')
  }

  handleRightError() {
    console.log('error')
    this.setState({rightPgType: 'jpg'});
  }

  handlePages(e) {
    // currentTarget grabs pages div
    // target grabs the respective Image component
    let pgWidth = e.currentTarget.offsetWidth;
    let midPoint = pgWidth / 2;
    let clickLoc = e.pageX;

    if (clickLoc < midPoint) {
      console.log('clicked left page')
    }
    else if (clickLoc > midPoint) {
      console.log('clicked right page')
    }
  }

  render() {
    let selection = this.props.match.params.series;
    let chapter = this.props.match.params.chapter;
    let page = this.props.match.params.page;
    let chapterObj = cData.series[selection].ch[chapter];

    // console.log(genLib.padZero('1125'));

    return (
      <div className='reader-container'>
        <div className='reader'>

          <div className='pages' onClick={this.handlePages}>

            <Image containerClass={'pgContainer'} imgClass={'leftPg'} 
            src={`${chapterObj.src}/img${this.state.leftPgCount}.${this.state.leftPgType}`} 
            loaded={this.handleLeftLoaded} 
            error={this.handleLeftError} />
            
            {page > 0 ?
            <Image containerClass={'pgContainer'} imgClass={'rightPg'} 
              src={`${chapterObj.src}/img${this.state.rightPgCount}.${this.state.rightPgType}`} 
              loaded={this.handleRightLoaded} 
              error={this.handleRightError} />
            :
            <div className='chapterEnds'>
              <small>YOU ARE READING</small>
              <h1>{selection}</h1>
              <h3>CHAPTER {chapter}</h3>
              <br />
              <br />
              <small>TRANSLATED BY</small>
              <h4>{chapterObj.trans}</h4>
              <br />
              <small>LETTERED BY</small>
              <h4>{chapterObj.let}</h4>
              <br />
              {chapterObj.edit &&
              <div>
              <small>REDRAWN BY</small>
              <h4>{chapterObj.edit}</h4>
              </div>
              }
            </div>
            }
          </div>

        </div>
      </div>
    );
  }
}

export default Reader;