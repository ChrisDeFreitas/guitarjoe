/*
  ArrowButton.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - an arrow in a button frame pointing up or down used to expand/collapse controls
  - used by to expand and collpase controls in GuitrJoe app and ArrowPnl.jsx
*/
import React  from 'react';
import PropTypes from 'prop-types';
import { motion } from "framer-motion"
import './ArrowButton.css';

function ArrowButton( props ){

  //handle initial state
  let uord =  (props.upOrDn === '' ?'dn' :props.upOrDn.toLowerCase())
  // console.log('ArrowButton function call', uord, props)

  function onClick(){
    let newud = (uord === 'up' ?'dn' :'up')
    // console.log('ArrowButton.onClick', newud )
    if(props.onChange !== null)
      props.onChange( newud )
  }

  let className = 'ArrowBtn ' +(uord === 'up' ?'ArrowBtnUp' :'ArrowBtnDn')
  
  let width = (props.width === '' ? '1em' :props.width)
  let dstyle = { height:width, width:width}
  let astyle = { fontSize:'calc( '+width+' * 0.8 )' }

  return (
    <div className={className} style={dstyle} onClick={onClick} title={props.title} 
    > 
      <motion.div style={astyle} 
        animate={uord}
        variants={{
          up: { transform:'rotateZ(-90deg)', left:'-1px' },
          dn: { transform:'rotateZ(90deg)',  left:'1px' },
        }}
        transition={{ ease:"easeOut", duration:0.4 }}
      >
      &#10148;
      </motion.div>
    </div>
  )  

}

ArrowButton.propTypes = {
  ArrowUpOrDn: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
}
ArrowButton.defaultProps = {
  upOrDn: 'up',     //up or dn
  title: 'Click to collapse',
  onChange: null,
  width:'1em',
}

export default ArrowButton

