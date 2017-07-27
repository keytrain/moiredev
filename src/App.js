import React, { Component } from 'react';
import './App.css';
import logo from './logoB.png';
import { Route } from 'react-router-dom';
import data from './releaseData';
import SeriesList from './SeriesList';
import SeriesModal from './SeriesModal';
import bg from './bg.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      data: data.list,
      filter: 'Current',
      showModal: {
        position: 'fixed',
        visibility: 'hidden',
      },
      noscroll: {
        height:'100%',
        overflowY:'auto'
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
    this.handleFilter = this.handleFilter.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  componentWillMount() {
    // document.addEventListener('keydown', this.handleKey);
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
    // document.removeEventListener('keydown', this.handleKey);
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
    // if (e.key === 'Escape') {
    //   console.log(this.props.history)
    //   // this.props.history.push('/');
    // }
  }

  handleFilter(e) {
    e.preventDefault();
    let value = e.currentTarget.attributes.value.value;
    this.setState({filter: value});
  }

  render() {
    return (
      <div>
        <Route path='/r/:series' component={SeriesModal} />
        <nav>
          <div className='nav-container'>
            <div className='logo-container'>
              <img src={logo} className='logo' alt='logo' />
            </div>
            <h4 className='tagline'>
              Manga we liked, so we translated.
            </h4>
          </div>
        </nav>
        <div className='wrapper'>
          <div className='serieslist-container'>
            <div className='serieslist'>
              {/*<div className='filter-container'>
                <button className={'filter ' + (this.state.filter === 'Current' ? 'filter-active':'')} value='Current' onClick={this.handleFilter}>Current</button> 
                <button className={'filter ' + (this.state.filter === 'Complete' ? 'filter-active':'')} value='Complete' onClick={this.handleFilter}>Complete</button> 
                <button className={'filter ' + (this.state.filter === 'Dropped' ? 'filter-active':'')} value='Dropped' onClick={this.handleFilter}>Dropped</button> 
                <button className={'filter ' + (this.state.filter === 'All' ? 'filter-active':'')} value='All' onClick={this.handleFilter}>All</button>
                |
                <button className={'filter ' + (this.state.filter === 'Current' ? 'filter-active':'')} value='Current' onClick={this.handleFilter}>Date</button> 
                <button className={'filter ' + (this.state.filter === 'Complete' ? 'filter-active':'')} value='Complete' onClick={this.handleFilter}>Likes</button> 
              </div>*/}
              {/* <SeriesList title='Current Series'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                    return true;
                })} /> */}
              <SeriesList title='Ongoing'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  if (e.completed === undefined)
                    return true;
                  else return false;
                })} />
              <SeriesList title='Complete'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  return (e.completed !== undefined && e.completed);
                })} />
              <SeriesList title='Dropped'
                handler={this.handleSeriesItem}
                list={this.state.data.filter((e) => {
                  return (e.completed !== undefined && !e.completed);
                })} />
            </div>
          </div>
        </div>
        {/*<footer>
          Footer here!
        </footer>*/}
      </div>
    );
  }
}

export default App;
