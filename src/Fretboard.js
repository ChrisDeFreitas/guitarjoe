/*
Fretboard.js
  - by Chris DeFreitas, chrisd@europa.com
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
      fretFilter:(props.fretFilter ?props.fretFilter :''),      //csv of fretN, if found then disable fret
      strgFltrList:(props.strgFltrList ?props.strgFltrList :''),    //csv of strN, if found then hide notes
      noteFilter:(props.noteFilter ?props.noteFilter :[]),    //notes on fetboard where button.data-selected=2; set be clicking infoPnl note

      rootType:(props.rootType ?props.rootType :'s'),    //one of: [null, fretRoot, selNote]
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
  }  
  reset(){
    this.setState({ collapsed:false })
    this.setState({ noteFilter:[] })
    this.setState({ strgFltrList:'' })
    this.setState({ fretFilter:'' })
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
  stateChange( key, val){
    // if(key === 'rootType')   //only manually set below; can be prop instead of state
    //   this.setState({ rootType:val })
    // else
    if(key === 'collapsed'){
      this.setState({ collapsed:val })
    }else
    if(key === 'noteFilter'){
      let list = this.state.noteFilter.slice()
      let idx = list.indexOf( val )
 
      if(idx < 0) list.push( val )
      else list.splice( idx, 1 )
      
      this.setState({ noteFilter:list })
    }else
    if(key === 'fretBtnText'){
      this.setState({ fretBtnText:val })
    }else
    if(key === 'fretFilter'){
      let fval = `"${val}",`,
        ii = this.state.fretFilter.indexOf( fval )
      if(ii < 0)   //add to list
        val = this.state.fretFilter +fval    
      else         //remove from list
        val = this.state.fretFilter.replace(fval, '')
      this.setState({ fretFilter:val })
    }else
    if(key === 'fretRoot'){
      this.setState({ noteFilter:[] })
      this.setState({ fretRoot:val })
      if(val === null){
         this.setState({ rootType:'' })
         this.setState({ selNoteVal:'' })
      }else
        this.setState({ rootType:'fretRoot' })
    }else
    if(key === 'selNoteVal'){
      this.setState({ noteFilter:[] })
      this.setState({ selNoteVal:val })
      if(val === ''){
        this.setState({ rootType:'' })
        this.setState({ fretRoot:null })
      }else
        this.setState({ rootType:'selNote' })
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
      this.setState({ noteFilter:[] })
      this.setState({ scaleName:val })
    }else
    if(key === 'chordName'){
      this.setState({ noteFilter:[] })
      this.setState({ chordName:val })
    }else
    if(key === 'ivlName'){
      this.setState({ noteFilter:[] })
      this.setState({ ivlName:val })
    }else
    if(key === 'semis')
      this.setState({ semis:val })
  }
  makeQuery(){
    let qry = {
      rootType: this.state.rootType,
      root: null,
      letter: (this.state.rootType === 'fretRoot' ?this.state.fretRoot.letters[0] :this.state.selNoteVal), 
      octave: this.state.octave,
      scale: null,
      chord:null,
      ivl: null,

      collapsed: this.state.collapsed,
      fretBtnText: this.state.fretBtnText,
      fretFilter: this.state.fretFilter,
      noteFilter: this.state.noteFilter
    }
    if(qry.rootType === 'fretRoot')
      qry.root = this.state.fretRoot    //note object, set in FretPnl.fretClick()
    if(qry.rootType === 'selNote' && qry.letter !== '' && qry.letter !== 'All')
      qry.root = q.noteByLetter( qry.letter )    //note object
    if(this.state.scaleName !== '' && qry.root)
      qry.scale = q.scales.toObj( qry.letter, this.state.scaleName )
    if(this.state.chordName !== '' && qry.root)
      qry.chord = q.chords.toObj( qry.letter, this.state.chordName )
    if(this.state.ivlName !== '' && qry.root){
      qry.ivl = q.intervals.byName( this.state.ivlName )    //this.props.ivlName == abr
      qry.ivl.letter = q.letterCalc( qry.letter, qry.ivl )
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
