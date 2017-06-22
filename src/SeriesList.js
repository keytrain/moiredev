import React from 'react';
import genLib from './generalLibrary';
import './SeriesList.css'

function SeriesList(props) {
  return (
    <div className='slist-category'>
      <h2 className='slist-cat-title'>{props.title}</h2>
      {props.list.map((e, index) => (
      <div className='sitem' key={index} onClick={props.handler} data-title={e.title}>
        <img src={e.vol[0]} alt={e.title} />
        <div className='sitem-text'>
          <div className='sitem-title'>{e.title}</div>
          <div className='sitem-date'>{e.completed === undefined ? 'Updated' : (e.completed ? 'Completed' : 'Dropped')} {genLib.howLongAgo(e.updated)}</div>
        </div>
      </div>
      ))}
    </div>
  )
}

export default SeriesList;