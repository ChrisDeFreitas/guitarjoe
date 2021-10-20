/*
 Fret.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - called by FretPnl.jsx to draw a fret for GuitarJoe app
  - consolidates fret drawing functionality by handling HTML formulation, no content or event handling
  - fretboard is built from TD elements

*/
import React  from 'react';
import PropTypes from 'prop-types';

function Fret( props ){

  let keyii = 0
  function key(){ return 'Fret' +(++keyii) }

  let first = props.fretFirst
  let last = props.fretLast
  let strg = props.strg
  let fret = props.fret
  let click = props.onClick

  if(props.fretFiltered === true && strg >= 1){ //no onClick for filtered frets
    click = null
  } 

  let btnStrFltr = null    //string filter image for fret0
  if(fret === 0 && strg >= 1 && strg <= 6){
    btnStrFltr=(
     <div key={key()} className={'btnFilter btnStrgFltr btnStrgFltr'+strg} onClick={props.strgFltrClick} data-strn={strg} data-fret={fret} >
      <div>&diams;</div>
     </div>
    )
  }

  let fretbar = null      // fret bar image
  if( strg > 0 && strg < 8
  && fret >= first && fret <= last )
    fretbar = <div key={key()} className='fretbar' onClick={click} data-strn={strg} data-fret={fret} ></div>

  let stringdiv = null    //string image
  if(strg >= 1 && strg <= 6)
    stringdiv = <div key={key()} className='stringdiv' onClick={click} data-strn={strg} data-fret={fret} ></div>

  return(
    <td key={key()} 
      data-strn={strg} 
      data-fret={fret} 
      data-fretfilter={props.fretFiltered}
      className={props.className} 
      onClick={click} 
     >
       {btnStrFltr}
       {props.content}
       {fretbar}
       {stringdiv}
     </td>
  )

}

Fret.propTypes = {
  fretFirst: PropTypes.number,
  fretLast: PropTypes.number,
  fretFiltered: PropTypes.bool,

  strg: PropTypes.number,
  fret: PropTypes.number,
  
  className: PropTypes.string,
  content: PropTypes.object,
  onClick: PropTypes.func,
  strgFltrClick: PropTypes.func,
}
Fret.defaultProps = {
  fretFirst: 0,
  fretLast: 14,
  fretFiltered: false,

  strg: 0,
  fret: 0,

  className: '',
  content: null,
  onClick: null,
  strgFltrClick: null,
}

export default Fret


