/*
  ArrowButton.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - arrow in button frame pointing up or down used to expand/collapse controls
  - used by to exapnd and collpase controls GuitrJoe app
*/
import React  from 'react';
import PropTypes from 'prop-types';
import './ArrowButton.css';

function ArrowButton( props ){

  let uord =  (props.upOrDn === '' ?'dn' :props.upOrDn.toLowerCase())
  // console.log('ArrowButton Init', uord, props)

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
  let arrow = <div style={astyle} >&#10148;</div>

  return (
    <div className={className} style={dstyle} onClick={onClick} title={props.title} > 
      {arrow}
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

