/*
  FretButton.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by FrePnl.jsx of GuitrJoe app

*/
import React from 'react';
import PropTypes from 'prop-types';

import './FretButton.css';
import q from "./guitar_lib.js";
import Abcjs from "./controls/react-abcjs"

// sample:
// <button className='fretButton'>
//   <span className=spanNote >C
//     <sub className='subOctave' >octave</sub>
//   </span>
//   <sub className='subInterval' >interval</sub>
// </button>


function FretButton( props ){
  // console.log('FretButton', props)

  let {root, nobj, qry} = props

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

    if(['fretRoot','noteSelect'].indexOf( qry.rootType ) >= 0  
    && ['fretRoot','noteSelect'].indexOf( btn.dataset.state ) >= 0
    && qry.scale === null && qry.chord === null && qry.ivl === null){    //nothing to do, turn off fretRoot state
	    props.stateChange( 'fretRoot', null )
    } else
    if(qry.rootType === 'fretSelect' && btn.dataset.state === 'fretSelect'
    && btn.dataset.tab === qry.fretSelect[0].tab){ //hide button
        // console.log('buttonClick(): stop fretSelect')
    		props.stateChange( 'fretSelect', null )
        return
    } else
    if(qry.rootType === 'fretSelect' && props.fretSelectFind( btn.dataset.tab ) >= 0){ //this is a selected fret
      if(qry.fretSelect.length === 2 )    //one selected fret after this hidden, change to fretRoot
		    props.stateChange( 'fretRoot', qry.fretSelect[0] )
      else    //more than two frets selected, deselect this button
     		props.stateChange( 'fretSelect', btn.dataset.tab)
    }
    else{   //toggle button selected state
      let selected = Number( btn.dataset.selected )
      if(selected === 0)
        btn.dataset.selected = 1
      else
      if(selected === 1)
        btn.dataset.selected = 0
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

  let btnState = '', 
    btnStyle = qry.fretBtnStyle,
    ivl = nobj.ivl, 
    selected = 0
    
    if(ivl === undefined || ivl === null){
      switch(btnStyle){
        case 'IvlFirst': btnStyle = 'NoteFirst'; break;
        case 'IvlAbc': btnStyle = 'NoteAbc'; break;
        case 'IvlTab': btnStyle = 'NoteTab'; break;
        default: break; //for React automated testing
      } 
    }

  //assign format for root note button
  if(root === 'ALL'){   //user selected All Notes
    if(qry.octave !== 0 && qry.octave !== nobj.octave)
      return null      
    if( ['NoteAbc','NoteTab'].indexOf( qry.fretBtnStyle ) < 0 )
      btnStyle = 'NoteAbc'
  }else
  if(qry.rootType === 'fretRoot'){
    if(nobj.notes.indexOf( root.note ) >= 0  &&  nobj.semis === root.semis){
      if(nobj.state === 'chord1')
        btnState = 'chord0'   //defines fret root is chord root
      else
        btnState = qry.rootType
    }
  }else
  if(qry.rootType === 'noteSelect'){
    if(root.notes.indexOf( nobj.note ) >= 0){
      if(qry.chord === null)
        btnState = qry.rootType
    }
  }else
  if(qry.rootType === 'fretSelect'){
    // if(nobj.ivl.abr === 'P1' && nobj.tab === qry.fretSelect[0].tab){
    if(nobj.tab === qry.fretSelect[0].tab){
      btnState = qry.rootType
    }else
    if(nobj.fsmatch){
      btnState = 'fretSelectMatch'
      if(nobj.notes.indexOf( qry.fretSelectMatch.obj.ivls[0].note ) >= 0) //obj = scale || chord
        btnState += 1   //fretSelectMatch1 == root note of chord or scale
    }
  }

  //button.dataset.state used to apply CSS
  if(btnState === '' && nobj.state)
    btnState = nobj.state
  // overrides calculated state
  if(nobj.state === 'triad' || nobj.state === 'triad1'
  || nobj.state === 'invr' || nobj.state === 'invr1'
  || nobj.state === 'chordShape' || nobj.state === 'chordShape0' || nobj.state === 'chordShape1' )
    btnState = nobj.state
  if(qry.noteFilter.indexOf( nobj.note ) >= 0)   // allow overriding roottype because user selected
    btnState = 'noteFilter'

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

  let note = nobj.note
  if( note.indexOf('♭') >= 1 )    //safari does not render ♭ properly
    note = <span className='btnFlatNote'>{note}</span>
  else
    note = <span>{note}</span>
  
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
 
  return (
    <button key={key()} className='fretButton'  onClick={buttonClick}
      data-strn={nobj.strgnum} data-fret={nobj.fret}  data-tab={nobj.tab} 
      data-state={btnState} data-selected={selected}
    >
      {btncaption}
    </button>
  )  
}

FretButton.propTypes = {
  root: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  nobj: PropTypes.object,
  qry:  PropTypes.object,
  fretSelectFind: PropTypes.func,
  stateChange: PropTypes.func,
}

export default FretButton
