/*
  QueryPnl.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
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
    this.fsChordClick = this.fsChordClick.bind(this)
    this.fsScaleClick = this.fsScaleClick.bind(this)
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
  fsChordClick( event ){
    let btn = event.target, qry = this.props.qry
    // console.log('fsChordClick', btn.dataset.note, btn.dataset.abr)

    if(btn.dataset.selected === 'label'){    //user clicked the label
      this.props.stateChange( 'fretSelectMatch', null )
      this.props.stateChange( 'noteFilter', 'clear' )
    }
    else{   //default operation
      if(qry.fretSelectMatch != null
      && qry.fretSelectMatch.note === btn.dataset.note && qry.fretSelectMatch.abr === btn.dataset.abr)    //turn off selected match
        this.props.stateChange( 'fretSelectMatch', null )
      else
        this.props.stateChange( 'fretSelectMatch', {type:'chord', note:btn.dataset.note, abr:btn.dataset.abr} )
    }
  }
  fsScaleClick( event ){
    let btn = event.target, qry = this.props.qry
    // console.log('fsScaleClick', btn.dataset.note, btn.dataset.abr)

    if(btn.dataset.selected === 'label'){    //user clicked the label
      this.props.stateChange( 'fretSelectMatch', null )   //turn off selected match
      this.props.stateChange( 'noteFilter', 'clear' )
    }
    else{   //default operation
      if(qry.fretSelectMatch != null 
      && qry.fretSelectMatch.note === btn.dataset.note && qry.fretSelectMatch.abr === btn.dataset.abr)
        this.props.stateChange( 'fretSelectMatch', null )   //turn off selected match
      else
        this.props.stateChange( 'fretSelectMatch', {type:'scale', note:btn.dataset.note, abr:btn.dataset.abr} )
    }
  }
  
  infoNoteClick(event){
    event.stopPropagation()

    let btn = event.target   
    if(btn.dataset.selected === 'label'){    //user clicked the label
      this.props.stateChange( 'fretSelectMatch', null )
      this.props.stateChange( 'noteFilter', 'clear' )
    }
    else {   //default operation
      if(btn.className !== 'ivl')
        btn = btn.parentNode
      
      let note = btn.dataset.note     
      // console.log('infoNoteClick', btn, note)
      if(typeof note === 'string')
        this.props.stateChange( 'noteFilter', note )
        // this.props.stateChange( 'noteFilter', note, btn.className )
    }
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
  drawFretSelectMatches( html, key ){    //push matching chords and scales onto html[]
    let qry = this.props.qry, selected = 0
    
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
          data-selected='label' onClick={this.fsChordClick}
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
        <span key={++key} className='ivl' onClick={this.fsChordClick} title={ob.note +' ' +chord.name}
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
          data-selected='label' onClick={this.fsScaleClick}
        >Matching scales:&nbsp;</span> )
      }

      if(qry.fretSelectMatch != null
      && qry.fretSelectMatch.note === ob.note
      && qry.fretSelectMatch.abr === scale.abr) selected = 'fretSelectMatch'

      if(lastname !== null && lastname !== scale.name)
        html.push( <i key={++key} > &mdash; </i> )
      lastname = scale.name

      html.push( 
        <span key={++key} className='ivl' onClick={this.fsScaleClick} title={ob.note +' ' +scale.name}
        data-note={ob.note} data-abr={scale.abr} data-selected={selected} 
        > &#8200;{ob.note}&#8239;{scale.short}&#8200;</span> 
      )
    }

    return key
  }
  drawInfo( collapsed ){
    let qry = this.props.qry,  selected = 0
    // console.log('queryPnl.drawInfo', qry)
    // arrow = null,
    // if(collapsed === 'qryCollapsed')
    //   arrow = (<div className='qryBtn qryBtnExpand' onClick={this.btnCollapseClick} title="Show query panel" > <div>&#10148;</div> </div>)

    let html = [], key=0, lastkey=null
    if(qry.rootType === 'fretSelect'){    

        // console.log('qry.fretSelect', qry.fretSelect)

        html.push( <span key={++key} className='propName'
           data-selected='label' onClick={this.infoNoteClick}
          >Fret select:&nbsp;</span> )
        let last = null
        qry.fretSelect.forEach( nobj => {
          if(last && last.note === nobj.note) return

          if(qry.noteFilter.indexOf( nobj.note ) >= 0) selected = 'noteFilter'
          else selected = 0
          
          html.push( <span key={++key} className='ivl'
            onClick={this.infoNoteClick} data-note={nobj.note} data-selected={selected}
          >&nbsp;{nobj.note} <sub>{nobj.ivl.abr}</sub> </span> )
          last = nobj
        })

        if(qry.fretSelectMatch != null){    //draw user select chord or scale match
          html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
           html.push( <span key={++key} className='propName'
           data-selected='label' onClick={this.infoNoteClick}
          >Selected, {qry.fretSelectMatch.obj.fullName}:&nbsp;</span> )

          for(let ivl of qry.fretSelectMatch.obj.ivls){   
            if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
            else selected = 0

            html.push( <span key={++key} className='ivl' onClick={this.infoNoteClick}
              data-note={ivl.note} data-selected={selected}
            >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
          }
        }

      if(collapsed !== 'qryCollapsed'){
        key = this.drawFretSelectMatches( html, key )
      }
    } else
    if(qry.rootType === 'selNote' && this.props.selNoteVal === 'All'){    //special case
      html.push( <span key={++key} className='propName'
         data-selected='label' onClick={this.infoNoteClick}
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
           data-selected='label' onClick={this.infoNoteClick}
          >{qry.root.note +' ' +qry.scale.name +':'}</span> )
        qry.scale.ivls.forEach( ivl => {
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0
          
          html.push( <span key={++key} className='ivl'
            onClick={this.infoNoteClick} data-note={ivl.note} data-selected={selected}
          >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
        })
      }
      if(qry.chord !== null){
        if(lastkey !== key)
          html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        html.push( <span key={++key} className='propName'
           data-selected='label' onClick={this.infoNoteClick}
          >{qry.root.note +' ' +qry.chord.name +':'}</span> )
        qry.chord.ivls.forEach( ivl => {
          if(qry.noteFilter.indexOf( ivl.note ) >= 0) selected = 'noteFilter'
          else selected = 0

          html.push( <span key={++key} className='ivl'
            onClick={this.infoNoteClick} data-note={ivl.note} data-selected={selected}
           >&nbsp;{ivl.note} <sub>{ivl.abr}</sub> </span> )
        })
      }
      if(qry.ivl !== null){
        if(qry.noteFilter.indexOf( qry.ivl.note ) >= 0) selected = 'noteFilter'
        else selected = 0
        
        if(lastkey !== key)
          html.push( <div key={++key} className='lineBreak'>&nbsp; </div>)
        html.push( <span key={++key} className='propName'
           data-selected='label' onClick={this.infoNoteClick}
          >{qry.note +' +' +qry.ivl.name +':'}</span> )
        html.push( <span key={++key} className='ivl'
          onClick={this.infoNoteClick} data-note={qry.ivl.note} data-selected={selected}
        >&nbsp;{qry.ivl.note} <sub>{qry.ivl.abr}</sub> </span> )
      }
    }
    
    if(html.length === 0) return null
        // {arrow}
    return (
      <div className='infoPnl'>
         <div className='infoDiv'>
           {html}
         </div>
      </div>
    )      
  }
 
  render(){
    // console.log('queryPnl.render()', this.props)
    let qry = this.props.qry
    let collapsed = (qry.collapsed ?'qryCollapsed' :'qryExpanded')

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
    let infoPnl = this.drawInfo( collapsed )

    let arrow = null
    if(collapsed === 'qryCollapsed')
      arrow = (<div className='qryBtn qryBtnExpand' onClick={this.btnCollapseClick} title="Show query panel" > <div>&#10148;</div> </div>)

    return (
      <div className={'queryPnl '+collapsed} >
    <table className='tbQuery' ><tbody><tr><td className='qryBtnsLeft'>
        {arrow}
        <div className='qryBtn qryBtnCollapse' onClick={this.btnCollapseClick}
            title="Hide query panel" >
          <div>&#10148;</div>
        </div>
    </td><td className='qryContent'>
        <div className='queryControls' data-roottype={qry.rootType}>
          {selNote}
          {selOct}
          {selScale}
          {selChord}
          {selInt}
        </div>
        {infoPnl}
    </td><td className='qryBtnsRight'>
        <div className='qryBtn qryBtnClear' onClick={this.btnClearClick} title='Reset query controls'>&#8635;</div>
        <div className='qryBtn qryBtnDupe' onClick={this.btnDupeClick} title='Duplicate fretboard' >&#10010;</div>
        { qry.fbid === 0 ?null
          :<div className='qryBtn qryBtnDel' onClick={this.btnDelClick} title='Remove this fretboard' >&#10000;</div>
        }
    </td></tr></tbody></table>
      </div>
    )
  }
}

export default QueryPnl
