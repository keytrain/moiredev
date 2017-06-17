import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import bg from './bg.png';
import data from './seriesData'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      bg: {
        background: `no-repeat center url('${bg}')`,
        backgroundSize: 'cover',
      },
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
      prevState.mode = 'slist'; 
      prevState.bg = {
        background: `no-repeat center url('${bg}')`,
        backgroundSize: 'cover',
        opacity: '0.3'
      }
      prevState.slist = {
        opacity: '1',
        visibility: 'visible',
      }
      prevState.sbox = {
        bottom: '5%',
        left: '5%',
        top:'8%',
      }
      prevState.sboxtext = {
        opacity: '0',
        visibility: 'hidden',
        position:'absolute',
      }
    });
  }

  closeSList() {
    this.setState((prevState) => {
      // prevState.slist = {
      //   transform: (prevState.slist.transform === 'translateX(100%)' ? 'translateX(-100%)' : 'translateX(100%)')
      // }
      prevState.mode = 'start'; 
      prevState.bg = {
        background: `no-repeat center url('${bg}')`,
        backgroundSize: 'cover',
        opacity: '1'
      }
      prevState.slist = {
        opacity: '0',
        visibility: 'hidden',
      }
      prevState.sbox = {
        bottom: '10%',
        left: '60%',
        top:'60%',
      }
      prevState.sboxtext = {
        opacity: '1',
        visibility: 'visible',
        position: 'static',
      }
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
    const bg = this.state.bg;
    const slist = this.state.slist;
    const sbox = this.state.sbox;
    const sboxtext = this.state.sboxtext;

    return (
      <div>
        <nav>
          <div className='logo-container'>
            <img src={logo} className='logo' alt='logo' />
          </div>
        </nav>
        <div className='bg' style={bg}>
        </div>
        <div className='wrapper' style={sbox}>

          <div className='text-container'>
            <div className='text' style={sboxtext}>
              <h1>Spotted Flower</h1>
              <h3>SHIMOKU KIO</h3>
              <p>A story about a pregnant woman and her otaku husband.</p>
              <a href=''>READ</a> - DOWNLOAD<br /><br />
              SHOW ME ANOTHER<br />
              <button onClick={this.openSList}>SEE ENTIRE CATALOG</button>
            </div>
          </div>

          <div className='serieslist-container' style={slist}>
            <div className='serieslist'>
              {data.list.sort((a, b) => {
                if (a.updated.getTime() < b.updated.getTime())
                  return 1;
                else if (a.updated.getTime() > b.updated.getTime())
                  return -1;
                else return 0;
              }).map((e, index) => (
                <div key={index} className='series listbutton'>
                  <div>{e.title}</div>
                  <small>Last updated {e.updated.toLocaleDateString()}</small>
                  <div>{e.completed === undefined ? e.current : (e.completed ? 'Finished' : 'Dropped')}</div>
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
