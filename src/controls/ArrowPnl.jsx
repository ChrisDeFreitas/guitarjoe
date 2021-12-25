/*
  ArrowPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by InfoPnl.jsx of GuitrJoe app

*/
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from "framer-motion"

import ArrowButton from './ArrowButton'
import   './ArrowPnl.css'

function ArrowPnl( props ){

  let keyidx = 0
  function key(){ return 'ArrowPanel' +( ++keyidx ) }
  function onAniComplete( variantName ){
    if( props.onAniComplete )
      props.onAniComplete( props.arrowTitle, variantName )
  }
  function onChange( newud ){
    let val = (newud === 'up' ?'Show' :'Collapse')
    if( props.onChange )
      props.onChange( val )
  }
  
  return (
    <motion.div key={key()} className='ArrowPnl' 
      initial={props.openState}
      animate={(props.aniControl !== null ?props.aniControl :props.openState)}
      inherit={false}   // add to ArrowBtn
      variants={{
        Show: { height: 'auto', opacity:1 },
        Collapse: { height: '1.1em', opacity:1 },
        Close: { height: '0px', opacity:0  },
      }}
      transition={{ ease:"easeOut", duration:0.3 }}
      onAnimationComplete={onAniComplete}
    >
      <div key={key()} className='ArrowPnlCaption' >
        <ArrowButton key={key()} 
          upOrDn={props.openState === 'Show' ?'up' :'dn'} 
          width={props.arrowWidth}
          title={props.arrowTitle} 
          onChange={onChange}
        />
        {props.caption}
      </div>
      <div 
        key={key()} 
        className='ArrowPnlItems' 
      >
        {props.items}
      </div>
    </motion.div>
  )
}

ArrowPnl.propTypes = {
  caption: PropTypes.array,   //array of jsx
  items: PropTypes.array,     //array of jsx

  arrowTitle: PropTypes.string,
  arrowWidth: PropTypes.string,

  openState: PropTypes.string,    //Show, Collapse, Close
  onChange: PropTypes.func,       // notify parent on open/collapse change

  aniControl: PropTypes.object,   // motion.useAnimation from parent
  onAniComplete: PropTypes.func,  // call parent: onAniComplete( props.arrowTitle )
}
ArrowPnl.defaultProps = {
  caption: [<span>'ArrowPnl Caption'</span>],
  items: null,

  arrowTitle:'',
  arrowWidth:'1em',

  aniControl:   null,
  onAniComplete:null,
  onChange:     null,
  openState:    'Show',
}

export default ArrowPnl
