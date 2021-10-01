/*
Fretboard.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - top level container for fretboard controls of GuitrJoe app
  - store shared state for FretPnl.js and QueryPnl.js

*/

import React from 'react';
import './Fretboard.css';

import FretPnl from "./FretPnl.js";
import QueryPnl from "./QueryPnl.js";
import q from "./guitar_lib.js";

class Fretboard extends React.Component{

  constructor (props) {
    console.log('Fretboard.constructor()', props)
    super(props)
    this.qry = null
    //keep state private to control children
    this.state = {
			fbid:(props.fbid ?props.fbid :0),
			
      collapsed:(props.collapsed ?props.collapsed :false),
      fretFirst:(props.fretFirst ?props.fretFirst :0),
      fretLast:(props.fretLast ?props.fretLast :q.fretboard.fretMax),
      fretBtnText:(props.fretBtnText ?props.fretBtnText :'NoteFirst'),    //one of: NoteFirst, IvlFirst, NoteTab, NoteAbc
      fretFilter:(props.fretFilter ?props.fretFilter :[]),      //csv of fretN, if found then disable fret
      strgFilter:(props.strgFilter ?props.strgFilter :[]),    //csv of strN, if found then hide notes
      noteFilter:(props.noteFilter ?props.noteFilter :[]),    //notes on fetboard where button.data-selected=2; set by clicking infoPnl note
      fretSelect:(props.fretSelect ?props.fretSelect :[]),    //when rootType=fretSelect, list of frets and related data; set in fretPnl.fretClick()
      fretSelectMatch:(props.fretSelectMatch ?props.fretSelectMatch :null),    //user selects a chord or scale to view: {type, name}

      rootType:(props.rootType ?props.rootType :''),    //one of: ['', fretRoot, fretSelect, selNote]
      fretRoot:(props.fretRoot ?props.fretRoot :null),          //note object, set when fret clicked
      selNoteVal:(props.selNoteVal ?props.selNoteVal :''),   //string, contains note selected in selNote
      octave:(props.octave ?props.octave :0), 
      scaleName:(props.scaleName ?props.scaleName :''),
      chordName:(props.chordName ?props.chordName :''),
      ivlName:(props.ivlName ?props.ivlName :''), 
      
      inversionPos:(props.inversionPos ?props.inversionPos :null),    //user selected inversion position to display (maj or maj7 selected)
    }
    this.duplicate = this.duplicate.bind(this)
    this.remove = this.remove.bind(this)
    this.reset = this.reset.bind(this)
    this.stateChange = this.stateChange.bind(this)
    this.strgFiltered = this.strgFiltered.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.fretSelectFind = this.fretSelectFind.bind(this)
    this.inversionNoteByTab = this.inversionNoteByTab.bind(this)
  }  
  reset(){
    this.setState({ collapsed:false })
    this.setState({ fretSelectMatch:null })
    this.setState({ fretSelect:[] })
    this.setState({ noteFilter:[] })
    this.setState({ strgFilter:[] })
    this.setState({ fretFilter:[] })
    this.setState({ scaleName:'' })
    this.setState({ chordName:'' })
    this.setState({ inversionPos:null })
    this.setState({ rootType:'' })
    this.setState({ ivlName:'' })
    this.setState({ fretRoot:null })
    this.setState({ selNoteVal:'' })
    this.setState({ octave:0 })
    this.setState({ fretBtnText:'NoteFirst' })
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
    if(this.state.inversionPos === null) return null
    for(let nobj of this.qry.inversionNotes){
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
    if(key === 'collapsed'){
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
    if(key === 'fretBtnText'){
      this.setState({ fretBtnText:val })
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
        this.setState({ rootType:'selNote' })
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

      this.setState({ fretSelect:list })
      if(this.state.rootType !== 'fretSelect'){   //set rootType to fretSelect
        this.setState({ rootType:'fretSelect' })
        this.setState({ fretRoot:null })
        this.setState({ selNoteVal:'' })
      }
    }else
    if(key === 'fretSelectMatch'){
      this.setState({ fretSelectMatch:val })
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
    }else
    if(key === 'chordName'){
      this.setState({ chordName:val })
    }else
    if(key === 'inversionPos'){
     if(this.state.inversionPos === val)
       val = null
     this.setState({ inversionPos:val })
    }else
    if(key === 'ivlName'){
      this.setState({ ivlName:val })
    }else
    if(key === 'semis')
      this.setState({ semis:val })
  }
  makeQuery(){
    let qry = {
      fbid:this.state.fbid,
      rootType: this.state.rootType,
      root: null,
      note: (this.state.rootType === 'fretRoot' 
              ? this.state.fretRoot.notes[0] 
              : this.state.selNoteVal ), 
      octave: this.state.octave,
      scale: null,
      chord:null,
      inversions:null,
      inversionPos:this.state.inversionPos,
      inversionNotes:null,
      ivl: null,

      collapsed: this.state.collapsed,
      fretBtnText: this.state.fretBtnText,
      fretFilter: this.state.fretFilter,
      noteFilter: this.state.noteFilter,
      fretSelect: this.state.fretSelect,
      fretSelectMatch: this.state.fretSelectMatch,
    }
    if(qry.rootType === 'fretRoot')
      qry.root = this.state.fretRoot    //note object, set in FretPnl.fretClick()
    if(qry.rootType === 'selNote' && qry.note !== '' && qry.note !== 'All')
      qry.root = q.notes.objByNote( qry.note )    //note object
    if(qry.rootType === 'fretSelect')
      qry.root = this.state.fretSelect[0]    //note object, set in FretPnl.fretClick()
  
   // if(qry.note === 'All'){
      //qry.fretBtnText = 'NoteAbc'
   // }
  
    if(qry.fretSelectMatch != null){
      if(qry.fretSelectMatch.type === 'chord')
        qry.fretSelectMatch.obj = q.chords.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
      else
      if(qry.fretSelectMatch.type === 'scale')
        qry.fretSelectMatch.obj = q.scales.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
    }

    if(this.state.scaleName !== '' && qry.root)
      qry.scale = q.scales.obj( qry.note, this.state.scaleName )
    if(this.state.chordName !== '' && qry.root){
      qry.chord = q.chords.obj( qry.note, this.state.chordName )
      qry.inversions = q.chords.inversions(qry.root.note, qry.chord.abr, qry.root.octave )
      if(qry.inversionPos !== null){
        qry.inversionNotes = q.chords.inversionNotes(  qry.inversions, qry.inversionPos )
      }
    }
    if(this.state.ivlName !== '' && qry.root){
      qry.ivl = q.intervals.byName( this.state.ivlName )    //this.props.ivlName == abr
      qry.ivl.note = q.notes.calc( qry.note, qry.ivl )
      // qry.ivl.notes = q.notes.bySemis( qry.root.semis +qry.ivl.semis )
    }
    this.qry = qry
    return qry
  }
  render(){
    let qry = this.makeQuery()
    console.log('Fretboard.render()', this.props, this.state, qry)
    return(
      <div className='fretboard' id={'Fretboard'+qry.fbid}>
        <FretPnl
          collapsed={this.state.collapsed}
          fretFirst={this.state.fretFirst}
          fretLast={this.state.fretLast}

          ivlName={this.state.ivlName}

          selNoteVal={this.state.selNoteVal} 

          qry={qry}
          stateChange={this.stateChange}
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
          strgFiltered={this.strgFiltered} 
         />
      </div>
    )
  }
}

export default Fretboard;
