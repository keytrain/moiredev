import React from 'react';
import { Link, Route } from 'react-router-dom';
import Image from './Image';
import Reader from './Reader';
import sData from './seriesData';
import cData from './chapterData';
import genLib from './generalLibrary';
import './SeriesModal.css';


function SeriesModal(props) {
  const handleKey = function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  const closeModal = function() {
    document.removeEventListener('keydown', handleKey);
    document.body.style.overflow='auto';
    props.history.push('/');
  }

  document.addEventListener('keydown', handleKey);

  document.body.style.overflow = 'hidden';

  let selection = props.match.params.series;
  let selInfo = sData.series[selection];
  let selChaps = cData.series[selection].rel;

  return (
    <div>
      <Route path='/r/:series/:chapter/:page' component={Reader} />
      <div className='modal'>
      {selInfo.cover &&
        <Image containerClass={'modal-img-container'} src={selInfo.cover[0]} alt='cover' />
      }
        <div className='modal-right'>
          <div className='modal-text'>
            <h3>{selection}</h3>
            <h5>By {selInfo.author}</h5>
            {selInfo.synopsis.map((e, index) => 
              <p key={index}>{e}</p>
            )}
            <hr />
            {/*<div className='modal-bite'>
              <small>STARTED</small>
              <div></div>
            </div>
            <div className='modal-bite'>
              <small>STATUS</small>
              <div></div>
            </div>*/}
            <small>RELEASES</small>
            <div className='modal-chapters-container'>
              {selChaps.map((e, index) => (
              <Link to={`/r/${selection}/${e.chapter}/0`} key={index}>
                <div className='modal-chapter'>
                  <div className='modal-chapter-num'>
                    Chapter <strong>{e.chapter}</strong>
                  </div>
                  <div className='modal-chapter-date'>
                    {genLib.howLongAgo(e.date)} ago
                  </div>
                </div>
              </Link>
              ))}
            </div>
          </div>

          <div className='modal-actions'>
            <button>Download</button>
          </div>
        </div>
      </div>
      <div className='modalBG' onClick={closeModal}></div>
    </div>
  )
}

export default SeriesModal;