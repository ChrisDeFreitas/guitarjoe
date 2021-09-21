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
    //keep state private to control children
    this.state = {
			fbid:(props.fbid ?props.fbid :0),
			
      collapsed:(props.collapsed ?props.collapsed :false),
      fretFirst:(props.fretFirst ?props.fretFirst :0),
      fretLast:(props.fretLast ?props.fretLast :q.fretboard.fretMax),
      fretBtnText:(props.fretBtnText ?props.fretBtnText :'NoteFirst'),    //one of: NoteFirst, IvlFirst
      fretFilter:(props.fretFilter ?props.fretFilter :[]),      //csv of fretN, if found then disable fret
      strgFltrList:(props.strgFltrList ?props.strgFltrList :''),    //csv of strN, if found then hide notes
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
    }
    this.duplicate = this.duplicate.bind(this)
    this.remove = this.remove.bind(this)
    this.reset = this.reset.bind(this)
    this.stateChange = this.stateChange.bind(this)
    this.strgFltr = this.strgFltr.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.fretSelectFind = this.fretSelectFind.bind(this)
  }  
  reset(){
    this.setState({ collapsed:false })
    this.setState({ fretSelectMatch:null })
    this.setState({ fretSelect:[] })
    this.setState({ noteFilter:[] })
    this.setState({ strgFltrList:'' })
    this.setState({ fretFilter:[] })
    this.setState({ scaleName:'' })
    this.setState({ chordName:'' })
    this.setState({ rootType:'' })
    this.setState({ ivlName:'' })
    this.setState({ fretRoot:null })
    this.setState({ selNoteVal:'' })
    this.setState({ octave:0 })
    this.setState({ fretBtnText:'NoteFirst' })
  }
  strgFltr( strN ){   //return strgFltrList[n -1] (true/false) or null
    strN = Number(strN)
    if(strN < 1 || strN > 6) return null
    return ( this.state.strgFltrList.indexOf( strN+',' ) >= 0 )
  }
  remove(){
    this.props.remove( this )
  }
  duplicate(){
    this.props.duplicate( this )
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
      // let fval = `"${val}",`,
      //   ii = this.state.fretFilter.indexOf( fval )
      // if(ii < 0)   //add to list
      //   val = this.state.fretFilter +fval    
      // else         //remove from list
      //   val = this.state.fretFilter.replace(fval, '')
      // this.setState({ fretFilter:val })
    }else
    if(key === 'fretRoot'){
      this.setState({ fretRoot:val })

      if(val === null)
         this.setState({ rootType:'' })
      else
        this.setState({ rootType:'fretRoot' })
      this.setState({ selNoteVal:'' })
      this.setState({ fretSelect:[] })
      this.setState({ fretSelectMatch:null })
    }else
    if(key === 'selNoteVal'){
      this.setState({ selNoteVal:val })

      if(val === '')
        this.setState({ rootType:'' })
      else
        this.setState({ rootType:'selNote' })
      this.setState({ fretRoot:null })
      this.setState({ fretSelect:[] })
      this.setState({ fretSelectMatch:null })
    }else
    if(key === 'fretSelect'){

      if(val === null){   //disable fretSelect mode
        this.setState({ fretSelect:[] })
        this.setState({ fretSelectMatch:null })
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
    if(key.substr(0,8) === 'strgFltr'){
      let strN = Number(key.substr(8,1)),
        flt = this.state.strgFltrList.slice()

      // console.log('stateChange:', key, val, flt)
      if(strN < 1 || strN > 6) throw Error (`Fretboard.stateChange() error, strN is wrong:[${key}].`)

      let ii = flt.indexOf(strN+',')
      if(val === true){ //add to list
        if(ii < 0){
          flt += strN+','
          // console.log('stateChange Add:', key, val, flt)
           this.setState({ strgFltrList:flt })
        }
      }
      else{ //remove from list
        if(ii >= 0){
          flt = flt.replace(strN+',')
          // console.log('stateChange Del:', key, val, flt)
           this.setState({ strgFltrList:flt })
        }
      }
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
    if(key === 'ivlName'){
      this.setState({ ivlName:val })
    }else
    if(key === 'semis')
      this.setState({ semis:val })
  }
  makeQuery(){
    let qry = {
      rootType: this.state.rootType,
      root: null,
      note: (this.state.rootType === 'fretRoot' 
              ? this.state.fretRoot.notes[0] 
              : this.state.selNoteVal ), 
      octave: this.state.octave,
      scale: null,
      chord:null,
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
    
    if(qry.fretSelectMatch != null){
      if(qry.fretSelectMatch.type === 'chord')
        qry.fretSelectMatch.obj = q.chords.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
      else
      if(qry.fretSelectMatch.type === 'scale')
        qry.fretSelectMatch.obj = q.scales.obj( qry.fretSelectMatch.note, qry.fretSelectMatch.abr )
    }

    if(this.state.scaleName !== '' && qry.root)
      qry.scale = q.scales.obj( qry.note, this.state.scaleName )
    if(this.state.chordName !== '' && qry.root)
      qry.chord = q.chords.obj( qry.note, this.state.chordName )
    if(this.state.ivlName !== '' && qry.root){
      qry.ivl = q.intervals.byName( this.state.ivlName )    //this.props.ivlName == abr
      qry.ivl.note = q.notes.calc( qry.note, qry.ivl )
      // qry.ivl.notes = q.notes.bySemis( qry.root.semis +qry.ivl.semis )
    }
    return qry
  }
  render(){
    let qry = this.makeQuery()
    console.log('Fretboard.render()', this.props, this.state, qry)
    return(
      <div className='fretboard' id={'Fretboard'+this.props.fbid}>
        <FretPnl
          collapsed={this.state.collapsed}
          fretFirst={this.state.fretFirst}
          fretLast={this.state.fretLast}

          ivlName={this.state.ivlName}

          selNoteVal={this.state.selNoteVal} 

          qry={qry}
          stateChange={this.stateChange}
          strgFltr={this.strgFltr}
          fretSelectFind={this.fretSelectFind}
        />
        <QueryPnl 
          fbid={this.props.fbid}
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
          strgFltr={this.strgFltr} 
         />
      </div>
    )
  }
}

export default Fretboard;
