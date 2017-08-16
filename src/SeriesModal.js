import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import sData from './data/seriesData';
import chData from './data/chapterData';
import genLib from './lib/generalLibrary';
// import MdFavoriteOutline from 'react-icons/lib/md/favorite-outline';
// import MdFavorite from 'react-icons/lib/md/favorite';
import MdFileDownload from 'react-icons/lib/md/file-download';
import ReactDisqusComments from 'react-disqus-comments';
import './SeriesModal.css';


class SeriesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDisqus: false
    }

    this.handleKey = this.handleKey.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);    
  }

  handleKey(e) {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }
  
  closeModal() {
    document.removeEventListener('keydown', this.handleKey);
    this.props.history.push('/');
  }

  render() {
    let selection = this.props.match.params.series;
    let selInfo = sData.series[selection];
    let selChaps = Object.keys(chData.series[selection]).sort((a,b) => {
      if (Number(a) < Number(b)) { return -1; }
      else if (Number(a) > Number(b)) { return 1; }
      return 0;
    }).reverse();

    return (
      <div>
        <div className='modal'>
        {selInfo.cover &&
          <Image containerClass={'modal-img-container'} src={selInfo.cover[0]} alt='cover' />
        }
          <div className='modal-right'>
            <div className='modal-text'>
              <h3>{selection}</h3>
              <h5>{selInfo.author}</h5>
              <hr />
              <div className='modal-synopsis'>
              {selInfo.synopsis.map((e, index) => 
                <p key={index}>{e}</p>
              )}
              </div>
              <hr />
              <div className='modal-chapters-container'>
                {selChaps.map((e, index) => (
                <Link to={`/r/${selection}/${e}/0`} key={index}>
                  <div className='modal-chapter'>
                    <div className='modal-chapter-num'>
                      Chapter {e}
                    </div>
                    <div className='modal-chapter-date'>
                      {genLib.howLongAgo(chData.series[selection][e].date)} ago
                    </div>
                  </div>
                </Link>
                ))}
              </div>
              <hr />
              {!this.state.showDisqus &&
                <button className='commentsbtn' onClick={()=>{this.setState({showDisqus:true})}}>Show Comments</button>
              }
              {this.state.showDisqus &&
              <div className='disqus'>
                <ReactDisqusComments
                  shortname='maigo'
                  identifier={`${selection}`}
                  url={`http://maigo.us/#/${selection}`} />
              </div>
              }
            </div>

            <div className='modal-actions'>
              
              {selInfo.licensed ? 'Licensed' : <MdFileDownload size={24} />}
            </div>
          </div>
        </div>
        <div className='modalBG' onClick={this.closeModal}></div>
      </div>
    )
  }
}

export default SeriesModal;