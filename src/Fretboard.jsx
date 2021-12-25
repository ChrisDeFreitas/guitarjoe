/*
Fretboard.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - top level container for fretboard controls of GuitrJoe app
  - store shared state for FretPnl.js and QueryPnl.js

*/

import React from 'react';

import FretPnl from "./FretPnl";
import QueryPnl from "./QueryPnl";
import q from "./guitar_lib.js";
import './Fretboard.css';

class Fretboard extends React.Component{

  constructor (props) {
    console.log('Fretboard.constructor()', props)
    super(props)

    this.qry = null
    this.newqry = null    //used by this.changeHandlers in shouldComponentUpdate()

    let helpManager = (props.helpManager ?props.helpManager : false)
    if(props.firstRender === true) helpManager = true

    this.state = {
			fbid:(props.fbid ?props.fbid :0),
			
      //eventually replace rootType with mode
      rootType:(props.rootType ?props.rootType :''),    //one of: ['', 'AllNotes', fretRoot, fretSelect, noteSelect]
      helpManager:helpManager, 
      
      collapsed:(props.collapsed ?props.collapsed :false),
      fretBtnStyle:(props.fretBtnStyle ?props.fretBtnStyle :'NoteFirst'),    //one of: NoteFirst, IvlFirst, NoteTab, NoteAbc
      fretFirst:(props.fretFirst ?props.fretFirst :0),
      fretLast:(props.fretLast ?props.fretLast :q.fretboard.fretMax),
      fretFilter:(props.fretFilter ?props.fretFilter :[]),      //csv of fretN, if found then disable fret
      strgFilter:(props.strgFilter ?props.strgFilter :[]),    //csv of strN, if found then hide notes
      noteFilter:(props.noteFilter ?props.noteFilter :[]),    //notes on fetboard where button.data-selected=2; set by clicking infoPnl note
      
      fretRoot:(props.fretRoot ?props.fretRoot :null),          //note object, set when fret clicked
      selNoteVal:(props.selNoteVal ?props.selNoteVal :''),   //string, contains note selected in selNote control
      octave:(props.octave ?props.octave :0), 

      fretSelect:(props.fretSelect ?props.fretSelect :[]),    //when rootType=fretSelect, list of frets and related data; set in fretPnl.fretClick()
      fretSelectMatch:(props.fretSelectMatch ?props.fretSelectMatch :null),    //user selects a chord or scale to view: {type, name}
      fretSelectMatchDisplay:(props.fretSelectMatchDisplay ?props.fretSelectMatchDisplay :'Show'),    //Show or Collapse

      scaleName:(props.scaleName ?props.scaleName :''),
      scaleTriadDisplay:(props.scaleTriadDisplay ?props.scaleTriadDisplay :'Show'),    // Show, Collapse, or Close
      scaleTriadSelected:(props.scaleTriadSelected ?props.scaleTriadSelected :null),   //null or degree of selected triad
      
      chordName:(props.chordName ?props.chordName :''),
      chordInvrDisplay:(props.chordInvrDisplay ?props.chordInvrDisplay :'Show'),    // Show, Collapse, or Close
      chordInvrSelected:(props.chordInvrSelected ?props.chordInvrSelected :null),    //user selected inversion position to display
      chordShape:(props.chordShape ?props.chordShape :''),

      ivlName:(props.ivlName ?props.ivlName :''), 
    }
    this.duplicate = this.duplicate.bind(this)
    this.remove = this.remove.bind(this)
    this.reset = this.reset.bind(this)
    this.stateChange = this.stateChange.bind(this)
    this.strgFiltered = this.strgFiltered.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.fretSelectFind = this.fretSelectFind.bind(this)
    this.inversionNoteByTab = this.inversionNoteByTab.bind(this)
    
    //children can prevent state from chaning until they complete their own processing
    this.changeHandlerActive = false
    this.changeHandlers = []
    this.changeExecList = []    
    this.setChangeHandler = this.setChangeHandler.bind(this)

  }  
  setChangeHandler(tag = null, testFunc = null, execFunc = null){ //currently used by InfoPnl
    if(tag === null || testFunc === null || execFunc === null)
      throw new Error('Fretboard.setChangeHandler() error, all parameters must be supplied.')
    
    const found = this.changeHandlers.find( obj => obj.tag === tag)
    if(found === undefined)
      this.changeHandlers.push({
        tag: tag,            // name 
        testFunc: testFunc,  // return true to pause state change
        execFunc: execFunc   // executed when testFunc returns true; on done call Fretboard.stateChange('changeHandled', tag)
      })
  }
  shouldComponentUpdate(nextProps, nextState){
    
    if(this.changeHandlerActive === true){
      // note: this is normal as React calls shouldComponentUpdate at its own discretion
      // note: we are waiting for changeHandlers to complete execution by calling stateChange('changeHandled', handlerTag)
      //console.log(`Fretboard.shouldComponentUpdate() called but changeHandlerActive == true; False returned.`)
      return false
    }
    
    try{    //allow children to do stuff before state changes

      this.newqry = this.makeQuery( nextState )
      this.changeExecList = []

      for(let obj of this.changeHandlers){  // any children with work to do?
        let result = obj.testFunc( this.newqry, obj.tag )
        if(result === true)
          this.changeExecList.push( obj )
      }
      if(this.changeExecList.length > 0){   // allow children to do work
        this.changeHandlerActive = true
        for(let obj of this.changeExecList){
          obj.execFunc( this.newqry, obj.tag )
        }
        return false
      }

      return true
    }
    catch( err ){
      alert(`
        Warning: An error has occurred in Fretboard.shouldComponentUpdate().

        Please reload the webpage as the application is now unstable.

        ${err}      
      `)
      return false
    }
  }
  reset(){
    this.changeHandlers = []
    this.changeExecList = []
    this.changeHandlerActive = false
    
    this.setState({ collapsed:false })
    this.setState({ fretSelect:[] })
    this.setState({ fretSelectMatch:null })
    this.setState({ fretSelectMatchDisplay:'Show' })
    this.setState({ fretFilter:[] })
    this.setState({ noteFilter:[] })
    this.setState({ strgFilter:[] })
    this.setState({ scaleName:'' })
    this.setState({ scaleTriadDisplay:'Show' })
    this.setState({ scaleTriadSelected:null })
    this.setState({ chordName:'' })
    this.setState({ chordInvrSelected:null })
    this.setState({ chordInvrDisplay:'Show' })
    this.setState({ chordShape:'' })
    this.setState({ rootType:'' })
    this.setState({ ivlName:'' })
    this.setState({ helpManager:false })
    this.setState({ fretRoot:null })
    this.setState({ selNoteVal:'' })
    this.setState({ octave:0 })
    this.setState({ fretBtnStyle:'NoteFirst' })
  }
  strgFiltered( strN ){
    strN = Number(strN)
    return ( this.state.strgFilter.indexOf( strN ) >= 0 )
  }
  remove(){
    this.props.remove( this )
  }
  duplicate(){
    this.props.duplicate( this )
  }

