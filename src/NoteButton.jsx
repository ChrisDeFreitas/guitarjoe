/*
  NoteButton.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by FretPnl.jsx of GuitrJoe app

*/
import React from 'react';
import PropTypes from 'prop-types';

import './NoteButton.scss';
import q from "./guitar_lib.js";
import Abcjs from "./controls/react-abcjs"

// sample:
// <button className='noteButton'>
//   <span className=spanNote >C
//     <sub className='subOctave' >octave</sub>
//   </span>
//   <sub className='subInterval' >interval</sub>
// </button>


function NoteButton( props ){
  // console.log('NoteButton', props)

  let {root, nobj, qry} = props

  if(qry.octave !== 0 && qry.octave !== nobj.octave)
    return null  

  let keyii = 0
  function key(){ return 'FBtn' +(++keyii) }

  function buttonClick(event){
    let btn = event.target
    if(btn.nodeName !== 'BUTTON'){ 
      btn = btn.parentNode      //span
      if(btn.nodeName !== 'BUTTON') 
        btn = btn.parentNode    //span span
    }
    if(btn.nodeName !== 'BUTTON') return
    event.stopPropagation()

    if(['fretRoot','noteSelect'].indexOf( qry.mode ) >= 0  
    && btn.classList.contains('root')
    && qry.scale === null && qry.chord === null && qry.ivl === null){    //nothing to do, turn off fretRoot state
	    props.stateChange( 'fretRoot', null )
    } else
    if(qry.mode === 'fretSelect' 
    && btn.classList.contains('root')
    && btn.dataset.tab === qry.fretSelect[0].tab){ //root note, stop fretSelect mode
      props.stateChange( 'fretSelect', null )
    } else
    if(qry.mode === 'fretSelect' 
    && props.fretSelectFind( btn.dataset.tab ) >= 0){ //this is a selected note
      props.stateChange( 'fretSelect', btn.dataset.tab)   //toggle btn
    }
    else{   //toggle button selected state
      btn.classList.toggle('selected')
    }
  }
  function btnStyleChange(event){   //toggle formatting of fret button captions
    // console.log('fretBtnStyleChange', event)
    event.stopPropagation()
    
   if(qry.note === 'All'){
      if(qry.fretBtnStyle === 'NoteTab')
   	  	props.stateChange( 'fretBtnStyle', 'NoteAbc' )
      else
        props.stateChange( 'fretBtnStyle', 'NoteTab' )
    }
    else
    if(props.qry.fretBtnStyle === 'NoteFirst')
   		props.stateChange( 'fretBtnStyle', 'IvlFirst' )
    else
    if(props.qry.fretBtnStyle === 'IvlFirst')
   		props.stateChange( 'fretBtnStyle', 'IvlAbc' )
    else
    if(props.qry.fretBtnStyle === 'IvlAbc')
   		props.stateChange( 'fretBtnStyle', 'IvlTab' )
    else
   		props.stateChange( 'fretBtnStyle', 'NoteFirst' )
  }

  let btnStyle = qry.fretBtnStyle,
    ivl = nobj.ivl, 
    selected = 0
 
    //format button caption
  let btncaption = []
  let renderParams = {    //for AbcJs
    minPadding:5,   //doesn't work
    paddingtop:0,
    paddingbottom:0,
    paddingleft:0,
    paddingright:0,
    //responsive: "resize",
    scale:(nobj.octave <= 2 || nobj.octave >= 5 ?0.3 :0.4),
    staffwidth:18,
    textboxpadding:0,
  }

  let note = <span>{nobj.note}</span>
  // if( note.indexOf('♭') >= 1 )    //safari does not render ♭ properly
  //   note = <span className='btnFlatNote'>{note}</span>
  // else
    // note = 
  
  if(ivl === undefined || ivl === null){
    switch(btnStyle){
      case 'IvlFirst': btnStyle = 'NoteFirst'; break;
      case 'IvlAbc': btnStyle = 'NoteAbc'; break;
      case 'IvlTab': btnStyle = 'NoteTab'; break;
      default: break; //for React automated testing
    } 
  }

  //apply button caption style
  if(btnStyle === 'IvlFirst'){
    btncaption.push(
      <span key={key()} className='spanIvl' onClick={buttonClick} >
        <span key={key()} onClick={buttonClick} >{ivl.abr.substr(0,1)}</span>
        {ivl.abr.substr(1)}
      </span>
    )
    btncaption.push(
      <sub key={key()} className='subNote' onClick={btnStyleChange}>{nobj.note}
          <sub key={key()} className='subOctave' >{nobj.octave}</sub>
      </sub>
    )
  }else
  if(btnStyle === 'IvlAbc'){
    btncaption.push(
      <span key={key()} className='spanIvl' onClick={buttonClick} >
        <span key={key()} onClick={buttonClick} >{ivl.abr.substr(0,1)}</span>
        {ivl.abr.substr(1)}
      </span>
    )
    btncaption.push(
      <sub key={key()} className='ivlabc abc' onClick={btnStyleChange}
         ><Abcjs key={key()} 
        abcNotation={'K:clef=none\n y' +q.notes.toAbc( nobj )}
        renderParams={renderParams} parserParams={{}} engraverParams={{}}
      /></sub>
    )
  } else
  if(btnStyle === 'IvlTab'){
    btncaption.push(
      <span key={key()} className='spanIvl' onClick={buttonClick} >
        <span key={key()} onClick={buttonClick} >{ivl.abr.substr(0,1)}</span>
        {ivl.abr.substr(1)}
      </span>
    )
    btncaption.push(
      <sub key={key()} className='ivltab tab' onClick={btnStyleChange}
        >{nobj.tab}</sub>
    )
  }else
  if(btnStyle === 'NoteTab'){      
    btncaption.push(
      <span key={key()} className='spanNote'  onClick={buttonClick} >{note}
          <sub key={key()} className='subOctave' onClick={buttonClick} >{nobj.octave}</sub>
      </span>
    )
    btncaption.push(
      <sub key={key()} className='notetab tab' onClick={btnStyleChange}
        >{nobj.tab}</sub>
    )
  }else
  if(btnStyle === 'NoteAbc'){
    btncaption.push(
      <span key={key()} className='spanNote'  onClick={buttonClick} >{note}
          <sub key={key()} className='subOctave' onClick={buttonClick} >{nobj.octave}</sub>
      </span>
    )
    btncaption.push(
      <sub key={key()} className='abc' onClick={btnStyleChange}
         ><Abcjs key={key()} 
        abcNotation={'K:clef=none\n y' +q.notes.toAbc( nobj )}
        renderParams={renderParams} parserParams={{}} engraverParams={{}}
      /></sub>
    )
  } 
  else {  // (btnStyle === 'NoteFirst')
    btncaption.push(
      <span key={key()} className='spanNote'  onClick={buttonClick} >{note}
          <sub key={key()} className='subOctave' onClick={buttonClick} >{nobj.octave}</sub>
      </span>
    )
    if(nobj.ivl){
      btncaption.push(
        <sub key={key()} className='subInterval' onClick={btnStyleChange} >{ivl.abr}</sub>
      )
    }
  }
 
  //apply classes in a specific order
  let btnClass =  [ qry.mode ]
  if(nobj.notes.indexOf( root.note ) >= 0){
    btnClass.push('root')
    if(qry.mode === 'fretRoot'){
      if(qry.root.tab === nobj.tab)
        btnClass.push('moderoot')
    }
  }
  if((nobj.fretFltr && nobj.fretFltr === true) 
  || (nobj.strgFltr && nobj.strgFltr === true) ){
    btnClass.push('filtered')
  }
  if(qry.noteFilter.indexOf( nobj.note ) >= 0){
    btnClass.push('noteFilter')
  }else
  if(nobj.mode !== undefined){
    btnClass.push(nobj.mode)
  }

  return (
    <button key={key()} className={'noteButton '+btnClass.join(' ')}  onClick={buttonClick}
      data-strn={nobj.strgnum} data-fret={nobj.fret}  data-tab={nobj.tab} 
      data-selected={selected}
    >
      {btncaption}
    </button>
  )  
}

NoteButton.propTypes = {
  root: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  nobj: PropTypes.object,
  qry:  PropTypes.object,
  fretSelectFind: PropTypes.func,
  stateChange: PropTypes.func,
}

export default NoteButton