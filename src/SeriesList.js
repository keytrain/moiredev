import React from 'react';
import genLib from './generalLibrary';
import './SeriesList.css'
// import TiTime from 'react-icons/lib/ti/time';
// import MdAccessTime from 'react-icons/lib/md/access-time';

function SeriesList(props) {
  // let timeIcon = {
  //   marginBottom: '2px'
  // }
  return (
    <div className='slist-category'>
      <h5 className='slist-cat-title'>{props.title}</h5>
      {props.list.map((e, index) => (
      <div className='sitem' key={index} onClick={props.handler} data-title={e.title}>
        <img className='sitem-img' src={e.vol[0]} alt={e.title} />
        {/*<img className='sitem-img' src='http://img.bato.to/forums/uploads/d56e05bdcb26e058cd16d06b64fa3cae.jpg' alt={e.title} />*/}
        <div className='sitem-text'>
          <div className='sitem-title'>{e.title}</div>
          <div className='sitem-date'>{e.completed === undefined ? 'Updated' : (e.completed ? 'Completed' : 'Dropped')} {genLib.howLongAgo(e.updated)} ago</div>
        </div>
      </div>
      ))}
    </div>
  )
}

export default SeriesList;