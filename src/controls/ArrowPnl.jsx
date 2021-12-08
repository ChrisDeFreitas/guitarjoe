/*
  ArrowPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by QueryPnl.jsx of GuitrJoe app

*/
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from "framer-motion"

import ArrowButton from './ArrowButton'
import   './ArrowPnl.css'

function ArrowPnl( props ){

  let keyidx = 0
  
  function key(){ return 'ArrowPanel' +( ++keyidx ) }
  function onAniComplete(){
    if(props.closeCallback !== null)
      props.closeCallback()
  }
  function onChange(){
    let val = !props.isOpen
    if(props.onChange) props.onChange( val )
  }

  let animate = (props.isOpen ? 'open' : 'collapse')
  let initial = animate
  let firstRender = (props.firstRender === true)

  if(firstRender === true){
    initial = 'close'
    animate = 'open'
  }else
  if(props.closeCallback !== null){
    initial = 'open'
    animate = 'close'
  }
  // console.log('Ap render', firstRender, props.isOpen, initial, animate, props)

  return (
    <motion.div key={key()} className='ArrowPnl' 
      initial={initial}
      animate={animate}
      variants={{
        open: { height: 'auto', opacity:1, margin:'0.2em  0' },
        collapse: { height: '1.1em', opacity:1, margin:'0.2em  0' },
        close: { height: '0px', opacity:0, margin:0 },
      }}
      transition={{ ease:"easeOut", duration:0.3 }}
      onAnimationComplete={onAniComplete}
    >

      <div key={key()} className='ArrowPnlCaption' >
        <ArrowButton key={key()} 
          upOrDn={props.isOpen === true ?'up' :'dn'} 
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

  // arrowUpOrDn: PropTypes.string,
  arrowTitle: PropTypes.string,
  arrowWidth: PropTypes.string,
  onChange: PropTypes.func,

  firstRender: PropTypes.bool,
  isOpen: PropTypes.bool,
  closeCallback: PropTypes.func,
}
ArrowPnl.defaultProps = {
  caption: [<span>'ArrowPnl Caption'</span>],
  items: null,

  // arrowUpOrDn: 'up',     //up or dn
  arrowTitle: 'Click to collapse',
  arrowWidth:'1em',
  onChange: null,

  firstRender: true,
  isOpen: true,
  closeCallback: null,
}

export default ArrowPnl
