import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import sData from './data/seriesData';
import chData from './data/chapterData';
import genLib from './lib/generalLibrary';
import MdFavoriteOutline from 'react-icons/lib/md/favorite-outline';
import MdFavorite from 'react-icons/lib/md/favorite';
import ReactDisqusComments from 'react-disqus-comments';
import './SeriesModal.css';
import firebase from './firebase';

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
      expandChapters: (this.selChaps.length < 4 ? false : true),
      likes: this.props.likes[this.selection],
      liked: false
    }

    // Functions
    this.handleKey = this.handleKey.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);

    firebase.likes.getBySeries(this.selection, (data) => {
      this.setState({likes: data})
    })
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
                  <div><small>NO CHAPTERS SUPPORTED</small></div>
                }
                {this.selChaps.length > 0 &&
                  this.selChaps.map((e, index) => {
                    if (index < (this.state.expandChapters ? 3 : Infinity)) {
                      return (
                        <div key={index} className='modal-chapter'>
                          <Link to={`/r/${this.selection}/${e}/0`}>
                            <div className='modal-chapter-num'>
                              Chapter {e}
                            </div>
                          </Link>
                          <div className='modal-chapter-date'>
                            {genLib.howLongAgo(chData.series[this.selection][e].date)} ago
                          </div>
                        </div>
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
                  {this.selInfo.licensed ? 
                    <small>Licensed</small>
                    :
                    <div>
                      <small>Read more at 
                      {this.selInfo.reader.map((e) =>
                        <a key={e.name} href={e.src}> {e.name} </a>
                      )}
                      </small><br />
                      <small>Download at our <a href src='https://www.dropbox.com/s/uwxkqshyxmct83z/Maigo%20Repository.txt?dl=0'>archives</a></small>
                    </div>
                  }
                  <div>
                    <small>Purchase volumes at 
                    {this.selInfo.purchase.map((e) =>
                      <a key={e.vendor} href={e.src}> {e.vendor} </a>
                    )}
                    to support the series and increase the likelihood of further publications.
                    </small>
                  </div>

                <hr />

                {this.state.liked ? 
                  <MdFavorite size={24} style={{paddingBottom:'2px'}} />
                  :
                  <MdFavoriteOutline size={24} style={{paddingBottom:'2px'}} />
                }
                <strong> {this.state.likes}</strong>
                
              </div>
              {!this.state.showDisqus ?
              <div className='modal-actions'>
                <small className='link' onClick={()=>{this.setState({showDisqus:true})}}>
                  Show Comments
                </small>
              </div>
              :
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