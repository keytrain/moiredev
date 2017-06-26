import React from 'react';
import genLib from './generalLibrary';
import sData from './seriesData'
import './SeriesModal.css'

function SeriesModal(props) {
  return (
    <div style={props.css}>
      <div className='modal'>
        <img src='' alt='cover' />
        <div className='modal-text'>
            <h2>{props.selection}</h2>
            <p>{sData.series[props.selection].synopsis}</p>
        </div>
      </div>
      <div className='modalBG' onClick={props.handler}></div>
    </div>
  )
}

export default SeriesModal;