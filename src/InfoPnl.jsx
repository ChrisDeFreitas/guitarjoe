/*
  InfoPnl.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by QueryPnl.jsx of GuitrJoe app

*/
import React from 'react';
import PropTypes from 'prop-types';

import q from "./guitar_lib.js";


function InfoPnl( props ){
  let {qry} = props

  function fsChordClick( event ){
    let btn = event.target
    // console.log('fsChordClick', btn.dataset.note, btn.dataset.abr)

    if(btn.dataset.selected === 'label'){    //user clicked the label
      props.stateChange( 'fretSelectMatch', null )
      props.stateChange( 'noteFilter', 'clear' )
    }
    else{   //default operation
      if(qry.fretSelectMatch != null
      && qry.fretSelectMatch.note === btn.dataset.note && qry.fretSelectMatch.abr === btn.dataset.abr)    //turn off selected match
        props.stateChange( 'fretSelectMatch', null )
      else
        props.stateChange( 'fretSelectMatch', {type:'chord', note:btn.dataset.note, abr:btn.dataset.abr} )
    }
  }
  function fsScaleClick( event ){
    let btn = event.target
    // console.log('fsScaleClick', btn.dataset.note, btn.dataset.abr)

    if(btn.dataset.selected === 'label'){    //user clicked the label
      props.stateChange( 'fretSelectMatch', null )   //turn off selected match
      props.stateChange( 'noteFilter', 'clear' )
    }
    else{   //default operation
      if(qry.fretSelectMatch != null 
      && qry.fretSelectMatch.note === btn.dataset.note && qry.fretSelectMatch.abr === btn.dataset.abr)
        props.stateChange( 'fretSelectMatch', null )   //turn off selected match
      else
        props.stateChange( 'fretSelectMatch', {type:'scale', note:btn.dataset.note, abr:btn.dataset.abr} )
    }
  }
  function infoNoteClick(event){
    event.stopPropagation()

    let btn = event.target   
    if(btn.dataset.selected === 'label'){    //user clicked the label
      props.stateChange( 'fretSelectMatch', null )
      props.stateChange( 'noteFilter', 'clear' )
    }
    else {   //default operation
      if(btn.className !== 'ivl')
        btn = btn.parentNode
      
      let note = btn.dataset.note     
      if(typeof note === 'string')
        props.stateChange( 'noteFilter', note )
        // props.stateChange( 'noteFilter', note, btn.className )
    }
  }
  function invrLabelClick(event){
    event.stopPropagation()
    let btn = event.target   
    props.stateChange( 'inversionPos', btn.dataset.invr )
  }
  function drawFretSelectMatches( html, key ){    //push matching chords and scales onto html[]
    let selected = 0
    
    if(qry.fretSelect.length < 2) return null  

    let noblist = qry.fretSelect.slice()
    let last = null
    noblist = noblist.filter(function(a){   //filter duplicate notes
      if(last != null && last.notes.indexOf( a.note ) >= 0) return null
      last = a
      return a
    })

    //test chords for matching notes
    let list = []
    let lastkey = key
    let lastname = null
    last = null
    for(let chord of q.chords.list){    

      for(let iobj of q.intervals.list){  //iterate notes
        if(last != null && last.semis === iobj.semis) continue
        if(iobj.semis === 12) continue    //skip octave
        last = iobj

        let ivls = q.chords.obj( iobj.note, chord.name).ivls    
  		  let result = q.notes.match( ivls, noblist)

       if(result === true)
         list.push( {note:iobj.note, chord:chord} )
      }
    }

    for(let ob of list){    //write matching chords
      let chord = ob.chord

      if(lastkey === key){
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        html.push( <span key={++key} className='propName'
          data-selected='label' onClick={fsChordClick}
        >Matching chords:&nbsp;</span> )
      }

      selected = 0
      if(qry.fretSelectMatch != null
      && qry.fretSelectMatch.note === ob.note
      && qry.fretSelectMatch.abr === chord.abr) selected = 'fretSelectMatch'

      if(lastname !== null && lastname !== chord.name)
        html.push( <i key={++key} > &mdash; </i> )
      lastname = chord.name

      html.push( 
        <span key={++key} className='ivl' onClick={fsChordClick} title={ob.note +' ' +chord.name}
        data-note={ob.note} data-abr={chord.abr} data-selected={selected} 
        >&#8200;{ob.note}&#8239;{chord.abr}&#8200;</span> 
      )
    }

    //test scales for matching notes
    list = []
    lastkey = key
    lastname = null
    last = null
    // for(let scale of q.scales.list){   ==> disabled because most scales are not necessary for this use
    for(let scaleName of ['Major','Minor','Pen.Maj','Pen.min','Blues7','Blues6' /*,'Dbl.Hrm'*/]){
      //can optimize by caching related minor scales when major found: 
      // Major:Nat.min; Pent Maj:Pen.min,Blues7,Blues6; Dbl.Hrm:Gypsy
      for(let iobj of q.intervals.list){  //iterate notes
        if(last != null && last.semis === iobj.semis) continue
        if(iobj.semis === 12) continue    //skip octave
        last = iobj

        // let ivls = q.scales.obj( iobj.note, scale.name).ivls    
        let scale = q.scales.obj( iobj.note, scaleName )
        let ivls = scale.ivls    
  		  let result = q.notes.match( ivls, noblist)

       if(result === true) 
         list.push( {note:iobj.note, scale:scale} )
      }
    }

    for(let ob of list){    //write matching scales
      selected = 0
      let scale = ob.scale

      if(lastkey === key){
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        html.push( <span key={++key} className='propName'
          data-selected='label' onClick={fsScaleClick}
        >Matching scales:&nbsp;</span> )
      }

      if(qry.fretSelectMatch != null
      && qry.fretSelectMatch.note === ob.note
      && qry.fretSelectMatch.abr === scale.abr) selected = 'fretSelectMatch'

      if(lastname !== null && lastname !== scale.name)
        html.push( <i key={++key} > &mdash; </i> )
      lastname = scale.name

      html.push( 
        <span key={++key} className='ivl' onClick={fsScaleClick} title={ob.note +' ' +scale.name}
        data-note={ob.note} data-abr={scale.abr} data-selected={selected} 
        > &#8200;{ob.note}&#8239;{scale.short}&#8200;</span> 
      )
    }

    return key
  }

  let  selected = 0, html = [], key=0, lastkey=null

  if(qry.rootType === 'fretSelect'){    
      html.push( <span key={++key} className='propName'
         data-selected='label' onClick={infoNoteClick}
        >Fret select:&nbsp;</span> )

      let last = null
      qry.fretSelect.forEach( nobj => {
        if(last && last.note === nobj.note) return

        if(qry.noteFilter.indexOf( nobj.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        html.push( <span key={++key} className='ivl'
          onClick={infoNoteClick} data-note={nobj.note} data-selected={selected}
        >&nbsp;{nobj.note} <sub>{nobj.ivl.abr}</sub> </span> )
        last = nobj
      })

      if(qry.fretSelectMatch === null){    //no selected chord or scale to draw
        if(qry.collapsed !== true){
          html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
          html.push( <span key={++key} className='propName'
           data-selected='label' onClick={infoNoteClick}
          > &nbsp;</span> )
        }
      }
      else{    //draw user select chord or scale match
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
         html.push( <span key={++key} className='propName'
         data-selected='label' onClick={infoNoteClick}
        >Selected, {qry.fretSelectMatch.obj.fullName}:&nbsp;</span> )

        for(let ivl of qry.fretSelectMatch.obj.ivls){   
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0

          html.push( <span key={++key} className='ivl' onClick={infoNoteClick}
            data-note={ivl.note} data-selected={selected}
          >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
        }
      }

    if(qry.collapsed !== true){
      key = drawFretSelectMatches( html, key )
    }
  } else
  if(qry.rootType === 'selNote' && props.selNoteVal === 'All'){    //special case
    html.push( <span key={++key} className='propName'
       data-selected='label' onClick={infoNoteClick}
      >{'All Notes'}</span> )

    if(qry.octave !== 0){
      html.push( <span key={++key} className='ivl'>{': Octave '}{qry.octave} </span> )
    }
  }
  else{   //draw scale, chord and interval labels and notes
    lastkey = key
    if(qry.scale !== null){
      // html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
      html.push( <span key={++key} className='propName'
         data-selected='label' onClick={infoNoteClick}
        >{qry.root.note +' ' +qry.scale.name +':'}</span> )
      qry.scale.ivls.forEach( ivl => {
        if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        html.push( <span key={++key} className='ivl'
          onClick={infoNoteClick} data-note={ivl.note} data-selected={selected}
        >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
      })
    }
    if(qry.chord !== null){
      if(lastkey !== key)
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)

      html.push( <span key={++key} className='propName'
         data-selected='label' onClick={infoNoteClick}
        >{qry.root.note 
        +(qry.rootType === 'fretRoot' ?qry.root.octave :'')
        +' ' +qry.chord.name +':'}</span> )

      qry.chord.ivls.forEach( ivl => {
        if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0

        html.push( <span key={++key} className='ivl'
          onClick={infoNoteClick} data-note={ivl.note} data-selected={selected}
         >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
      })

      if(qry.inversions !== null){    //draw inversions for major chords
        let invrs = qry.inversions
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)

        html.push( <span key={++key} className='propName'
         data-selected='label' onClick={infoNoteClick}
        >{invrs.root 
         +(qry.rootType === 'fretRoot' ?qry.root.octave :'')
         +qry.chord.abr +' Inversions:'}</span> )

        for(let pos in invrs.positions){
          let obj = invrs.positions[ pos ]
          selected = (qry.inversionPos === pos ?'invr' :'')
          html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
          html.push( <span key={++key} className='ivl' onClick={invrLabelClick}
            data-selected={selected} data-invr={pos}
            > {pos +' Position: '}</span> )
          for(let num in obj){
            let ivl = obj[num]
            // let octave = ivl.octave
            let octave = ([0,1].indexOf(ivl.octave) >= 0 ?'' :ivl.octave)
            if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
            else selected = 0

            html.push( <span key={++key} className='ivl'
              onClick={infoNoteClick} data-note={ivl.note} data-selected={selected}
             >&nbsp;{ivl.note +octave} <sub>{ivl.abr}</sub> </span> )
          }
        }
      }

    }
    if(qry.ivl !== null){
      if(qry.noteFilter.indexOf( qry.ivl.note ) >= 0) selected = 'noteFilter'
      else selected = 0
      
      if(lastkey !== key)
        html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)

      html.push( <span key={++key} className='propName'
       data-selected='label' onClick={infoNoteClick}
      >{qry.note 
        +(qry.rootType === 'fretRoot' ?qry.root.octave :'')
        +' + ' 
        +qry.ivl.name +':'
       }</span> )
  
      html.push( <span key={++key} className='ivl' onClick={infoNoteClick}
        data-note={qry.ivl.note} data-selected={selected}
      >&nbsp;{qry.ivl.note}<sub>{qry.ivl.abr}</sub></span> )
    }
  }
  
  if(html.length === 0) return null
  return (
    <div className='infoPnl'>
       <div className='infoDiv'>
         {html}
       </div>
    </div>
  )      
}
 
 InfoPnl.propTypes = {
  qry: PropTypes.object,
  selNoteVal: PropTypes.string,
  fretSelectFind: PropTypes.func,
  stateChange: PropTypes.func,
}

export default InfoPnl