  inversionNoteByTab( tab ){
    if(this.state.chordInvrSelected === null) return null
    for(let nobj of this.qry.chordInvrNotes){
      if(nobj.tab === tab) return nobj 
    } 
    return null
  }
  fretSelectFind( objOrTab ){
    let list = this.state.fretSelect,
      fnd = -1

    if(list.length === 0 || objOrTab === null) return fnd  //empty list

    let  tab = (typeof objOrTab === 'string' ?objOrTab :objOrTab.tab)    //find in list
    for(let ii = 0; ii < list.length; ii++){
      if(tab === list[ii].tab){
        fnd = ii
        break
      }
    }
    return fnd
  }
  stateChange( key, val){
    // if(key === 'rootType')   //only manually set below; can be prop instead of state
    //   this.setState({ rootType:val })
    // else
    if(key === 'changeHandled'){  // when changeExecList.length === 0 then forceUpdate()
      if(this.changeHandlerActive !== true){
        console.log(`Fretboard.stateChange('changeHandled', ${val}) called but changeHandlerActive != true.`)
        return
      }

      const idx = this.changeExecList.findIndex( obj => obj.tag === val)
      if( idx >= 0 ){
        this.changeExecList.splice( idx, 1 )
        if(this.changeExecList.length === 0){
          this.changeHandlerActive = false
          this.forceUpdate()
        }
      }
      else
        throw new Error('Fretboard.stateChange() error, object not found for tag: '+val)
    }
    else
    if(key === 'collapsed'){
      if(val === true){
        this.setState({ fretSelectMatchDisplay: 'Collapse' })
        this.setState({ scaleTriadDisplay: 'Collapse' })
        this.setState({ chordInvrDisplay: 'Collapse' })
      }
      else{
        this.setState({ fretSelectMatchDisplay: 'Show' })
        this.setState({ scaleTriadDisplay: 'Show' })
        this.setState({ chordInvrDisplay: 'Show' })
      }
      this.setState({ collapsed:val })
    }else
    if(key === 'noteFilter'){

      if(val === 'clear'){  //empty list
        this.setState({ noteFilter:[] })
      }
      else {    //default operation
        let list = this.state.noteFilter.slice()
        let idx = list.indexOf( val )
   
        if(idx < 0) list.push( val )
        else list.splice( idx, 1 )
        
        this.setState({ noteFilter:list })
      }
    }else
    if(key === 'fretBtnStyle'){
      this.setState({ fretBtnStyle:val })
    }else
    if(key === 'fretFilter'){
      let list = this.state.fretFilter.slice()
      let idx = list.indexOf( val )
 
      if(idx < 0) list.push( val )
      else list.splice( idx, 1 )

      this.setState({ fretFilter:list })
    }else
    if(key === 'fretRoot'){
      this.setState({ fretRoot:val })

      if(val === null)
         this.setState({ rootType:'' })
      else
        this.setState({ rootType:'fretRoot' })
      this.setState({ selNoteVal:'' })
      this.setState({ fretSelect:[] })
      // this.setState({ fretSelectMatch:null })
    }else
    if(key === 'selNoteVal'){
      this.setState({ selNoteVal:val })

      
      if(val === '')
        this.setState({ rootType:'' })
      else
      if(val === 'All')
        this.setState({ rootType:'AllNotes' })
      else
        this.setState({ rootType:'noteSelect' })
      this.setState({ fretRoot:null })
      this.setState({ fretSelect:[] })
      // this.setState({ fretSelectMatch:null })
    }else
    if(key === 'fretSelect'){

      if(val === null){   //disable fretSelect mode
        this.setState({ fretSelect:[] })
        // this.setState({ fretSelectMatch:null })
        this.setState({ rootType:'' })
        this.setState({ fretRoot:null })
        this.setState({ selNoteVal:'' })
        return
      }

      if(Array.isArray(val) === false)  //process as array due to React state handling
        val = [val]

      let list = this.state.fretSelect.slice(),
        idx = null, root=null

      for(let nobj of val){
        idx = this.fretSelectFind( nobj )
        if(idx < 0) {
          if(list.length === 0){
            nobj.ivl = q.intervals.byName( 'P1' )
            list.push( nobj )
          }
          else{
            if(root === null) root = list[0]
            let semis = (nobj.semis -root.semis) % 12
            if(semis < 12) semis = 12 +semis
            nobj.ivl = q.intervals.bySemis( semis, true )
            list.push( nobj )
          }
        }else 
          list.splice( idx, 1 )
      }
      list.sort(function (a, b) {
        return a.ivl.semis - b.ivl.semis
      })
      
      if(list.length === 1){
        this.stateChange( 'fretRoot', list[0] )
      }
      else{
        this.setState({ fretSelect:list })
        if(this.state.rootType !== 'fretSelect'){   //set rootType to fretSelect
          this.setState({ rootType:'fretSelect' })
          this.setState({ fretRoot:null })
          this.setState({ selNoteVal:'' })
        }
      }
    }else
    if(key === 'fretSelectMatch'){
      this.setState({ fretSelectMatch:val })
    }else
    if(key === 'fretSelectMatchDisplay'){
      this.setState({ fretSelectMatchDisplay:val })
    }else
    if(key === 'strgFilter'){
      val = Number( val )
      let list = this.state.strgFilter.slice()
      let idx = list.indexOf( val )
 
      if(idx < 0) list.push( val )
      else list.splice( idx, 1 )

      this.setState({ strgFilter:list })
    }else
    if(key === 'fretFirst')
      this.setState({ fretFirst:val })
    else
    if(key === 'fretLast')
      this.setState({ fretLast:val })
    else
    if(key === 'octave')
      this.setState({ octave:val })
    else
    if(key === 'scaleName'){
      this.setState({ scaleName:val })
      if( this.state.scaleTriadDisplay === 'Close')
        this.setState({ scaleTriadDisplay: 'Show' })
    }else
    if(key === 'scaleTriadSelected'){
      if(val !== null) val = Number(val)
      if(this.state.scaleTriadSelected === val)
        this.setState({ scaleTriadSelected: null })
      else
        this.setState({ scaleTriadSelected: val })
    }else
    if(key === 'scaleTriadDisplay'){
      this.setState({ scaleTriadDisplay:val })
    }else
    if(key === 'chordName'){
      this.setState({ chordName:val })
      if( this.state.chordInvrDisplay === 'Close')
        this.setState({ chordInvrDisplay: 'Show' })
    }else
    if(key === 'chordInvrSelected'){
     if(this.state.chordInvrSelected === val)
       val = null
     this.setState({ chordInvrSelected:val })
    }else
    if(key === 'chordInvrDisplay'){
     this.setState({ chordInvrDisplay:val })
    }else
    if(key === 'chordShape'){
      if( val === null ) val = ''
      if(this.state.chordShape === val)
        this.setState({ chordShape:'' })
      else
        this.setState({ chordShape:val })
    }else
    if(key === 'ivlName'){
      this.setState({ ivlName:val })
    }else
    if(key === 'helpManager'){
      this.setState({ helpManager:val })
    }else
    if(key === 'semis')
      this.setState({ semis:val })
  }
  makeQuery( state ){
    let qry = {
      fbid: state.fbid,
      firstRender: this.props.firstRender,
      mode: state.rootType,
      rootType: state.rootType,    //eventually replace with mode 

      collapsed: state.collapsed,
      fretBtnStyle: state.fretBtnStyle,
      fretFilter: state.fretFilter,
      noteFilter: state.noteFilter,

      root: null,
      note: (state.rootType === 'fretRoot' 
              ? state.fretRoot.notes[0] 
              : state.selNoteVal ), 
      octave: state.octave,
      
      scale: null,
      scaleTriadDisplay:state.scaleTriadDisplay,
      scaleTriadIvls:null,
      scaleTriads:null,
      scaleTriadSelected:state.scaleTriadSelected,
      
      chord:null,
      chordInvrDisplay:state.chordInvrDisplay,
      chordInvrSelected:state.chordInvrSelected,
      chordInvrNotes:null,
      chordShape:state.chordShape,
      chordShapeData:null,
      inversions:null,

      ivl: null,

      fretSelect: state.fretSelect,
      fretSelectMatch: state.fretSelectMatch,
      fretSelectMatchDisplay: state.fretSelectMatchDisplay,
     
      helpManager: state.helpManager,
    }

    if(qry.mode === 'AllNotes'){
      if( ['NoteAbc','NoteTab'].indexOf( qry.fretBtnStyle ) < 0 )
        qry.fretBtnStyle = 'NoteAbc'
    } else
    if(qry.mode === 'fretSelect'){
      qry.root = state.fretSelect[0]    //note object, set in FretPnl.fretClick()
  
      if(qry.fretSelectMatch != null){
        if(qry.fretSelectMatch.type === 'chord')
          qry.fretSelectMatch.obj = q.chords.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
        else
        if(qry.fretSelectMatch.type === 'scale')
          qry.fretSelectMatch.obj = q.scales.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
      }
    } 
    else{
      if(qry.mode === 'fretRoot')
        qry.root = state.fretRoot    //note object, set in FretPnl.fretClick()
      // if(qry.rootType === 'noteSelect' && qry.note !== '' && qry.note !== 'All')
      if(qry.mode === 'noteSelect')
        qry.root = q.notes.byNote( qry.note )    //note object


      if(state.scaleName !== '' && qry.root){
        qry.scale = q.scales.obj( qry.note, state.scaleName )
        qry.scaleTriads = q.scales.degreeTriads( qry.note, state.scaleName )
        if(qry.scaleTriadSelected != null)
          qry.scaleTriadIvls = qry.scaleTriads.list[ qry.scaleTriadSelected -1 ].ivls
      }
      if(state.chordName !== '' && qry.root){
        qry.chord = q.chords.obj( qry.note, state.chordName )
        qry.inversions = q.chords.inversions(qry.root.note, qry.chord.abr, qry.root.octave )
        if(qry.chordInvrSelected !== null){
          qry.chordInvrNotes = q.chords.inversionNotes(  qry.inversions, qry.chordInvrSelected )
        }
        if(qry.chordShape !== ''){
          qry.chordShapeData = q.chords.shapeTabs(qry.chordShape, qry.root.note)
        }
      }
      if(state.ivlName !== '' && qry.root){
        qry.ivl = q.intervals.byName( state.ivlName )    //this.state.ivlName == abr
        qry.ivl.note = q.notes.calc( qry.note, qry.ivl )
      }
    }
    this.qry = qry
    return qry
  }
  render(){
    let qry = (this.newqry !== null
      ? this.newqry
      : this.makeQuery( this.state )
    )
    this.changeHandlers = []    //reset on every render as children may be removed from DOM
    this.changeExecList = []
    
    // console.log('Fretboard.render()', this.props, this.state, qry)
    return(
      <div className='fretboard' id={'Fretboard'+qry.fbid}>
        <FretPnl
          collapsed={this.state.collapsed}
          fretFirst={this.state.fretFirst}
          fretLast={this.state.fretLast}

          selNoteVal={this.state.selNoteVal} 

          qry={qry}
          stateChange={this.stateChange}
          setChangeHandler={this.setChangeHandler}
          strgFiltered={this.strgFiltered}
          fretSelectFind={this.fretSelectFind}
          inversionNoteByTab={this.inversionNoteByTab}
        />
        <QueryPnl 
          collapsed={this.state.collapsed}
          fretFirst={this.state.fretFirst}
          fretLast={this.state.fretLast}

          selNoteVal={this.state.selNoteVal} 
          chordName={this.state.chordName}
          scaleName={this.state.scaleName}
          ivlName={this.state.ivlName}

          duplicate={this.duplicate}
          qry={qry}
          remove={this.remove}
          reset={this.reset} 
          stateChange={this.stateChange}
          setChangeHandler={this.setChangeHandler}
          strgFiltered={this.strgFiltered} 
         />
      </div>
    )
  }
}

export default Fretboard;
