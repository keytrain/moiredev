import React from 'react';
import sData from './seriesData'
import './SeriesModal.css'

function SeriesModal(props) {
  let selection = sData.series[props.selection];

  return (
    <div style={{visibility: (props.show ? 'visible': 'hidden')}}>
      <div className='modal'>
      {selection.cover &&
        <img src={selection.cover[0]} alt='cover' />
      }
        <div className='modal-right'>
          <div className='modal-text'>
            <h3>{props.selection}</h3>
            <h5>By {selection.author}</h5>
            <p>{selection.synopsis}</p>
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
            <div className='modal-chapters'>
              <div className='modal-chapter'>
                Chapter 40 - 4d ago
              </div>
            </div>
          </div>

          <div className='modal-actions'>
            <button>Read</button> <button>Download</button>
          </div>
        </div>
      </div>
      <div className='modalBG' onClick={props.handler}>        
      </div>
    </div>
  )
}

export default SeriesModal;