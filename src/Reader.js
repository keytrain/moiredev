import React from 'react';
import { Link } from 'react-router-dom';
import './Reader.css';
import cData from './chapterData';
import Page from './Page';
// import Image from './Image';
import genLib from './generalLibrary';
import ReactDisqusComments from 'react-disqus-comments';

// TODO:
// remove the history part of going back 1 page
// optimize spread checking
// Disqus
// Settings

class Reader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      goBack: false,
      lastPg: 1000
    }

    this.selection = this.props.match.params.series;
    this.chapter = this.props.match.params.chapter;

    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);
    this.handleLeftError = this.handleLeftError.bind(this);
    this.handleLeftLoaded = this.handleLeftLoaded.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.handleSpread = this.handleSpread.bind(this);
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
    this.setState((prevState) => {
      prevState.rightPgCount = genLib.padZero(page);
      prevState.rightPgType = 'png';
      prevState.leftWidth = 0;
      prevState.rightShow = false;
      prevState.leftPgCount = genLib.padZero('' + (Number(page) + 1));
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
      this.buffer(4);
    }, 300)
  }

  buffer(size) {
    let chapterObj = cData.series[this.selection].ch[this.chapter];
    let originPg = this.state.leftPgCount;

    for (let i = 0; i < size; i++) {
      let pageNum = Number(originPg) + i + 1;
      const bufferImg = new Image();
      let nextPg = genLib.padZero('' + pageNum);
      let bufferImgType = 'png';
      bufferImg.onerror = function() {
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

  handleSpread(imgObj) {
    let nextPg = Number(this.props.match.params.page)-1;
    // if not a spread, go back another page
    if (!imgObj.spread && this.state.goBack) {
      this.props.history.push({
        pathname: `/r/${this.selection}/${this.chapter}/${nextPg}`
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
        if (pageType === 'leftPgType') {
          prevState.lastPg = Number(prevState.leftPgCount);
        }
      }
    }));
  }

  handleLeftLoaded() {
    console.log('left')
  }

  handleRightLoaded() {
    console.log('right')
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
    window.scrollTo(0,0);

    let currPg = this.props.match.params.page;
    let nextPg = undefined;
    if (clickLoc < midPoint) {
      nextPg = Number(currPg) + (this.state.spread ? 1 : 2);
      this.setState({goBack: false});
    }
    else if (clickLoc > midPoint) {
      nextPg = Number(currPg) - 1;
      this.setState({goBack: true});
    }
    if (nextPg > -1 && nextPg < this.state.lastPg) {
      this.props.history.push({
        pathname: `/r/${this.selection}/${this.chapter}/${nextPg}`
      });
    }
  }

  render() {
    let chapterObj = cData.series[this.selection].ch[this.chapter];
    let currPg = this.props.match.params.page;
    console.log(this.props.location)
    return (
      <div className='reader-container'>
        <div className='reader'>

          <div className='controls'>
           <div className='ctrl-left'>
             <button>settings</button>
             <button>disqus</button>
           </div>
           <div className='ctrl-right'>
             <Link to={`/r/${this.selection}`}><button>X</button></Link>
           </div>
           </div>

          <div className='pages' onClick={this.handlePages}>

            {(!this.state.spread && (Number(currPg) + 1) !== this.state.lastPg) &&
            <Page containerClass={'pgContainer'} imgClass={'leftPg'} 
            src={`${chapterObj.src}/img${this.state.leftPgCount}.${this.state.leftPgType}`} 
            loaded={this.handleLeftLoaded} 
            error={this.handleLeftError}
            show={this.state.leftShow}
            imgWidth={this.state.leftWidth}
            spread={this.handleSpread} />
            }
            {((Number(currPg) + 1) === this.state.lastPg) &&
            
            <div className='chapterEnds'>
              <h1>Thanks for reading!</h1>
              <small>That was the last page.</small>
              <p>Read the next chapter? or Read the comments?</p>
            </div>
            }

            {currPg > '0' ?
            <Page containerClass={'pgContainer ' + (this.state.spread ?'spread':'')} imgClass={'rightPg'} 
              src={`${chapterObj.src}/img${this.state.rightPgCount}.${this.state.rightPgType}`} 
              loaded={this.handleRightLoaded} 
              error={this.handleRightError}
              show={this.state.rightShow}
              imgWidth={this.state.rightWidth}
              spread={this.handleSpread} />
            :
            <div className='chapterEnds'>
              <small>YOU ARE READING</small>
              <h1>{this.selection}</h1>
              <br />
              <h3>Chapter {this.chapter}</h3>
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
          <ReactDisqusComments
            shortname="maigo"
            identifier="maigo.us"
            url={"http://maigo.us/#" + this.props.location.pathname} />
        </div>

      </div>
    );
  }
}

export default Reader;