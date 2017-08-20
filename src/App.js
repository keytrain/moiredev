import React, { Component } from 'react';
import './App.css';
import logo from './logoB.png';
import { Route } from 'react-router-dom';
import data from './data/releaseData';
import SeriesList from './SeriesList';
import SeriesModal from './SeriesModal';
import MdFilterList from 'react-icons/lib/md/filter-list';
import MdSearch from 'react-icons/lib/md/search';
import MdSort from 'react-icons/lib/md/sort';
import MdMoreVert from 'react-icons/lib/md/more-vert'
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import firebase from './firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'start',
      data: data.list,
      dataSet: data.list,
      filter: 'All',
      sort: 'Date',
      likes: {},
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
    firebase.likes.get((data) => {
      this.setState({likes: data})
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
    // if (e.key === 'Escape') {
    //   console.log(this.props.history)
    //   // this.props.history.push('/');
    // }
  }

  handleFilter(e) {
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
        case 'Date':
          break;
        case 'Likes':
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
        <Route path='/r/:series' render={(props) => <SeriesModal {...props} likes={this.state.likes} />} />
        <nav>
          <div className='nav-container'>
            <div className='logo-container'>
              <img src={logo} className='logo' alt='logo' />
            </div>

              <div className='filter-container'>
                <div className='search'>
                  <MdSearch size={24} style={{marginBottom:'2px',marginRight:'0.3rem'}} /> 
                  <input type='search' onChange={this.handleSearch} />
                </div>
                <div className='filterBy'>
                  <Dropdown attach={<div><MdFilterList size={24} style={{marginBottom:'2px'}}/> <small>FILTER BY</small></div>}>
                    {
                      ['All','Current','Complete','Dropped'].map((e) => 
                      <DropdownItem key={e} name={'filter'} icon={<MdFilterList size={16} />} selection={this.state.filter} text={e} handle={this.handleFilter} />
                      )
                    }
                  </Dropdown>
                </div>
                <div className='sortBy'>
                  <Dropdown attach={
                    <div><MdSort size={24} style={{marginBottom:'2px'}}/> <small>SORT BY</small></div>}>
                    {
                      ['Date','Likes'].map((e) => 
                      <DropdownItem key={e} name={'sort'} icon={<MdSort size={16} />} selection={this.state.sort} text={e} handle={this.handleFilter} />
                      )
                    }
                  </Dropdown>
                </div>

                <div className='more'>
                  <Dropdown attach={<MdMoreVert size={24} style={{marginBottom:'2px'}} />}>
                    <DropdownItem text={<a href='http://webchat.irchighway.net/#maigo'>IRC</a>} />
                    <DropdownItem text={'About'} />
                  </Dropdown>
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
