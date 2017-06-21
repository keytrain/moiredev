import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './App.css';
import logo from './logoB.png';
import data from './seriesData';
import genLib from './generalLibrary';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      slist: {},
      sbox: {},
      sboxtext:{},
    }
    this.openSList = this.openSList.bind(this);
    this.closeSList = this.closeSList.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
  }

  openSList(e) {
    e.preventDefault();
    this.setState((prevState) => {
      // prevState.slist = {
      //   transform: (prevState.slist.transform === 'translateX(100%)' ? 'translateX(-100%)' : 'translateX(100%)')
      // }
      // prevState.mode = 'slist'; 
      // prevState.bg = {
      //   background: `no-repeat center url('${bg}')`,
      //   backgroundSize: 'cover',
      //   opacity: '0.3',
      //   transition: 'opacity 300ms 300ms'
      // }
      // prevState.sbox = {
      //   bottom: '5%',
      //   left: '5%',
      //   top:'8%',
      //   transition:
      //     'left 75ms 100ms ease-in-out,' + 
      //     'bottom 125ms 175ms ease-in-out,' +
      //     'top 125ms 175ms ease-in-out'
      // }
      // prevState.sboxtext = {
      //   opacity: '0',
      //   visibility: 'hidden',
      //   position:'absolute',
      //   transition: 'all 175ms 0ms'
      // }
      // prevState.slist = {
      //   opacity: '1',
      //   visibility: 'visible',
      //   transition: 'all 300ms 300ms'
      // }
    });
  }

  closeSList() {
    this.setState((prevState) => {
      // prevState.slist = {
      //   transform: (prevState.slist.transform === 'translateX(100%)' ? 'translateX(-100%)' : 'translateX(100%)')
      // }
      // prevState.mode = 'start'; 
      // prevState.bg = {
      //   background: `no-repeat center url('${bg}')`,
      //   backgroundSize: 'cover',
      //   opacity: '1',
      //   transition: 'opacity 300ms 0ms'
      // }
      // prevState.sbox = {
      //   bottom: '10%',
      //   left: '60%',
      //   top:'60%',
      //   transition:
      //     'left 75ms 225ms ease-in-out,' + 
      //     'bottom 125ms 100ms ease-in-out,' +
      //     'top 125ms 100ms ease-in-out'
      // }
      // prevState.sboxtext = {
      //   opacity: '1',
      //   visibility: 'visible',
      //   position: 'absolute',
      //   transition: 'all 175ms 225ms'
      // }
      // prevState.slist = {
      //   opacity: '0',
      //   visibility: 'hidden',
      //   transition: 'all 300ms 0ms'
      // }
    });
  }

  handleKey(e) {
    console.log(e);
    if (this.state.mode === 'slist') {
      if (e.key === 'Escape') {
        this.closeSList();
      }
    }
  }

  render() {
    return (
      <div>
        <nav>
          <div className='logo-container'>
            <img src={logo} className='logo' alt='logo' />
          </div>
        </nav>
        <div className='wrapper' style={this.state.sbox}>

          <div className='serieslist-container' style={this.state.slist}>
            <div className='serieslist'>
              {/*<div className='slist-row'>
                <div className='slist-col'>Title</div>
                <div className='slist-col'>Last Updated</div>
                <div className='slist-col'>Status</div>
              </div>*/}
              {data.list.sort((a, b) => {
                if (a.updated.getTime() < b.updated.getTime())
                  return 1;
                else if (a.updated.getTime() > b.updated.getTime())
                  return -1;
                else return 0;
              }).map((e, index) => (
                <div className='sitem' key={index}>
                  <img src={e.vol[0]} alt={e.title} />
                  <div className='sitem-title'>{e.title}</div>
                  <div className='sitem-date'>{e.completed === undefined ? 'Updated' : (e.completed ? 'Completed' : 'Dropped')} {genLib.howLongAgo(e.updated)}</div>
                  {/*<div>{e.updated.toLocaleString()}</div>*/}
                  {/*<div className='slist-row listbutton'>
                    <div className='slist-col'>{e.title}</div>
                    <div className='slist-col'>{e.updated.toLocaleDateString()}</div>
                    <div className='slist-col'>{e.completed === undefined ? e.current : (e.completed ? 'Finished' : 'Dropped')}</div>
                  </div>*/}
                  {/*<CSSTransitionGroup
                    transitionName='slistInfo'
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}>
                    <div className='slist-info'>
                      
                    </div>
                  </CSSTransitionGroup>*/}
                </div>
              )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
