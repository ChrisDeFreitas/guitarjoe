/*
  Bgnd.js
  - React background manager
  - part of GuitarJoe App
  
  - usage: ???

  - Chris DeFreitas, chrisd@europa.com  created:Aug 2021

*/
import React, { useState } from 'react';

function Bgnd(){ 
  let list =[{ 
    id:0,
    name:'string',
    uri:'string',  //assume video uri
    cw:'copywrite string, ??? === unknown, only ??? hidden',
    dsc:'Description string'
  },{
    id:1,
    name:'Tom Waits - Chocolate Jesus',
    cw:'???',
    uri:'https://www.youtube.com/watch?v=1wfamPW3Eaw',
    dsc:'Hey '
  }]

  // const [id] = useState( list[1].id )
  const [name] = useState( list[1].name )
  const [cw] = useState( list[1].cw )
  const [uuri] = useState( list[1].uri )
  const [dsc] = useState( list[1].dsc )
{/* <video className='video' controls autoplay src={uuri} /> */}
  return (
    <div className='Bgnd'>
      
  			<div className='infoPnl'>
    			<div className='name'>{name}</div>
          { cw === '???' ?null
            :<div className='cw'>Copywrite: {cw}</div> }
    			<div className='uri'>{uuri}</div>
    			<div className='dsc'>{dsc}</div>
        </div>
     </div>
  )
}

export default Bgnd