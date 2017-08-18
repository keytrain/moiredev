import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import sData from './data/seriesData';
import chData from './data/chapterData';
import genLib from './lib/generalLibrary';
// import MdFavoriteOutline from 'react-icons/lib/md/favorite-outline';
// import MdFavorite from 'react-icons/lib/md/favorite';
import ReactDisqusComments from 'react-disqus-comments';
import './SeriesModal.css';

class SeriesModal extends Component {
  constructor(props) {
    super(props);

    this.selection = this.props.match.params.series;
    this.selInfo = sData.series[this.selection];
    this.selChaps = Object.keys(chData.series[this.selection]).sort((a,b) => {
      if (Number(a) < Number(b)) { return -1; }
      else if (Number(a) > Number(b)) { return 1; }

      return 0;
    }).reverse();

    this.state = {
      showDisqus: false,
      expandChapters: (this.selChaps.length < 4 ? false : true)
    }

    // Functions
    this.handleKey = this.handleKey.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);    
  }

  closeModal() {
    document.removeEventListener('keydown', this.handleKey);
    this.props.history.push('/');
  }
  
  handleKey(e) {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  render() {
    return (
      <div>
        <div className='modal'>
          {this.selInfo.cover &&
            <Image containerClass={'modal-img-container'} 
              src={this.selInfo.cover[0]} alt='cover' />}
          <div className='modal-right'>
            <div className='modal-text'>
              <h1 className='modal-header'>{this.selection}</h1>
              <h3 className='header-lead'>{this.selInfo.author}</h3>
              <hr />
              <div className='modal-synopsis'>{this.selInfo.synopsis.map((e, index) => 
                <p key={index}>{e}</p>
              )}
              </div>
              <hr />
              <div className='modal-chapters-container'>
                {this.selChaps.length === 0 &&
                  <small>NO CHAPTERS SUPPORTED</small>
                }
                {this.selChaps.length > 0 &&
                  this.selChaps.map((e, index) => {
                    if (index < (this.state.expandChapters ? 3 : Infinity)) {
                      return (
                        <Link to={`/r/${this.selection}/${e}/0`} key={index}>
                          <div className='modal-chapter'>
                            <div className='modal-chapter-num'>
                              <strong>Chapter {e}</strong>
                            </div>
                            <div className='modal-chapter-date'>
                              {genLib.howLongAgo(chData.series[this.selection][e].date)} ago
                            </div>
                          </div>
                        </Link>
                      )
                    }
                    return '';
                })}
                {this.state.expandChapters &&
                <small className='link' onClick={()=>{
                  this.setState({expandChapters:false})}}>
                  SHOW MORE</small>
                }
                <hr />
              </div>
              <div className='modal-actions'>
                {this.selInfo.licensed ? 
                  <a href className='button' src='/#/Licensed'>Licensed</a> 
                  :
                  <a href className='button' src='/#/Archive'>Archive</a>
                }

                <button onClick={()=>{this.setState({showDisqus:true})}}>
                  Show Comments
                </button>
              </div>
              {this.state.showDisqus &&
                <div className='disqus'>
                  <hr />
                  <ReactDisqusComments shortname='maigo' identifier={`${this.selection}`}
                    url={`http://maigo.us/#/${this.selection}`} />
                </div>
              }
            </div>
          </div>
        </div>
        
        <div className='modalBG' onClick={this.closeModal}></div>

      </div>
    )
  }
}


export default SeriesModal;