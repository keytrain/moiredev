import React from 'react';
import './Reader.css';
import cData from './chapterData';
import Page from './Page';
// import Image from './Image';
import genLib from './generalLibrary';

class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selection : this.props.match.params.series,
      chapter : this.props.match.params.chapter,
      pageMode: localStorage.getItem('pageMode'),
      leftPgCount: '000001',
      leftPgType: 'png',
      leftShow: false,
      rightPgCount: '000000',
      rightPgType: 'png',
      rightShow: false
    }
    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);
    this.handleLeftError = this.handleLeftError.bind(this);
    this.handleLeftLoaded = this.handleLeftLoaded.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.loadPages = this.loadPages.bind(this);
  }

  componentWillMount() {
    // initial load
    this.loadPages(this.props.match.params.page);
    this.unlisten = this.props.history.listen((location, action) => {
      this.loadPages(''+location.state.page);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleLeftLoaded() {
    console.log('loaded')
    this.setState({leftShow: true});
  }

  handleLeftError() {
    console.log('error')
    this.setState({leftPgType: 'jpg'});
  }

  handleRightLoaded() {
    console.log('loaded')
    this.setState({rightShow: true});
  }

  handleRightError() {
    console.log('error')
    this.setState({rightPgType: 'jpg'});
  }

  loadPages(page) {
    this.setState((prevState) => {
      prevState.rightPgCount = genLib.padZero(page);
      prevState.rightPgType = 'png';
      prevState.rightShow = false;
      prevState.leftPgCount = genLib.padZero('' + (parseInt(page)+1));
      prevState.leftPgType = 'png';
      prevState.leftShow = false;
    })
  }

  handlePages(e) {
    // currentTarget grabs pages div
    // target grabs the respective Image component
    let pgWidth = e.currentTarget.offsetWidth;
    let midPoint = pgWidth / 2;
    let clickLoc = e.pageX;

    let currPg = this.props.match.params.page;
    console.log(currPg);
    let nextPg;

    if (clickLoc < midPoint) {
      nextPg = parseInt(currPg, 10) + 2;
    }
    else if (clickLoc > midPoint) {
      nextPg = parseInt(currPg, 10) - 2;
    }
    if (nextPg > -1) {
      this.props.history.push({
        pathname: `/r/${this.state.selection}/${this.state.chapter}/${nextPg}`,
        state : {
          page: nextPg
        }
      });
      // this.setState((prevState) => {
      //   prevState.page = nextPg;
      //   prevState.rightPgCount = genLib.padZero('' + nextPg);
      //   prevState.rightPgType = 'png';
      //   prevState.rightShow = false;
      //   prevState.leftPgCount = genLib.padZero('' + (nextPg+1));
      //   prevState.leftPgType = 'png';
      //   prevState.leftShow = false;
      // })
    }
  }

  render() {
    let chapterObj = cData.series[this.state.selection].ch[this.state.chapter];

    return (
      <div className='reader-container'>
        <div className='reader'>

          <div className='pages' onClick={this.handlePages}>

            <Page containerClass={'pgContainer'} imgClass={'leftPg'} 
            src={`${chapterObj.src}/img${this.state.leftPgCount}.${this.state.leftPgType}`} 
            loaded={this.handleLeftLoaded} 
            error={this.handleLeftError}
            show={this.state.leftShow} />
            
            {this.props.match.params.page > 0 ?
            <Page containerClass={'pgContainer'} imgClass={'rightPg'} 
              src={`${chapterObj.src}/img${this.state.rightPgCount}.${this.state.rightPgType}`} 
              loaded={this.handleRightLoaded} 
              error={this.handleRightError}
              show={this.state.rightShow} />
            :
            <div className='chapterEnds'>
              <small>YOU ARE READING</small>
              <h1>{this.state.selection}</h1>
              <h3>CHAPTER {this.state.chapter}</h3>
              <br />
              <br />
              <small>TRANSLATED BY</small>
              <h4>{chapterObj.trans}</h4>
              <br />
              <small>LETTERED BY</small>
              <h4>{chapterObj.let}</h4>
              <br />
              {chapterObj.red &&
              <div>
              <small>REDRAWN BY</small>
              <h4>{chapterObj.red}</h4>
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