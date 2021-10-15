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

  let isOpen = ( props.arrowUpOrDn === 'up' )
  let keyidx = 0

  function key(){ return 'ArrowPanel' +( ++keyidx ) }
  function onChange(){
    let val = !isOpen
    if(props.onChange) props.onChange( val )
  }

  return (
    <div key={key()} className='ArrowPnl' >
      <div key={key()} className='ArrowPnlCaption' >
        <ArrowButton key={key()} 
          upOrDn={isOpen === true ?'up' :'dn'} 
          width={props.arrowWidth}
          title={props.arrowTitle} 
          onChange={onChange}
        />
        {props.caption}
      </div>
      <motion.div 
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { height: 'auto' },
          closed: { height: '0px' },
        }}
        transition={{
          type: "spring", restSpeed:150, damping: 30,
          duration:0.2
        }}
        
        key={key()} 
        className='ArrowPnlItems' 
       >
        {props.items}
      </motion.div>
    </div>
  )

}

ArrowPnl.propTypes = {
  caption: PropTypes.array,   //array of jsx
  items: PropTypes.array,     //array of jsx

  arrowUpOrDn: PropTypes.string,
  arrowTitle: PropTypes.string,
  arrowWidth: PropTypes.string,

  onChange: PropTypes.func,
}
ArrowPnl.defaultProps = {
  caption: [<span>'ArrowPnl Caption'</span>],
  items: null,
  
  arrowUpOrDn: 'up',     //up or dn
  arrowTitle: 'Click to collapse',
  arrowWidth:'1em',

  onChange: null,
}

export default ArrowPnl
