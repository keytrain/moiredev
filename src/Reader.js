import React from 'react';
import './Reader.css';
import cData from './chapterData';
import Page from './Page';
// import Image from './Image';
import { Link } from 'react-router-dom';
import genLib from './generalLibrary';

// TODO:
// Chapter end detection
// Disqus
// Settings
// two bugs
// - backpage doesn't work when the image hasn't loaded yet, because it can't tell if it's a spread
// - if you're loading two pages at once, spread detection can't tell until the spread is finished downloading.

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
      rightShow: false,
      spread: false,
      goBack: false
    }
    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);
    this.handleLeftError = this.handleLeftError.bind(this);
    this.handleLeftLoaded = this.handleLeftLoaded.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.loadPages = this.loadPages.bind(this);
    this.buffer = this.buffer.bind(this);
  }

  componentWillMount() {
    // initial load
    this.loadPages(this.props.match.params.page);
    this.unlisten = this.props.history.listen((location, action) => {
      this.loadPages(location.pathname.split(/(.+)\//)[2]);
    });
  }

  componentWillUnmount() {
    // removes the listener on browser routing
    this.unlisten();
  }

  loadPages(page) {
    this.setState((prevState) => {
      prevState.rightPgCount = genLib.padZero(page);
      prevState.rightPgType = 'png';
      prevState.rightShow = false;
      prevState.leftPgCount = genLib.padZero(String(Number(page) + 1));
      prevState.leftPgType = 'png';
      prevState.leftShow = false;
      prevState.spread = false;
    })
  }

  buffer(size) {
    let chapterObj = cData.series[this.state.selection].ch[this.state.chapter];
    const buffer = new Image();
    const buffer2 = new Image();
    let originPg = this.state.leftPgCount;

    buffer.onload = function() {
      console.log('buffer image loaded')
    }
    let nextPg = genLib.padZero(String(Number(originPg) + 1));
    buffer.src=`${chapterObj.src}/img${nextPg}.${this.state.leftPgType}`;
    nextPg = genLib.padZero(String(Number(originPg) + 2));
    buffer2.src=`${chapterObj.src}/img${nextPg}.${'png'}`;
  }

  handleLeftLoaded() {
    this.setState({leftShow: true});
    this.buffer(1);
  }

  handleRightLoaded(imgObj) {
    let nextPg = Number(this.props.match.params.page)-1;
    // if not a spread, go back another page
    if (!imgObj.spread && this.state.goBack) {
      this.props.history.push({
        pathname: `/r/${this.state.selection}/${this.state.chapter}/${nextPg}`
      });
      this.setState({goBack:false});
    } else {
      this.setState({rightShow: true, spread: imgObj.spread});
    }
  }

  handleLeftError() {
    console.log('error')
    this.setState((prevState => {
      if (prevState.leftPgType === 'jpg') {
        prevState.leftPgType = 'jpeg';
      } else if (prevState.leftPgType === 'png') {
        prevState.leftPgType = 'jpg';
      }
    }));
  }

  handleRightError() {
    console.log('error')
    this.setState((prevState => {
      if (prevState.rightPgType === 'jpg') {
        prevState.rightPgType = 'jpeg';
      } else if (prevState.rightPgType === 'png') {
        prevState.rightPgType = 'jpg';
      }
    }));
  }

  handlePages(e) {
    // currentTarget grabs pages div
    // target grabs the respective Image component
    let pgWidth = e.currentTarget.offsetWidth;
    let midPoint = pgWidth / 2;
    let clickLoc = e.pageX;

    let currPg = this.props.match.params.page;
    let nextPg;
    if (clickLoc < midPoint) {
      nextPg = Number(currPg) + (this.state.spread ? 1 : 2);
      this.setState({goBack: false});
    }
    else if (clickLoc > midPoint) {
      nextPg = Number(currPg) - 1;
      this.setState({goBack: true});
    }
    if (nextPg > -1) {
      this.props.history.push({
        pathname: `/r/${this.state.selection}/${this.state.chapter}/${nextPg}`
      });
    }
  }

  render() {
    let chapterObj = cData.series[this.state.selection].ch[this.state.chapter];
    let currPg = this.props.match.params.page;

    return (
      <div className='reader-container'>
                

        <div className='reader'>
          <div className='controls'>
            <div className='ctrl-left'>
              <button>settings</button>
              <button>disqus</button>
            </div>
            <div className='ctrl-right'>
              <Link to={`/r/${this.state.selection}`}><button>X</button></Link>
            </div>
          </div>
          <div className='pages' onClick={this.handlePages}>

            {((!this.state.spread) || currPg === '0') &&
            <Page containerClass={'pgContainer'} imgClass={'leftPg'} 
            src={`${chapterObj.src}/img${this.state.leftPgCount}.${this.state.leftPgType}`} 
            loaded={this.handleLeftLoaded} 
            error={this.handleLeftError}
            show={this.state.leftShow} />
            }

            {currPg > '0' ?
            <Page containerClass={'pgContainer ' + (this.state.spread ?'spread':'')} imgClass={'rightPg'} 
              src={`${chapterObj.src}/img${this.state.rightPgCount}.${this.state.rightPgType}`} 
              loaded={this.handleRightLoaded} 
              error={this.handleRightError}
              show={this.state.rightShow} />
            :
            <div className='chapterEnds'>
              <small>YOU ARE READING</small>
              <h1>{this.state.selection}</h1>
              <br />
              <h3>Chapter {this.state.chapter}</h3>
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