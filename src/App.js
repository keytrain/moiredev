import React, { Component } from 'react';
import './App.css';
import logo from './logoB.png';
import { Route } from 'react-router-dom';
import data from './data/releaseData';
import SeriesList from './SeriesList';
import SeriesModal from './SeriesModal';
import MdFilterList from 'react-icons/lib/md/filter-list';
import MdSearch from 'react-icons/lib/md/search';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      data: data.list,
      dataSet: data.list,
      filter: 'All',
      sort: 'Date',
      showModal: {
        position: 'fixed',
        visibility: 'hidden',
      },
      noscroll: {
        height:'100%',
        overflowY:'auto'
      },
      modalSelection: '',
    }
    this.openSList = this.openSList.bind(this);
    this.closeSList = this.closeSList.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    let name = e.currentTarget.attributes.name.value;

    this.setState((prevState) => {
      switch (name) {
        case 'sort':
          prevState.sort = value;
          break;
        case 'filter':
          prevState.filter = value;
          break;
        default:
      }
  
      let dataTemp = null;
      switch (value) {
        case 'All':
          prevState.data = data.list;
          prevState.dataSet = data.list;
          break;
        case 'Current':
          dataTemp = data.list.filter(
            (e) => {
              if (e.completed === undefined)
                return true;
              else return false;
            });
          prevState.data = dataTemp;
          prevState.dataSet = dataTemp;
          break;
        case 'Complete':
          dataTemp = data.list.filter(
            (e) => {
              return (e.completed !== undefined && e.completed);
            });
          prevState.data = dataTemp;
          prevState.dataSet = dataTemp;
          break;
        case 'Dropped':
          dataTemp = data.list.filter(
            (e) => {
              return (e.completed !== undefined && !e.completed);
            });
          prevState.data = dataTemp;
          prevState.dataSet = dataTemp;
          break;
        default:
      }
    });
  }

  handleSearch(e) {
    let value = e.target.value.toLowerCase();
    this.setState((prevState) => {
      if (value.length === 0) {
        prevState.data = prevState.dataSet;
      } else {
        prevState.data = prevState.dataSet.filter((e) => {
          return e.title.toLowerCase().includes(value);
        });
      }
    });
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

              <div className='filter-container'>
                <div className='filterBy'>
                  <MdFilterList />
                  <button className={'filter ' + (this.state.filter === 'All' ? 'filter-active':'')} name='filter' value='All' onClick={this.handleFilter}>All</button>
                  <button className={'filter ' + (this.state.filter === 'Current' ? 'filter-active':'')} name='filter' value='Current' onClick={this.handleFilter}>Current</button> 
                  <button className={'filter ' + (this.state.filter === 'Complete' ? 'filter-active':'')} name='filter' value='Complete' onClick={this.handleFilter}>Complete</button> 
                  <button className={'filter ' + (this.state.filter === 'Dropped' ? 'filter-active':'')} name='filter' value='Dropped' onClick={this.handleFilter}>Dropped</button> 
                </div>
                <div className='sortBy'>
                  <MdFilterList />
                  <button className={'filter ' + (this.state.sort === 'Date' ? 'filter-active':'')} name='sort' value='Date' onClick={this.handleFilter}>Date</button> 
                  <button className={'filter ' + (this.state.sort === 'Likes' ? 'filter-active':'')} name='sort' value='Likes' onClick={this.handleFilter}>Likes</button>
                </div>
                <div className='search'>
                <MdSearch style={{marginRight:'0.3rem'}} /> 
                <input type='search' onChange={this.handleSearch} />
              </div>
              </div>
          </div>
        </nav>
        <div className='wrapper'>
          <div className='serieslist-container'>
            <div className='serieslist'>
               <SeriesList title=''
                handler={this.handleSeriesItem}
                list={this.state.data} />
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
