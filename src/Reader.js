import React from 'react';
import { Link } from 'react-router-dom';
import './Reader.css';
import Page from './Page';
// import Image from './Image';
import genLib from './lib/generalLibrary';
import ReactDisqusComments from 'react-disqus-comments';
import Transition from 'react-transition-group/Transition';
import MdClose from 'react-icons/lib/md/close';
import MdChatBubbleOutline from 'react-icons/lib/md/chat-bubble-outline';
import MdChat from 'react-icons/lib/md/chat';
import MdInfoOutline from 'react-icons/lib/md/info-outline';
import MdInfo from 'react-icons/lib/md/info';
import MdSettings from 'react-icons/lib/md/settings';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';

// TODO:
// check firefox, safari
// switch chapter inside reader
// title of the page should change
// finish adding chapters/volume covers
// announcements
// convert modal to resize upon window change
// a visual indicator appears on mouseover on a left or right page
// being able to look through all volume covers
// give random series
// remove the history part of going back 1 page
// optimize spread checking
// supporting other types of page names, e.g. '00.png'
// load all pages at once/vertical scroll webcomic style/load as you scroll
// svg the logo

class Reader extends React.Component {
  constructor(props) {
    super(props)

    this.selection = this.props.match.params.series;
    this.chapter = this.props.match.params.chapter;
    this.cData = window.chapterData;
    this.MOBILE = 425;
    this.TABLET = 1024;
    this.DESKTOP = 1440;

    this.state = {
      pageMode: localStorage.getItem('pageMode') ? localStorage.getItem('pageMode') : 'Double Page',
      leftPgCount: '001',
      leftPgType: 'png',
      leftShow: false,
      leftWidth: 0,
      rightPgCount: '000',
      rightPgType: 'png',
      rightWidth: 0,
      rightShow: false,
      spread: false,
      goBack: false,
      lastPg: 1000,
      showDisqus: false,
      showInfo: false,
      firstLoad: false,
      pageStyle: {
        marginLeft:'0',
        transition:'150ms cubic-bezier(0.4, 0.0, 0.6, 1)'
      },
      singlePgMode: (localStorage.getItem('pageMode') === 'Single Page' || document.documentElement.clientWidth <= this.MOBILE) ? true : false,
      windowWidth: document.documentElement.clientWidth
    }

    this.handleRightError = this.handleRightError.bind(this);
    this.handleRightLoaded = this.handleRightLoaded.bind(this);
    this.handleLeftError = this.handleLeftError.bind(this);
    this.handleLeftLoaded = this.handleLeftLoaded.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.handleSpread = this.handleSpread.bind(this);
    this.loadPages = this.loadPages.bind(this);
    this.buffer = this.buffer.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.handleDisqus = this.handleDisqus.bind(this);
    this.handleInfo = this.handleInfo.bind(this);
    this.handlePagesKey = this.handlePagesKey.bind(this);
    this.handlePageMode = this.handlePageMode.bind(this);
    this.checkAltImageTypes = this.checkAltImageTypes.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.resetChapterToStart = this.resetChapterToStart.bind(this);
  }

