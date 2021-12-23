/*
  ArrowPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by InfoPnl.jsx of GuitrJoe app

*/
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from "framer-motion"

import ArrowButton from './ArrowButton'
import   './ArrowPnl.css'

function ArrowPnl( props ){

  let [forceClose, setForceClose] = useState( false )
  
  useEffect(() => {
    if(props.setCloseFunc !== null){
      props.setCloseFunc( close, props.arrowTitle )   // pass to parent
    }
  })

  let keyidx = 0
  function key(){ return 'ArrowPanel' +( ++keyidx ) }
  function close(){
    if(props.openState !== 'Close')
      setForceClose( true )   // do rollup animation
    else
    if(props.onAniComplete !== null)
      props.onAniComplete( true, props.arrowTitle )
    // else
      // throw Error('ArrowPnl.close() called but nothing to do.')
  }
  function onAniComplete(){
    if(props.onAniComplete !== null)
      props.onAniComplete( forceClose, props.arrowTitle )
  }
  function onChange( newud ){
    // let val = !props.openState
    let val = (newud === 'up' ?'Show' :'Collapse')
    if(props.onChange) props.onChange( val )
  }
  
  let animate = props.openState
  let initial = animate

  if(props.firstRender === true){
    initial = 'Close'
    animate = 'Show'
  }else
  if(forceClose === true){
    animate = 'Close'
  }

  return (
    <motion.div key={key()} className='ArrowPnl' 
      initial={initial}
      animate={animate}
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

  firstRender: PropTypes.bool,
  openState: PropTypes.string,   //Show, Collapse, Close

  onAniComplete: PropTypes.func,  // call parent: onAniComplete( forceClose, props.arrowTitle )
  onChange: PropTypes.func,       // notify parent on open/collapse change
  setCloseFunc: PropTypes.func,   // allow parent to call close()
}
ArrowPnl.defaultProps = {
  caption: [<span>'ArrowPnl Caption'</span>],
  items: null,

  arrowTitle:'',
  arrowWidth:'1em',

  firstRender: true,
  openState: 'open',

  onAniComplete: null,
  onChange: null,
  setCloseFunc: null,
}

export default ArrowPnl
