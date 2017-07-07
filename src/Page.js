import React from 'react';
import Image from './Image';

function Page(props) {
  return (
    <div><Image src={props.src} /></div>
  );
}

export default Page;