  componentDidMount() {
    // initial load
    // fixes the scroll on iOS... dumb
    document.documentElement.style.overflow = 'visible';
    document.body.style.overflow = 'visible';

    if (this.state.singlePgMode && this.props.match.params.page === '0') {
      this.resetChapterToStart();
    } else {
      this.loadPages(this.props.match.params.page);
    }
    this.unlisten = this.props.history.listen((location, action) => {
      this.loadPages(location.pathname.split(/(.+)\//)[2]);
    });
    document.addEventListener('keydown', this.handlePagesKey);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePagesKey);
    window.removeEventListener('resize', this.handleResize);
    // removes the listener on browser routing
    this.unlisten();
  }

  resetChapterToStart() {
    this.props.history.push(`/r/${this.selection}/${this.chapter}/1`);
    this.loadPages('1');
  }

  handleResize() {
    this.setState((prevState) => {
      let currWidth = document.documentElement.clientWidth;
      prevState.windowWidth = currWidth;
      if (currWidth > this.DESKTOP && prevState.showDisqus) {
        prevState.pageStyle.marginLeft = '400px';
        prevState.pageStyle.transition = '150ms cubic-bezier(0.4, 0.0, 0.6, 1)';
      }
      if (currWidth <= this.DESKTOP) {
        prevState.pageStyle.marginLeft = '0';
      }
      prevState.singlePgMode = (currWidth <= this.MOBILE) ? true : false;
      if (prevState.singlePgMode && this.props.match.params.page === '0') {
        this.resetChapterToStart();
      }
    });
  }

  handlePagesKey(e) {
    // console.log(e.key);
    switch (e.key) {
      case 'ArrowLeft':
        this.nextPage();
        break;
      case 'ArrowRight':
        this.prevPage();
        break;
      case 'Escape':
        this.props.history.push(`/r/${this.selection}`);
        break;
      case 'c':
        this.handleDisqus();        
        break;
      default:
        break;
    }
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
    });
    setTimeout(()=> {
      // document.documentElement.style.overflow = 'scroll';
      // document.body.style.overflow = 'scroll';
      // document.documentElement.style.overflow = 'visible';
      // document.body.style.overflow = 'visible';
      this.setState((prevState) => {
        prevState.rightShow = true;
        prevState.leftShow = true;
        if (!prevState.goBack) {
          this.buffer(4);
        }
      })
    }, 400);
  }

  buffer(size) {
    let chapterObj = this.cData.series[this.selection][this.chapter];
    let originPg = this.state.leftPgCount;

    for (let i = 0; i < size; i++) {
      let pageNum = Number(originPg) + i + 1;
      // if (pageNum < this.state.lastPg) {
        const bufferImg = new Image();
        let nextPg = genLib.padZero('' + pageNum);
        let bufferImgType = 'png';
        bufferImg.onerror = function() {
          if (bufferImgType === 'jpg') {
            bufferImgType = 'jpeg';
            bufferImg.src=`${chapterObj.src}/${nextPg}.${bufferImgType}`;
          } else if (bufferImgType === 'png') {
            bufferImgType = 'jpg';
            bufferImg.src=`${chapterObj.src}/${nextPg}.${bufferImgType}`;
          }
        }
        bufferImg.src=`${chapterObj.src}/${nextPg}.${bufferImgType}`;
      }    
    // }
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

  checkAltImageTypes(pageType) {
    this.setState((prevState => {
      if (prevState[pageType] === 'jpg') {
        prevState[pageType] = 'jpeg';
      } else if (prevState[pageType] === 'png') {
        prevState[pageType] = 'jpg';
      } else {
        if (pageType === (this.state.singlePgMode ? 'rightPgType' : 'leftPgType')) {
          prevState.lastPg = Number(prevState.leftPgCount) - (this.state.singlePgMode ? 1 : 0);
        }        
      }
    }));
  }

  handleLeftLoaded() {
    // console.log('left')
  }

  handleRightLoaded() {
    // console.log('right')
    document.addEventListener('keydown', this.handlePagesKey);
  }

  handleLeftError() {
    // console.log('error')
    this.checkAltImageTypes('leftPgType');
  }

  handleRightError() {
    // console.log('error')
    this.checkAltImageTypes('rightPgType');
  }

  nextPage() {
    let currPg = this.props.match.params.page;
    let nextPg = Number(currPg) + (this.state.singlePgMode ? 1 : (this.state.spread ? 1 : 2));
    if (nextPg > -1 && nextPg < this.state.lastPg) {  
      document.removeEventListener('keydown', this.handlePagesKey);
      this.setState({goBack: false});
      this.props.history.push({
        pathname: `/r/${this.selection}/${this.chapter}/${nextPg}`
      });
    }
  }
  
  prevPage() {
    let currPg = this.props.match.params.page;
    let nextPg = Number(currPg) - 1;

    if (nextPg > (this.state.singlePgMode ? 0 : -1) && nextPg < this.state.lastPg) {  
      document.removeEventListener('keydown', this.handlePagesKey);
      this.setState({goBack: true});
      this.props.history.push({
        pathname: `/r/${this.selection}/${this.chapter}/${nextPg}`
      });
    }
  }

  // activated when clicking on a page
  handlePages(e) {
    // e.persist();
    // currentTarget grabs pages div
    // target grabs the respective Image component

    if (e.target.className) {
      if (!this.state.spread && !this.state.singlePgMode) {
        let pgClicked = e.target.className;
        if (pgClicked === 'leftPg') {
          this.nextPage();
        } else if (pgClicked === 'rightPg') {
          this.prevPage();
        }
      } else {
        let midPoint = e.target.width/2;
        let clickLoc = e.nativeEvent.offsetX;

        if (clickLoc < midPoint) {
          this.nextPage();
        }
        else if (clickLoc > midPoint) {
          this.prevPage();
        }
      }
    }
  }

  handleDisqus() {
    this.setState((prevState) => {
      prevState.firstLoad = true;
      prevState.showDisqus = (prevState.showDisqus === false ? true : false);
      if (prevState.windowWidth <= this.DESKTOP)
        prevState.pageStyle = {marginLeft: '0'};
      else {
        prevState.pageStyle = {
          marginLeft: (prevState.pageStyle.marginLeft === '400px' ? '0' : '400px'),
          transition: '150ms cubic-bezier(0.4, 0.0, 0.6, 1)'
        }
      }
    });
  }

  handleInfo() {
    this.setState((prevState) => {
      prevState.showInfo = (prevState.showInfo === false ? true : false);
    });
  }

  handlePageMode(e) {
    let value = e.currentTarget.attributes.value.value;

    this.setState((prevState) => {
      localStorage.pageMode = value;
      prevState.pageMode = value;
      if (value === 'Single Page') {
        prevState.singlePgMode = true;
        if (this.props.match.params.page === '0') {
          this.resetChapterToStart();
        }
      } else {
        prevState.singlePgMode = false;
      }
    });
  }

  render() {
    // window.scrollTo(0,0);
    let chapterObj = this.cData.series[this.selection][this.chapter];
    let currPg = this.props.match.params.page;

    const duration = 150;
    const defaultStyle = {
      transition: `${duration}ms cubic-bezier(0.4, 0.0, 0.6, 1)`,
    }
    let transitionStyles = {
      entering: {
        visibility:'visible',
        transform: 'translateX(0%)',
      },
      entered: {
        visibility:'visible',
        transform: 'translateX(0%)',
      },
      exiting: {
        transform: 'translateX(-100%)',
      },
      exited: {
        transform: 'translateX(-100%)',
      }
    }

    let actionIconSize = this.state.windowWidth > this.MOBILE ? 24 : 18;

    return (
      <div className='reader-container' tabIndex='0'>
        <div className='reader'>

          <div className='controls'>
            <div className='ctrl-left'>
              {this.state.windowWidth > this.TABLET &&
              <div>
                {this.state.showDisqus ?
                <MdChat className='action-icon' onClick={this.handleDisqus} size={actionIconSize} />
                :
                <MdChatBubbleOutline className='action-icon' onClick={this.handleDisqus} size={actionIconSize} />
                }
              </div>
              }
            </div>
            <div className='ctrl-center'>
              <div className='ctrl-title'><strong>{this.selection}</strong> - {this.chapter}</div>
            </div>
            <div className='ctrl-right'>
              {this.state.showInfo ?
              <MdInfo className='action-icon' onClick={this.handleInfo} size={actionIconSize} />
              :
              <MdInfoOutline className='action-icon' onClick={this.handleInfo} size={actionIconSize} />
              }
              
              <Dropdown attach={<MdSettings className='action-icon' size={actionIconSize} />}>
                <DropdownItem name={'pageMode'} icon={''} selection={this.state.pageMode} text={'Single Page'} handle={this.handlePageMode} />
                <DropdownItem name={'pageMode'} icon={''} selection={this.state.pageMode} text={'Double Page'} handle={this.handlePageMode} />
              </Dropdown>
              
              <Link to={`/r/${this.selection}`}><MdClose className='action-icon' size={actionIconSize} /></Link>
            </div>
            {this.state.showInfo &&
            <div className='info'>
              <div className='credit'>
              <small>TRANSLATED BY</small>
              <h4>{chapterObj.trans}</h4>
              </div>
              <div className='credit'>
              <small>LETTERED BY</small>
              <h4>{chapterObj.let}</h4>
              </div>
              {chapterObj.red &&
              <div className='credit'>
              <small>REDRAWN BY</small>
              <h4>{chapterObj.red}</h4>
              </div>
              }
            </div>
            }
          </div>

          {(this.state.firstLoad && this.state.windowWidth > this.TABLET) &&
          <Transition in={this.state.showDisqus} timeout={duration}>
            {(state) => (
            <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }} className='disqus-container'>
              <div className='disqus'>
                <ReactDisqusComments shortname='maigo4'
                  identifier={`${this.selection}_${this.chapter}`}
                  url={`http://maigo.us/#/r/${this.selection}/${this.chapter}`}
                  title={`${this.selection} - ${this.chapter}`} />
              </div>
            </div>
            )}
          </Transition>
          }

          <div className='pages-container' style={this.state.pageStyle}>
            <div className='pages'>

              {(!this.state.spread && !this.state.singlePgMode && (Number(currPg) + 1) !== this.state.lastPg) &&
              <Page containerClass={'pgContainer leftPgCont'} imgClass={'leftPg'} 
              src={`${chapterObj.src}/${this.state.leftPgCount}.${this.state.leftPgType}`} 
              loaded={this.handleLeftLoaded} 
              error={this.handleLeftError}
              show={this.state.leftShow}
              imgWidth={this.state.leftWidth}
              spread={this.handleSpread}
              click={this.handlePages} />
              }
              {((Number(currPg) + 1) === this.state.lastPg) &&
              
              <div className='chapterEnds'>
                {/* <h1>Thanks for reading!</h1> */}
                {/* <small>That was the last page.</small> */}
              </div>
              }

              {currPg > '0' ?
              <Page containerClass={'pgContainer ' + (this.state.singlePgMode ? '':'rightPgCont ') + (this.state.spread ?'spread':'')} imgClass={'rightPg'} 
                src={`${chapterObj.src}/${this.state.rightPgCount}.${this.state.rightPgType}`} 
                loaded={this.handleRightLoaded} 
                error={this.handleRightError}
                show={this.state.rightShow}
                imgWidth={this.state.rightWidth}
                spread={this.handleSpread}
                click={this.handlePages}
                singlePgMode={this.state.singlePgMode} />
              :
              <div className='chapterEnds'>
              {/* <h1>Enjoy!</h1> */}
              </div>
              }
            </div>
          </div>
        </div>

        {this.state.windowWidth <= this.TABLET &&
          <div>
            {!this.state.showDisqus &&
            <div className='disqus-container' onClick={this.handleDisqus}>
              <button>Show Comments</button>
            </div>
            }
            {this.state.showDisqus &&
            <div className='disqus-container'>
              <div className='disqus'>
              <ReactDisqusComments shortname='maigo4'
                identifier={`${this.selection}_${this.chapter}`}
                url={`http://maigo.us/#/r/${this.selection}/${this.chapter}`}
                title={`${this.selection} - ${this.chapter}`} />
              </div>
            </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default Reader;