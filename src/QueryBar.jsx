/*
  QueryBar.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - used by QueryPnl.jsx of GuitrJoe app

*/
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { motion, useAnimation } from "framer-motion"

import './Fretboard.css'
import q from "./guitar_lib.js"

var last = {}    //store last query params to allow reset via label.click
var firstRender = true

function QueryBar( props ){
  // console.log('QueryBar.render()', props)

  let {qry} = props
  let htmlReturned = false    //prevent useEffect from running when no components returned

  const aniControl = useAnimation()
  const changeHandlerTag = 'QueryCtrlHandler'

  function aniComplete( variantName ){
    if(variantName === 'Close'){
      props.stateChange( 'changeHandled', changeHandlerTag )
    }
  }
  useEffect(() => {
    if( htmlReturned === false ) return

    if(props.setChangeHandler !== undefined){

      props.setChangeHandler(
        changeHandlerTag,
        function( newqry, tag ){    // test function
        
          firstRender = ( qry.mode === 'fretSelect' && newqry.mode !== 'fretSelect' )
        
          if( newqry.mode === 'fretSelect' ){
            return true
          }
          return false
        },
        function( newqry, tag ){   // exec function
          // ??? does not write: console.log( 444 )
          aniControl.start('Close')
          // for testing, to cancel this activity:
          //   props.stateChange( 'changeHandled', changeHandlerTag )
          return true
        } 
      )
    }

    let val = (props.qry.collapsed === true ?'Collapsed' :'Open')
    aniControl.start( val )
  
  })

  function selLabelClick( event ){     //toggle select values
    let lbl = event.target,
      val = lbl.dataset.selected
    if(val === 'true'){   //toggle selection off
      if(lbl.dataset.type === 'note'){
        if(qry.mode === '') return
        
        last['mode'] = qry.mode

        if(last.mode === 'AllNotes'){
          last['root'] = 'All'
          props.stateChange( 'selNoteVal', '' )
        }else
        if(last.mode === 'noteSelect'){
          last['root'] = qry.root
          props.stateChange( 'selNoteVal', '' )
        }else
        if(last.mode === 'fretRoot'){
          last['root'] = qry.root
          props.stateChange( 'fretRoot', null )
        }
      }else
      if(lbl.dataset.type === 'octave'){
        last['octave'] = qry.octave
        props.stateChange( 'octave', 0 )
      }else
      if(lbl.dataset.type === 'scale'){
        if(qry.scale === null) return
        last['scaleName'] = qry.scale.name
        props.stateChange( 'scaleName', '' )
      }else
      if(lbl.dataset.type === 'chord'){
        if(qry.chord === null) return
        last['chordName'] = qry.chord.name
        props.stateChange( 'chordName', '' )
      }else
      if(lbl.dataset.type === 'ivlName'){
        if(qry.ivl != null)
          last['ivlName'] = qry.ivl.abr
        props.stateChange( 'ivlName', '' )
      }
    }
    else{   //toggle selection on
      if(lbl.dataset.type === 'note'){
        if( !last.mode ) return
        if(last.mode === 'AllNotes')
          props.stateChange( 'selNoteVal', 'All' )
        else
        if(last.mode === 'noteSelect'){
          if(last['root'] !== null)
            props.stateChange( 'selNoteVal', last['root'].note )
        } else
        if(last.mode === 'fretRoot'){
          if(last['root'] !== null)
            props.stateChange( 'fretRoot', last['root'] )
        }
      }else
      if(lbl.dataset.type === 'octave'){
        if(last.octave)
          props.stateChange( 'octave', last.octave )
      }else
      if(lbl.dataset.type === 'scale'){
        if(last.scaleName){
          props.stateChange( 'scaleName', last.scaleName )
        }
      }else
      if(lbl.dataset.type === 'chord'){
        if( last.chordName ){
          props.stateChange( 'chordName', last.chordName )
        }
      }else
      if(lbl.dataset.type === 'ivlName'){
        if(last.ivlName)
          props.stateChange( 'ivlName', last.ivlName )
      }
    }
  }
  function selNoteChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    props.stateChange( 'selNoteVal', val )
    //   this.props.dispatch({ type:"FretboardActions/semisUpdate", val })
  }
  function selOctaveChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    if(val === '')
      props.stateChange( 'octave', 0 )
    else
      props.stateChange( 'octave', Number(val) )
  }
  function selScaleChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    props.stateChange( 'scaleName', val )
  }
  function selChordChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text.trim()
    props.stateChange( 'chordName', val )
  }
  function selIntervalChange( event ){
    let sel = event.target,
      opt = sel.options[sel.selectedIndex],
      abr = opt.dataset.abr
    props.stateChange( 'ivlName', abr )
  }
  
  // draw controls
  function drawSelNote(){
    let list = [<option key='' ></option>,<option key='999' >All</option>]
    for(let ii=0; ii < q.notes.list.length; ii++){
      let note = q.notes.list[ii]
      list.push(<option key={ii} >{note}</option>)
    }

    let note = (qry.note === null ?'' :qry.note)
    return (
      <div className='dataPnl pnlNote' >
        <label data-loaded={ qry.mode !== '' || last.root !== undefined } 
          data-selected={note !== ''} data-type='note' onClick={selLabelClick} >Note</label>
        <select value={note} className='selNote' onChange={selNoteChange} >{list}</select>
      </div>
    )
  }
  function drawSelOctave(){
    let oct = qry.octave,
      omin = 0, omax = 0,
      list = [<option key={999} ></option>]

    omin = q.notes.obj(6, 0).octave
    omax = q.notes.obj(1, q.fretboard.fretMax).octave

    for(let ii = omax; ii >= omin; ii--){
      list.push(<option key={ii} >{ii}</option>)
    }
    return (
      <div className='dataPnl pnlOctave' >
        <label data-loaded={ oct !== 0 || last.octave !== undefined } 
          data-selected={oct !== 0} data-type='octave' onClick={selLabelClick} >Octave</label>
        <select value={oct} className='selOctave' onChange={selOctaveChange}>
           {list}
        </select>      
      </div>
    )
  }
  function drawSelScale(){
    let selected = (qry.scale === null ?'' :qry.scale.name),
      ii=0, list = [<option key='aaa'></option>]
    for(let scale of q.scales.list){
      list.push(<option key={++ii} >{scale.name}</option>)
    }
    return (
      <div className='dataPnl pnlScale' >
        <label data-loaded={ selected !== '' || last.scaleName !== undefined } 
          data-selected={selected !== ''} data-type='scale' onClick={selLabelClick} >Scale</label>
        <select value={selected} className='selScale' onChange={selScaleChange} >
          {list}
        </select>      
      </div>
    )
  }
  function drawSelChord(){
    let ii = 0,
      selected = (qry.chord === null ?'' :qry.chord.name), 
      datastate = '',
      list = [<option key='aaa'></option>]
    for(let chd of q.chords.list){
      list.push(<option key={++ii} >{chd.name}</option>)
    }
    if(selected !== '') datastate = 'chord'
    return (
      <div className='dataPnl pnlChord' >
        <label data-loaded={ selected !== '' || last.chordName !== undefined } 
          data-selected={selected !== ''} data-type='chord' onClick={selLabelClick} >Chord</label>
        <select value={selected} className='selChord' onChange={selChordChange} 
         data-state={datastate}>
          {list}
        </select>      
      </div>
    )
  }
  function drawSelInterval(){
    let list = [<option key='aaa' data-abr='' ></option>],
      ii = 0, selected = '' , datastate = ''
    for(let ivl of q.intervals.list){
      if(ivl.semis === 0) continue
      if(ivl.semis === 12) continue
      // if(ivl.abr === last) continue  should be unique
      let html = `${ivl.name} (${ivl.abr}, ${ivl.semis})`
      list.push(<option key={++ii} data-abr={ivl.abr} >{html}</option>)
      if(qry.ivl !== null && selected === '' && qry.ivl.abr === ivl.abr)
        selected = html
      // last = ivl.abr
    }
    if(selected !== '') datastate = 'interval'
    return (
      <div className='dataPnl pnlInterval' >
        <label data-loaded={ selected !== '' || last.ivlName !== undefined } 
          data-selected={selected !== ''} data-type='ivlName' onClick={selLabelClick} >Interval</label>
        <select value={selected} className='selInterval' title='Intervals sorted by semis-tones'
          data-state={datastate} onChange={selIntervalChange} 
        >
          {list}
        </select>      
      </div>
    )
  }  


  if(qry.mode === 'fretSelect') return null
  htmlReturned = true

  let initial = (firstRender === true ?'Close' :'Open')
  if( qry.collapsed === true ) initial = 'Collapsed'

  return (
    <motion.div className='queryBar' data-mode={qry.mode} 
      initial={initial}
      animate={aniControl}
      variants={{
        Close: { height: '0px', opacity:0 },
        Collapsed: { height:'0px', opacity:0 },
        Open: { height:'auto', opacity:1 },
      }}
      transition={{ease:"easeOut", duration:0.3 }}
      // transitionEnd:{}
      onAnimationComplete={aniComplete}
    >
      {drawSelNote()}
      {drawSelOctave()}
      {drawSelScale()}
      {drawSelChord()}
      {drawSelInterval()}
    </motion.div>
  )

}

QueryBar.propTypes = {
  qry: PropTypes.object,
  stateChange: PropTypes.func,
  setChangeHandler: PropTypes.func,
}

export default QueryBar