import React from 'react';
import { Link } from 'react-router-dom';
import genLib from './generalLibrary';
import Image from './Image';
import chData from './chapterData';
import './SeriesList.css'
// import TiTime from 'react-icons/lib/ti/time';
// import MdAccessTime from 'react-icons/lib/md/access-time';

function SeriesList(props) {
  // let timeIcon = {
  //   marginBottom: '2px'
  // }
  return (
    <div className='slist-category'>
      <h4 className='slist-cat-title'>{props.title}</h4>
      {props.list.map((e, index) => (
      <Link to={`/r/${e.title}`} key={index}>
        <div className='sitem'>
          <div className='sitem-img-container'>
            <Image imgClass={'sitem-img'} src={e.cover} alt={e.title} />
          {/* <Image imgClass='sitem-img' src='http://img.bato.to/forums/uploads/d56e05bdcb26e058cd16d06b64fa3cae.jpg' alt={e.title} /> */}
          </div>
          <div className='sitem-text'>
            <div className='sitem-title'>{e.title}</div>
            {/*<div className='sitem-status'>{e.completed === undefined ? 'Ongoing' : (e.completed ? 'Completed' : 'Dropped')}</div>*/}
            {e.completed === undefined ?
            <div className='sitem-date'>Updated {genLib.howLongAgo(chData.series[e.title].rel[0].date)} ago</div>
            :
            <div className='sitem-date'>Updated {genLib.howLongAgo(e.updated)} ago</div>              
            }
          </div>
        </div>
      </Link>
      ))}
    </div>
  )
}

export default SeriesList;