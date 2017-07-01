import React from 'react';
import { Link, Route } from 'react-router-dom';
import Reader from './Reader';
import sData from './seriesData';
import cData from './chapterData';
import genLib from './generalLibrary';
import './SeriesModal.css';

function SeriesModal(props) {
  let selection = props.match.params.series;
  let selInfo = sData.series[selection];
  let selChaps = cData.series[selection];

  return (
    <div>
      <div className='modal'>
      <Route path='/r/:series/:chapter' component={Reader} />
      {selInfo.cover &&
        <img src={selInfo.cover[0]} alt='cover' />
      }
        <div className='modal-right'>
          <div className='modal-text'>
            <h3>{selection}</h3>
            <h5>By {selInfo.author}</h5>
            <p>{selInfo.synopsis}</p>
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
              {selChaps.map((e) => (
              <Link to={`/r/${selection}/${e.chapter}`} key={e.chapter}>
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
      <div className='modalBG' onClick={props.handler}>        
      </div>
    </div>
  )
}

export default SeriesModal;