/*
  QueryPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - manage query controls for GuitarJoe app

*/
import React from 'react'

import ArrowButton from './controls/ArrowButton'
import InfoPnl from "./InfoPnl"
import q from "./guitar_lib.js"


class QueryPnl extends React.Component {

  constructor(props){
    super(props)

    this.btnDupeClick = this.btnDupeClick.bind(this)
    this.btnDelClick = this.btnDelClick.bind(this)

    this.last = {}    //store last query params before reset via label.click
    this.selLabelClick = this.selLabelClick.bind(this)
    this.selChordChange = this.selChordChange.bind(this)
    this.btnClearClick = this.btnClearClick.bind(this)
    this.btnCollapseClick = this.btnCollapseClick.bind(this)
    this.selIntervalChange = this.selIntervalChange.bind(this)
    this.selNoteChange = this.selNoteChange.bind(this)
    this.selOctaveChange = this.selOctaveChange.bind(this)
    this.selScaleChange = this.selScaleChange.bind(this)
  }

  //event handlers
  btnDelClick(){
    this.props.remove()
  }
  btnDupeClick(){
    this.props.duplicate()
  }
  btnCollapseClick( upordn ){
    let val = !this.props.qry.collapsed
    this.props.stateChange( 'collapsed', val )
  }
  btnClearClick(){
    // this.props.dispatch({ type:"FretboardActions/fretFirstUpdate", payload:'' })
    this.props.reset()
  }
  selLabelClick( event ){     //reset param to off value
    let qry = this.props.qry,
      lbl = event.target,
      val = lbl.dataset.selected
    // console.log('last', this.last)
    if(val === 'true'){
      if(lbl.dataset.type === 'note'){
        if(qry.rootType === '') return
        
        this.last['rootType'] = qry.rootType
        this.last['root'] = qry.root
        if(this.last['rootType'] === 'selNote')
          this.props.stateChange( 'selNoteVal', '' )
        if(this.last['rootType'] === 'fretRoot')
          this.props.stateChange( 'fretRoot', null )
      }else
      if(lbl.dataset.type === 'chord'){
        if(qry.chord === null) return
        this.last['chordName'] = qry.chord.name
        this.props.stateChange( 'chordName', '' )
      }else
      if(lbl.dataset.type === 'scale'){
        if(qry.scale === null) return
        this.last['scaleName'] = qry.scale.name
        this.props.stateChange( 'scaleName', '' )
      }else
      if(lbl.dataset.type === 'octave'){
        this.last['octave'] = qry.octave
        this.props.stateChange( 'octave', 0 )
      }else
      if(lbl.dataset.type === 'ivlName'){
        this.last['ivlName'] = this.props.ivlName
        this.props.stateChange( 'ivlName', '' )
      }
    }
    else{   //allow toggling param on and off
      if(lbl.dataset.type === 'note'){
        if( !this.last.rootType ) return
        if(this.last.rootType === 'selNote'){
          if(this.last['root'] !== null)
            this.props.stateChange( 'selNoteVal', this.last['root'].note )
        } else
        if(this.last.rootType === 'fretRoot'){
          if(this.last['root'] !== null)
            this.props.stateChange( 'fretRoot', this.last['root'] )
        }
      }else
      if(lbl.dataset.type === 'chord'){
        if(this.last['chordName'] && this.last['chordName'] !== '')
          this.props.stateChange( 'chordName', this.last['chordName'] )
      }else
      if(lbl.dataset.type === 'scale'){
        if(this.last['scaleName'] && this.last['scaleName'] !== '')
          this.props.stateChange( 'scaleName', this.last['scaleName'] )
      }else
      if(lbl.dataset.type === 'octave'){
        if(this.last['octave'] && this.last['octave'] !== '')
          this.props.stateChange( 'octave', this.last['octave'] )
      }else
      if(lbl.dataset.type === 'ivlName'){
        if(this.last['ivlName'] && this.last['ivlName'] !== '')
          this.props.stateChange( 'ivlName', this.last['ivlName'] )
      }
    }
  }
  selNoteChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    this.props.stateChange( 'selNoteVal', val )
    //   this.props.dispatch({ type:"FretboardActions/semisUpdate", val })
  }
  selOctaveChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    if(val === '')
      this.props.stateChange( 'octave', 0 )
    else
      this.props.stateChange( 'octave', Number(val) )
  }
  selIntervalChange( event ){
    let sel = event.target,
      opt = sel.options[sel.selectedIndex],
      abr = opt.dataset.abr
    this.props.stateChange( 'ivlName', abr )
  }
  selChordChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    this.props.stateChange( 'chordName', val )
  }
  selScaleChange( event ){
    let sel = event.target,
      val = sel.options[sel.selectedIndex].text
    this.props.stateChange( 'scaleName', val )
  }

  // draw controls
  drawSelNote(){
    let qry = this.props.qry,
      list = [<option key='' ></option>,<option key='999' >All</option>]
    for(let ii=0; ii < q.notes.list.length; ii++){
      let note = q.notes.list[ii]
      list.push(<option key={ii} >{note}</option>)
    }

    let note = (qry.note === null ?'' :qry.note)
    return (
      <div className='dataPnl pnlNote'>
        <label data-selected={note !== ''} data-type='note' onClick={this.selLabelClick} >Note</label>
        <select value={note} className='selNote' onChange={this.selNoteChange} >{list}</select>
      </div>
    )
  }
  drawSelOctave(){
    let qry = this.props.qry,
      oct = qry.octave,
      omin = 0, omax = 0,
      list = [<option key={999} ></option>]

    omin = q.notes.obj(6, 0).octave
    omax = q.notes.obj(1, q.fretboard.fretMax).octave

    for(let ii = omax; ii >= omin; ii--){
      list.push(<option key={ii} >{ii}</option>)
    }
    return (
      <div className='dataPnl pnlOctave'>
        <label data-selected={oct !== 0} data-type='octave' onClick={this.selLabelClick} >Octave</label>
        <select value={oct} className='selOctave' onChange={this.selOctaveChange}>
           {list}
        </select>      
      </div>
    )
  }
  drawSelScale(){
    let selected = this.props.scaleName,
      ii=0, list = [<option key='aaa'></option>]
    for(let scale of q.scales.list){
      list.push(<option key={++ii} >{scale.name}</option>)
    }
    return (
      <div className='dataPnl pnlScale'>
        <label data-selected={selected !== ''} data-type='scale' onClick={this.selLabelClick} >Scale</label>
        <select value={selected} className='selScale' onChange={this.selScaleChange} >
          {list}
        </select>      
      </div>
    )
  }
  drawSelChord(){
    let ii = 0,
      selected = this.props.chordName, 
      datastate = '',
      list = [<option key='aaa'></option>]
    for(let chd of q.chords.list){
      list.push(<option key={++ii} >{chd.name}</option>)
    }
    if(selected !== '') datastate = 'chord'
    return (
      <div className='dataPnl pnlChord'>
        <label data-selected={selected !== ''} data-type='chord' onClick={this.selLabelClick} >Chord</label>
        <select value={selected} className='selChord' onChange={this.selChordChange} 
         data-state={datastate}>
          {list}
        </select>      
      </div>
    )
  }
  drawSelInterval(){
    let qry = this.props.qry,
      list = [<option key='aaa' ></option>],
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
        <label data-selected={selected !== ''} onClick={this.selLabelClick} 
          data-type='ivlName' >Interval</label>
        <select value={selected} className='selInterval' title='Intervals sorted by semis-tones'
          data-state={datastate} onChange={this.selIntervalChange} 
        >
          {list}
        </select>      
      </div>
    )
  }  

  render(){
    // console.log('queryPnl.render()', this.props)
    let qry = this.props.qry
    let qryBtnClass = (qry.collapsed ?'qryBtnSmall' :'qryBtn')
    let qryDisplayClass = (qry.collapsed ?'queryPnlHide' :'queryPnlShow')
    let qryDisplay = (qry.collapsed ?'dn' :'up')
    let qryDisplayTtl = (qry.collapsed ?'Show Query panel' :'Hide Query panel')
    let qryDisplayWdth = (qry.collapsed ?'1.5em' :'2em')

    let selNote = null
    let selOct = null
    let selInt = null
    let selScale = null
    let selChord = null
    if(qry.rootType !== 'fretSelect') { //optimization
      selNote = this.drawSelNote()
      selOct = this.drawSelOctave()
      selInt = this.drawSelInterval()
      selScale = this.drawSelScale()
      selChord = this.drawSelChord()
    }

    return (
      <div className={'queryPnl '+qryDisplayClass} >
        <table className='tbQuery' ><tbody><tr>
        <td className='qryBtnsLeft'>
           <ArrowButton upOrDn={qryDisplay} width={qryDisplayWdth} title={qryDisplayTtl} onChange={this.btnCollapseClick}/>
        </td><td className='qryContent'>
          <div className='queryControls' data-roottype={qry.rootType}>
            {selNote}
            {selOct}
            {selScale}
            {selChord}
            {selInt}
          </div>
          <InfoPnl 
            qry={qry} 
            selNoteVal={this.props.selNoteVal}
            fretSelectFind={this.props.fretSelectFind}
            stateChange={this.props.stateChange}
           />    
        </td><td className='qryBtnsRight'>
            <div className={qryBtnClass +' qryBtnClear'} onClick={this.btnClearClick} title='Reset query controls'>&#8635;</div>
            <div className={qryBtnClass +' qryBtnDupe'} onClick={this.btnDupeClick} title='Duplicate fretboard' >&#10010;</div>
            { qry.fbid === 0 ?null
              :<div className={qryBtnClass +' qryBtnDel'} onClick={this.btnDelClick} title='Remove this fretboard' >&#10000;</div>
            }
        </td></tr></tbody></table>
      </div>
    )
  }
}

export default QueryPnl
