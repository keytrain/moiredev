import React from 'react';
import { Link } from 'react-router-dom';
import './Reader.css';
import cData from './chapterData';
import Page from './Page';
// import Image from './Image';
import genLib from './generalLibrary';

// TODO:
// optimize spread checking
  // try using loadstart
// make buffer function scalable
  // needs error support
// Chapter end detection
// chapter end page
// Disqus
// Settings

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
      leftWidth: 0,
      rightPgCount: '000000',
      rightPgType: 'png',
      rightWidth: 0,
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
    this.checkAndLoadAltImageTypes = this.checkAndLoadAltImageTypes.bind(this);
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
    window.scrollTo(0,0);
    this.setState((prevState) => {
      prevState.rightPgCount = genLib.padZero(page);
      prevState.rightPgType = 'png';
      prevState.leftWidth = 0;
      prevState.rightShow = false;
      prevState.leftPgCount = genLib.padZero('' + (parseInt(page, 10) + 1));
      prevState.leftPgType = 'png';
      prevState.rightWidth = 0;
      prevState.leftShow = false;
      prevState.spread = false;
    })
    setTimeout(()=> {
      this.setState((prevState) => {
        prevState.rightShow = true;
        prevState.leftShow = true;
      })
    }, 300)
  }

  buffer(size) {
    let chapterObj = cData.series[this.state.selection].ch[this.state.chapter];
    let originPg = this.state.leftPgCount;

    for (let i=0; i < size; i++) {
      const bufferImg = new Image();
      let nextPg = genLib.padZero('' + (parseInt(originPg, 10) + i + 1));
      let bufferImgType = 'png';
      bufferImg.error = function() {
        if (bufferImgType === 'jpg') {
          bufferImgType = 'jpeg';
          bufferImg.src=`${chapterObj.src}/img${nextPg}.${bufferImgType}`;
        } else if (bufferImgType === 'png') {
          bufferImgType = 'jpg';
          bufferImg.src=`${chapterObj.src}/img${nextPg}.${bufferImgType}`;
        }
      }
      bufferImg.src=`${chapterObj.src}/img${nextPg}.${bufferImgType}`;
    }
  }

  handleLeftLoaded() {
    console.log('left')
    this.buffer(4);
  }

  handleRightLoaded(imgObj) {
    console.log('right')
    let nextPg = parseInt(this.props.match.params.page,10)-1;
    // if not a spread, go back another page
    if (!imgObj.spread && this.state.goBack) {
      this.props.history.push({
        pathname: `/r/${this.state.selection}/${this.state.chapter}/${nextPg}`
      });
      this.setState({goBack:false, rightWidth: imgObj.width});
    } else {
      this.setState({spread: imgObj.spread, rightWidth: imgObj.width});
    }
  }

  checkAndLoadAltImageTypes(pageType) {
    this.setState((prevState => {
      if (prevState[pageType] === 'jpg') {
        prevState[pageType] = 'jpeg';
      } else if (prevState[pageType] === 'png') {
        prevState[pageType] = 'jpg';
      } else {
        // check if the next page is also 
      }
    }));
  }

  handleLeftError() {
    console.log('error')
    this.checkAndLoadAltImageTypes('leftPgType');
  }

  handleRightError() {
    console.log('error')
    this.checkAndLoadAltImageTypes('rightPgType');
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
      nextPg = parseInt(currPg, 10) + (this.state.spread ? 1 : 2);
      this.setState({goBack: false});
    }
    else if (clickLoc > midPoint) {
      nextPg = parseInt(currPg, 10) - 1;
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
            show={this.state.leftShow}
            imgWidth={this.state.leftWidth} />
            }

            {currPg > '0' ?
            <Page containerClass={'pgContainer ' + (this.state.spread ?'spread':'')} imgClass={'rightPg'} 
              src={`${chapterObj.src}/img${this.state.rightPgCount}.${this.state.rightPgType}`} 
              loaded={this.handleRightLoaded} 
              error={this.handleRightError}
              show={this.state.rightShow}
              imgWidth={this.state.rightWidth} />
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