import React, { Component } from 'react';
// import { CSSTransitionGroup } from 'react-transition-group';
import './App.css';
import logo from './logoB.png';
import data from './releaseData';
import sData from './seriesData';
import SeriesList from './SeriesList';
import bg from './bg.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      data: data.list,
      showModal: {
        position: 'fixed',
        visibility: 'hidden',
      },
      modalSelection: '',
      bg : {
        background: `no-repeat url('${bg}')`,
        backgroundPosition: '100% 20%',
        opacity: '1',
      }
    }
    this.openSList = this.openSList.bind(this);
    this.closeSList = this.closeSList.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSeriesItem = this.handleSeriesItem.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKey);
    this.setState((prevState) => {
      prevState.data = prevState.data.sort((a,b) => {
         if (a.updated.getTime() < b.updated.getTime())
          return 1;
        else if (a.updated.getTime() > b.updated.getTime())
          return -1;
        else return 0;
      })
    })
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
    if (this.state.mode === 'modal') {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    }
  }

  handleSeriesItem(e) {
    let title = e.currentTarget.attributes['data-title'].value;
    this.setState((prevState) => {
      prevState.modalSelection = title;
      prevState.mode = 'modal';
      prevState.showModal = {
        position: 'fixed',
        bottom:0,
        top:0,
        left:0,
        right:0,
        visibility: 'visible',
        zIndex:'1'
      }
    })
  }

  closeModal() {
    this.setState((prevState) => {
      prevState.mode = 'grid';
      prevState.showModal = {
        position: 'fixed',
        visibility: 'hidden',
      }
    })
  }

  render() {
    return (
      <div>        
        {this.state.modalSelection && 
        <div style={this.state.showModal}>
          <div className='modal'>
            <img src='' />
            <div className='modal-text'>
              <h2>{this.state.modalSelection}</h2>
              <p>{sData.series[this.state.modalSelection].synopsis}</p>
            </div>
          </div>
          <div className='modalBG' onClick={this.closeModal}></div>
        </div>
        }
        <nav>
          <div className='nav-container'>
            <div className='logo-container'>
              <img src={logo} className='logo' alt='logo' />
            </div>
            <div className='tagline'>
              Japanese comics for an English audience
            </div>
          </div>
        </nav>
        <div className='wrapper'>
          <div className='serieslist-container'>
            <div className='serieslist'>
              <SeriesList title='ONGOING'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  if (e.completed === undefined)
                    return true;
                  else return false;
                })} />
              <SeriesList title='COMPLETE'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  return (e.completed !== undefined && e.completed);
                })} />
              <SeriesList title='DROPPED'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  return (e.completed !== undefined && !e.completed);
                })} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
