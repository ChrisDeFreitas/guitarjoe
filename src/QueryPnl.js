/*
  QueryPnl.js
  - by Chris DeFreitas, chrisd@europa.com
  - manage query controls for GuitarJoe app

*/
import React from 'react'
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
    // this.selFretNoChange = this.selFretNoChange.bind(this)
    this.selIntervalChange = this.selIntervalChange.bind(this)
    this.selNoteChange = this.selNoteChange.bind(this)
    this.selOctaveChange = this.selOctaveChange.bind(this)
    this.selScaleChange = this.selScaleChange.bind(this)
    this.infoNoteClick = this.infoNoteClick.bind(this)
  }

  //event handlers
  btnDelClick(){
    this.props.remove()
  }
  btnDupeClick(){
    this.props.duplicate()
  }
  btnCollapseClick(){
    let val = !this.props.qry.collapsed
    this.props.stateChange( 'collapsed', val )
  }
  btnClearClick(){
    // this.props.dispatch({ type:"FretboardActions/fretFirstUpdate", payload:'' })
    this.props.reset()
  }
  infoNoteClick(event){
    let btn = event.target   
    if(btn.className !== 'ivl')
      btn = btn.parentNode
      
    let note = btn.dataset.note     
    // console.log('infoNoteClick', btn, note)
    if(typeof note === 'string')
      this.props.stateChange( 'noteFilter', note, btn.className )
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
  // selFretNoChange( event ){
  //   let sel = event.target,
  //    fret = sel.options[sel.selectedIndex].value
  //  this.props.stateChange( 'fret', fret )
  //  //   this.props.dispatch({ type:"FretboardActions/fretFirstUpdate", payload:fret })
  // }
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
      list = [<option key='aaa'></option>]
    for(let chd of q.chords.list){
      list.push(<option key={++ii} >{chd.name}</option>)
    }
    return (
      <div className='dataPnl pnlChord'>
        <label data-selected={selected !== ''} data-type='chord' onClick={this.selLabelClick} >Chord</label>
        <select value={selected} className='selChord' onChange={this.selChordChange} >
          {list}
        </select>      
      </div>
    )
  }
  drawSelInterval(){
    let qry = this.props.qry,
      list = [<option key='aaa' ></option>],
      ii = 0, selected = '' //, last = ''
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
    return (
      <div className='dataPnl pnlInterval'>
        <label data-selected={selected !== ''} data-type='ivlName' onClick={this.selLabelClick} >Interval</label>
        <select value={selected} className='selInterval' title='Intervals sorted by semis-tones'
          onChange={this.selIntervalChange} 
        >
          {list}
        </select>      
      </div>
    )
  }  
  drawInfo( collapsed ){
    let qry = this.props.qry, arrow = null, selected = 0
    // console.log('queryPnl.drawInfo', qry)
    if(collapsed === 'qryCollapsed')
      arrow = (<div className='qryBtn qryBtnExpand' onClick={this.btnCollapseClick} title="Show query panel" > <div>&#10148;</div> </div>)

    let html = []
    if(qry.rootType === 'selNote' && this.props.selNoteVal === 'All'){    //special case
      html.push( <span key='allNotes' className='propName'>{'All Notes'}</span> )
      if(qry.octave !== 0){
        html.push( <span key={'qryOct'+qry.octave} className='ivl'>{': Octave '}{qry.octave} </span> )
      }
    }
    else{
      if(qry.scale !== null){
        html.push( <span key='qryScale' className='propName'>{qry.root.note +' ' +qry.scale.name +':'}</span> )
        qry.scale.ivls.forEach( ivl => {
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0
          
          html.push( <span key={'qryScale'+ivl.abr} className='ivl'
            onClick={this.infoNoteClick} data-note={ivl.note} data-selected={selected}
          >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
        })
      }
      if(qry.chord !== null){
        html.push( <span key='qryChord' className='propName'>{qry.root.note +' ' +qry.chord.name +':'}</span> )
        qry.chord.ivls.forEach( ivl => {
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0

          html.push( <span key={'qryChord'+ivl.abr} className='ivl'
            onClick={this.infoNoteClick} data-note={ivl.note} data-selected={selected}
           >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
        })
      }
      if(qry.ivl !== null){
        if(qry.noteFilter.indexOf( qry.ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        html.push( <span key='qryIvl' className='propName'>{qry.note +' +' +qry.ivl.name +':'}</span> )
        html.push( <span key={'qryIvl'+qry.ivl.abr} className='ivl'
          onClick={this.infoNoteClick} data-note={qry.ivl.note} data-selected={selected}
        >&nbsp;{qry.ivl.note} <sub>{qry.ivl.abr}</sub> </span> )
      }
    }
    return (
      <div className='infoPnl'>
        {arrow}
         <div className='infoDiv'>{html}</div>
      </div>
    )      
  }

  render(){
    // console.log('queryPnl.render()', this.props)

    let collapsed = (this.props.qry.collapsed ?'qryCollapsed' :'qryExpanded')
 
    let selNote = this.drawSelNote()
    let selOct = this.drawSelOctave()
    let selInt = this.drawSelInterval()
    let selScale = this.drawSelScale()
    let selChord = this.drawSelChord()
    let infoPnl = this.drawInfo( collapsed )
    return (
      <div className={'queryPnl '+collapsed} >
        <div className='qryBtn qryBtnCollapse' onClick={this.btnCollapseClick}
            title="Hide query panel" >
          <div>&#10148;</div>
        </div>
        <div className='queryControls '>
          {selNote}
          {selOct}
          {selScale}
          {selChord}
          {selInt}
        </div>
        <div className='qryBtn qryBtnClear' onClick={this.btnClearClick} title='Reset query controls'>&#8635;</div>
        <div className='qryBtn qryBtnDupe' onClick={this.btnDupeClick} title='Duplicate fretboard' >&#10010;</div>
        { this.props.fbid === 0 ?null
          :<div className='qryBtn qryBtnDel' onClick={this.btnDelClick} title='Remove this fretboard' >&#10000;</div>
        }
        {infoPnl}
      </div>
    )
  }
}

export default QueryPnl
