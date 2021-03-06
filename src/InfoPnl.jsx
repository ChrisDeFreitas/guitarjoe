/*
  InfoPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by QueryPnl.jsx of GuitrJoe app

*/
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { motion, useAnimation } from "framer-motion"

import './InfoPnl.scss'
import ArrowPnl from './controls/ArrowPnl'
import q from "./guitar_lib.js"

let scaleFirstRender = false
let chordFirstRender = false

function InfoPnl( props ){
  // console.log('InfoPnl.render()', props)

  let {qry} = props
  let htmlReturned = false    //prevent useEffect when no components returned
  
  const thisAniControl = useAnimation()
  const scaleAniControl = useAnimation()
  const chordAniControl = useAnimation()

  const changeHandlerTag = 'InfoPnlHandler'
  const scaleHandlerTag = 'scaleHandler'
  const chordHandlerTag = 'chordHandler'

  useEffect(() => {     //changeHandler and aniControl.start code here
    if(htmlReturned === false) return

    if(props.setChangeHandler !== undefined){
      props.setChangeHandler(
        changeHandlerTag,
        changeHandlerTest,
        function( newqry, tag ){   // exec function
          thisAniControl.start('Close')
          // for testing, to cancel this activity:
          //   props.stateChange( 'changeHandled', changeHandlerTag )
        } 
      )
      props.setChangeHandler(
        scaleHandlerTag,
        changeHandlerTest,
        function( newqry, tag ){   // exec function
          scaleAniControl.start('Close')
        } 
      )    
      props.setChangeHandler(
        chordHandlerTag,
        changeHandlerTest,
        function( newqry, tag ){   // exec function
          chordAniControl.start('Close')
        } 
      )    
    }

    thisAniControl.start('Open')
    if(qry.scale !== null){
      scaleAniControl.start( qry.scaleTriadDisplay )
    }
    if(qry.chord !== null){
      chordAniControl.start( qry.chordInvrDisplay )
    }
  })
  function aniComplete( arrowTitle, variantName ){

    if(arrowTitle === 'Close'){

      props.stateChange( 'changeHandled', changeHandlerTag )

    } else
    if(arrowTitle.indexOf( 'scale') >= 0){

      if( variantName === 'Close' ){
        props.stateChange( 'changeHandled', scaleHandlerTag )
      }

    }else
    if(arrowTitle.indexOf( 'chord') >= 0){

      if( variantName === 'Close' ){
        props.stateChange( 'changeHandled', chordHandlerTag )
      }
  
    }
  }
  function changeHandlerTest( newqry, tag ){
    if( tag === changeHandlerTag ){

      if(qry.mode === 'fretSelect' && newqry.mode !== 'fretSelect')
        return true
      if(newqry.mode === 'AllNotes' && (qry.scale !== null || qry.chord !== null))
        return true
  
    } else
    if( tag === scaleHandlerTag ){

      scaleFirstRender = (qry.scale === null)
      if(qry.scale !== null && newqry.scale === null)
        return true

    } else
    if( tag === chordHandlerTag ){

      chordFirstRender = (qry.chord === null)
      if(qry.chord !== null && newqry.chord === null)
        return true

    }
    return false
  }


  function chordShapeClick(event){
    event.stopPropagation()
    let btn = event.target   
    props.stateChange( 'chordShape', btn.dataset.shape )
  }
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
  function infoItemClick(event){
    event.stopPropagation()

    let btn = event.target   
    if(btn.dataset.selected === 'label'){    //user clicked the label
      props.stateChange( 'fretSelectMatch', null )
      props.stateChange( 'chordInvrSelected', null )
      props.stateChange( 'noteFilter', 'clear' )
      props.stateChange( 'scaleTriadSelected', null )
      props.stateChange( 'chordShape', null )
    }
    else {   //default noteFilter: highlight all NoteButtons with selected note
      if(btn.className !== 'ivl')
        btn = btn.parentNode
      
      let note = btn.dataset.note     
      if(typeof note === 'string')
        props.stateChange( 'noteFilter', note )
    }
  }
  function invrLabelClick(event){
    event.stopPropagation()
    let btn = event.target   
    props.stateChange( 'chordInvrSelected', btn.dataset.invr )
  }
  function triadLabelClick(event){
    event.stopPropagation()
    let btn = event.target   
    props.stateChange( 'scaleTriadSelected', btn.dataset.scaletriad )
  }
  
  function toggleFretSelectMatchDisplay(){
    let ss = (qry.fretSelectMatchDisplay === 'Show' ?'Collapse' :'Show')
    props.stateChange( 'fretSelectMatchDisplay', ss)
  }
  function toggleScaleTriadDisplay(){
    let ss = (qry.scaleTriadDisplay === 'Show' ?'Collapse' :'Show')
    props.stateChange( 'scaleTriadDisplay', ss)
  }
  function toggleChordInvrDisplay(){
    let ss = (qry.chordInvrDisplay === 'Show' ?'Collapse' :'Show')
    props.stateChange( 'chordInvrDisplay', ss)
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
    for(let scale of q.scales.list){   //==> disabled because most scales are not necessary for this use
    //for(let scaleName of ['Major','Minor','Pen.Maj','Pen.min','Blues7','Blues6' /*,'Dbl.Hrm'*/]){

      //can optimize by caching related minor scales when major found: 
      //  Major:Nat.min; Pent Maj:Pen.min,Blues7,Blues6; Dbl.Hrm:Gypsy

      for(let iobj of q.intervals.list){  //iterate notes
        if(last != null && last.semis === iobj.semis) continue
        if(iobj.semis === 12) continue    //skip octave
        last = iobj

        let ivls = q.scales.obj( iobj.note, scale.name).ivls    
        // let scale = q.scales.obj( iobj.note, scaleName )
        // let ivls = scale.ivls    
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


  let selected = 0, html = [], key=0 //, lastkey=null
  let  //for ArrowPnl
    arrowTitle, arrowFunc, openState, aniControl,
    htmlCaption = [], htmlItems = []    

  if(qry.mode === 'AllNotes'){
    let octave = (qry.octave === 0 ?null :<span key={++key} className='ivl'>{': Octave '}{qry.octave} </span>)
    html.push( <div key={++key} className='ArrowPnl' >
      <span key={++key} className='propName'
       data-selected='label' onClick={infoItemClick}
      >{'All Notes'}</span> 
      {octave}
    </div>)

  } else
  if(qry.mode === 'fretSelect'){    
      htmlCaption = []
      htmlItems = []

      htmlCaption.push( <span key={++key} className='propName' onClick={infoItemClick} data-selected='label'>{
          'Fret select: '
        }</span> 
      )

      let last = null
      qry.fretSelect.forEach( nobj => {
        if(last && last.note === nobj.note) return

        if(qry.noteFilter.indexOf( nobj.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        htmlCaption.push( 
          <span key={++key} className='ivl' onClick={infoItemClick} data-note={nobj.note} data-selected={selected} >
             &nbsp;{nobj.note} <sub>{nobj.ivl.abr}</sub> 
          </span> 
        )
        last = nobj
      })

      if(qry.fretSelectMatch === null){    //no selected chord or scale to draw
          htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
          htmlItems.push( <span key={++key} className='propName'
           data-selected='label' onClick={infoItemClick}
          > &nbsp;</span> )
      }
      else{    //draw user select chord or scale match
        htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        htmlItems.push( 
          <span key={++key} className='propName' onClick={infoItemClick} data-selected='label' >
            Selected, {qry.fretSelectMatch.obj.fullName}:&nbsp;
          </span> 
        )

        for(let ivl of qry.fretSelectMatch.obj.ivls){   
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0

          htmlItems.push( 
            <span key={++key} className='ivl' onClick={infoItemClick} data-note={ivl.note} data-selected={selected} >
              &nbsp;{ivl.note} <sub>{ivl.abr}</sub> 
            </span> 
          )
        }

      }
      key = drawFretSelectMatches( htmlItems, key )

      arrowTitle = 'Show/hide matching chords and scales'
      arrowFunc = toggleFretSelectMatchDisplay
      openState = qry.fretSelectMatchDisplay

      html.push(<ArrowPnl 
        key={++key} 
        caption={htmlCaption}
        items={htmlItems}
        arrowWidth='1em' 
        arrowTitle={arrowTitle} 
        onChange={arrowFunc}
        openState={openState} 
      />)
  }
  else{   //draw scale, chord and interval labels and notes
    //lastkey = key
    if(qry.scale !== null){
      htmlCaption = []
      htmlItems = []

      htmlCaption.push( 
        <span key={++key} className='propName' onClick={infoItemClick} data-selected='label' >
          {qry.root.note +' ' +qry.scale.name +': '}
        </span> 
      )
      qry.scale.ivls.forEach( ivl => {
        if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        htmlCaption.push(
          <span key={++key} className='ivl' onClick={infoItemClick} 
            data-note={ivl.note} data-selected={selected}
          >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> 
          </span> 
        )
      })

      if( qry.scaleTriads !== null ){   // draw scale degree triads
        htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        htmlItems.push( 
          <span key={++key} className='propName' onClick={infoItemClick} data-selected='label' >{ 
            qry.root.note +' ' +qry.scale.abr +' Scale Degree Triads:'
          }</span> 
        )

        qry.scaleTriads.list.forEach( triad => {
          htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
          
          if( qry.scaleTriadSelected === triad.num ) selected = 'triad'
          else selected = 0
          let ss = (triad.abr !== null ?triad.abr :'')
          
          htmlItems.push( 
            <span key={++key} className='ivl' onClick={triadLabelClick}
             data-scaletriad={triad.num} data-selected={selected} >{
              triad.degree +'. ' + triad.root +ss +': '
            }</span> 
          )

          triad.ivls.forEach( ivl => {
            if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
            else selected = 0

            htmlItems.push( 
              <span key={++key} className='ivl' onClick={infoItemClick}
               data-note={ivl.note} data-selected={selected}
              >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> 
              </span>
            )
          })
        })
      }

      arrowTitle = 'Show/hide scale degree triads'
      arrowFunc = toggleScaleTriadDisplay
      aniControl = scaleAniControl
      openState = (scaleFirstRender ?'Close' :qry.scaleTriadDisplay)

      html.push(<ArrowPnl 
        key={++key} 
        caption={htmlCaption}
        items={htmlItems}
        arrowWidth='1em' 
        arrowTitle={arrowTitle} 
        aniControl={aniControl}
        onAniComplete={aniComplete}
        onChange={arrowFunc}
        openState={openState} 
      />)
    }
    if(qry.chord !== null){
      htmlCaption = []
      htmlItems = []

      htmlCaption.push(     //chord caption
        <span key={++key} className='propName' onClick={infoItemClick} data-selected='label'>
          {qry.root.note 
            +' ' +qry.chord.name +': '}
        </span> 
      )

      qry.chord.ivls.forEach( ivl => {    //chord intervals
        if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0

        htmlCaption.push( 
          <span key={++key} className='ivl' onClick={infoItemClick} 
            data-note={ivl.note} data-selected={selected}
          >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> 
          </span> 
        )
      })

      
      if(['maj','min','7'].indexOf(qry.chord.abr) >= 0 ){ //draw chord shapes
        htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        htmlItems.push(
          <span key={++key} className='propName' onClick={infoItemClick} data-selected='label'>
            Bar Chord Shapes:&nbsp;
          </span> 
        )
        let list = q.chords.shapesByChord( qry.chord.abr )
        for( let shape of list ){
          if(qry.chordShape === shape.abr) selected = 'chordShape'
          else selected = 0

          htmlItems.push( 
            <span key={++key} className='ivl' onClick={chordShapeClick} 
              data-shape={shape.abr} data-selected={selected} title={shape.name +' shape'}>
              &nbsp;{shape.abr}&nbsp; 
            </span> 
          )
        }
      }

      if( qry.inversions !== null ){    //draw inversions
        let invrs = qry.inversions
        htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)

        htmlItems.push( 
          <span key={++key} className='propName' onClick={infoItemClick}
            data-selected='label'>{
            invrs.root 
            +(qry.mode === 'fretRoot' ?qry.root.octave +' ' :'')
            +qry.chord.abr +' Inversions:'
           }</span> 
         )

        for(let pos in invrs.positions){
          let pobj = invrs.positions[ pos ]
          selected = (qry.chordInvrSelected === pos ?'invr' :'')
          htmlItems.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
          htmlItems.push( 
            <span key={++key} className='ivl' onClick={invrLabelClick}
             data-selected={selected} data-invr={pos}>{
              pos +' Position: '
            }</span> 
          )
          for(let num in pobj){
            let iobj = pobj[num]
            let octave = ([0,1].indexOf(iobj.octave) >= 0 ?'' :iobj.octave)
            if(qry.noteFilter.indexOf( iobj.note ) >= 0) selected = 'noteFilter'
            else selected = 0

            htmlItems.push( 
              <span key={++key} className='ivl' onClick={infoItemClick}
               data-note={iobj.note} data-selected={selected}
              >&nbsp;{iobj.note +octave} <sub>{iobj.abr}</sub> 
              </span>
            )
          }
        }

        htmlItems.push( 
          <span key={++key} className='propName'  data-selected='note'>
            Note: some inversions can not be displayed, see "About" for details.
          </span>
         )
        
      }

      arrowTitle = 'Show/hide chord inversions'
      arrowFunc = toggleChordInvrDisplay
      aniControl = chordAniControl
      openState = (chordFirstRender ?'Close' :qry.chordInvrDisplay)

      html.push(<ArrowPnl 
        key={++key} 
        caption={htmlCaption}
        items={htmlItems}
        arrowWidth='1em' 
        arrowTitle={arrowTitle} 
        aniControl={aniControl}
        onAniComplete={aniComplete}
        onChange={arrowFunc}
        openState={openState} 
      />)
    }
    if(qry.ivl !== null){
      if(qry.noteFilter.indexOf( qry.ivl.note ) >= 0) selected = 'noteFilter'
      else selected = 0
      
      html.push( <div key={++key} className='ArrowPnl' >
        <span key={++key} className='propName' onClick={infoItemClick} data-selected='label' 
        >{qry.note 
          +(qry.mode === 'fretRoot' ?qry.root.octave :'')
          +' + ' +qry.ivl.name +' interval:'
        }</span>
        <span key={++key} className='ivl' onClick={infoItemClick} data-note={qry.ivl.note} data-selected={selected}>
          &nbsp;{qry.ivl.note}&nbsp;<sub>{qry.ivl.abr}</sub>
        </span> 
      </div> )
    }
  }
  
  if(html.length === 0){
    return null
  } 
  htmlReturned = true

  return (
    <motion.div className='infoPnl'
      initial={(qry.mode === 'fretSelect' ?'Close' :'Open')}
      animate={thisAniControl}
      variants={{
        Open: { height: 'auto', opacity:1 },
        Close: { height: '0px', opacity:0 },
      }}
      transition={{ ease:"easeOut", duration:0.3 }}
      onAnimationComplete={aniComplete}
    >
      {html}
    </motion.div>
  )      
}

InfoPnl.propTypes = {
  qry: PropTypes.object,
  stateChange: PropTypes.func,
  setChangeHandler: PropTypes.func,
}

export default InfoPnl