/*
  FretPnl.js
  - by Chris DeFreitas, chrisd@europa.com
  - manage activation of fretboard controls for GuitarJoe app

*/

import React from 'react'
import './FretPnl.css';
import q from "./guitar_lib.js";

class FretPnl extends React.Component{

  constructor (props) {
    super(props)
    this.buttonClick = this.buttonClick.bind(this)
    this.fretBtnTextChange = this.fretBtnTextChange.bind(this)
    this.fretClick = this.fretClick.bind(this)
    this.fretFltrClick = this.fretFltrClick.bind(this)
    this.strgFltrClick = this.strgFltrClick.bind(this)
  }
  buttonClick( event ){
    let btn = event.target
    if(btn.nodeName !== 'BUTTON'){ 
      btn = btn.parentNode      //span
      if(btn.nodeName !== 'BUTTON') 
        btn = btn.parentNode    //span span
    }
    if(btn.nodeName !== 'BUTTON') return
    
    //toggle button
    let selected = Number( btn.dataset.selected )
    if(selected === 0)
      btn.dataset.selected = 1
    else
    if(selected === 1)
      btn.dataset.selected = 0
 
    event.stopPropagation()
  }
  fretBtnTextChange( event ){   //toggle formatting of fret button captions
    // console.log('fretBtnTextChange', event)
    event.stopPropagation()
    if(this.props.qry.fretBtnText === 'NoteFirst')
   		this.props.stateChange( 'fretBtnText', 'IvlFirst' )
    else
   		this.props.stateChange( 'fretBtnText', 'NoteFirst' )
  }
  fretClick( event ){
    let //qry = this.props.qry,
      cell = event.target,
      strN = Number(cell.dataset.strn), 
      fret = Number(cell.dataset.fret)

    if( isNaN(strN) ){
      console.log('FretPnl.fretClick() error, bad caller:', cell)
      return 
    }
    event.stopPropagation()
    if(cell.dataset.fretfilter === "true")
      return

    if(strN === 7){
      strN = 6
    }else
    if(strN !== 1 && cell.nodeName === 'TD'){ //calc string to use
      let  cy = event.clientY,
        abs = cell.getBoundingClientRect(),
        top = abs.top,
        mid = top +(cell.offsetHeight  /2)

      if(cy < mid) strN--
    }

    if(this.props.strgFltr( strN ) === true)
      return

    // console.log('fretPnl.fretClick:', strN, fret, cell.className)
    let root = q.notes.obj( strN, fret )
		this.props.stateChange( 'fretRoot', root )
  }
  fretFltrClick( event ){ //toggle state for frets
    let qry = this.props.qry,
      btn = event.currentTarget,
      fret = Number( btn.dataset.fret )

    console.log( 'fretFltrClick:', fret, qry.fretFilter )
    this.props.stateChange( 'fretFilter', fret )
    event.stopPropagation()
  }
  strgFltrClick( event ){
    let btn = event.currentTarget,
      strN = btn.dataset.strn,
      newstate = !this.props.strgFltr( strN )
    this.props.stateChange( 'strgFltr'+strN, newstate )
    event.stopPropagation()
  }  

  button( nobj, root ){
    // sample:
    // <button title='Note' className='fretButton'>C
    //   <sub title='octave'>4</sub>
    //   <sup title='Interval'>P1</sup>
    // </button>
    let qry = this.props.qry, ivl = nobj.ivl, capStyle = qry.fretBtnText

    let btnState = '', selected = 0
    if(root === 'ALL'){   //user selected All Notes
      if(qry.octave !== 0 && qry.octave !== nobj.octave)
        return null      
      capStyle = 'NoteFirst' //force for this selection
    }else
    if(qry.rootType === 'fretRoot'){
      if(nobj.notes.indexOf( root.note ) >= 0  &&  nobj.semis === root.semis){
        btnState = qry.rootType
      }
    }else
    if(qry.rootType === 'selNote'){
      if(root.notes.indexOf( nobj.note ) >= 0){ 
        btnState = qry.rootType
      }
    }
 
    //test against props.noteFilter -- allow overriding roottype because user selected
    if(qry.noteFilter.indexOf( nobj.note ) >= 0){
      btnState = 'noteFilter'
    }
    
    //test against props.tabFilter
    // if(selected === 0){}
    
    //format button caption
    let btncaption = [], key=0
    if(capStyle === 'IvlFirst'){
      if(nobj.ivl){
        btncaption.push(
          <span key={++key} className='spanIvl' onClick={this.buttonClick} >
            <span key={++key} onClick={this.buttonClick} >{ivl.abr.substr(0,1)}</span>
            {ivl.abr.substr(1)}
          </span>
        )
      }
      btncaption.push(
        <sub key={++key} className='subNote' onClick={this.fretBtnTextChange}>{nobj.note}
            <sub key={++key} className='subOctave' >{nobj.octave}</sub>
        </sub>
      )
    } else {
    // if(capStyle === 'NoteFirst'){
      btncaption.push(
        <span key={++key} className='spanNote'  onClick={this.buttonClick} >{nobj.note}
            <sub key={++key} className='subOctave' onClick={this.buttonClick} >{nobj.octave}</sub>
        </span>
      )
      if(nobj.ivl){
        btncaption.push(
          <sub key={++key} className='subInterval' onClick={this.fretBtnTextChange} >{ivl.abr}</sub>
        )
      }
    }
 
    return(
      <button key={nobj.semis} className='fretButton'  onClick={this.buttonClick}
        data-strn={nobj.strg.num} data-fret={nobj.fret} 
        data-state={btnState} data-selected={selected}
      >
        {btncaption}
      </button>
    )  
  }
  render(){
    let qq = this,
      qry = this.props.qry
    // console.log('fretPnl.render()', this.props)

    function local_rootFind( nobj ){    //select fret = selected fret
      if(qry.rootType !== 'fretRoot') return null

      if(nobj.fret === qry.root.fret && nobj.strg.num === qry.root.strg.num){
        return qq.button( nobj, qry.root  )
      }
      return null
    }
    function local_noteFind( nobj ){    //select all frets with note = selNoteVal
      if(qry.rootType !== 'selNote') return null

      let idx = nobj.notes.indexOf(qry.note)
      if(qry.note === '' ||  idx >= 0){
        if(qry.octave === 0 || qry.octave === nobj.octave){
          if(qry.note !== '')
            nobj.note = qry.note
          return qq.button( nobj, qry.root  )
      }  }
      return null
    }

    function local_octaveFind(nobj){  //find notes for selected octave
      if(qry.note !== '') return

      if(qry.octave === nobj.octave){
        nobj.ivl = qry.ivl
        return qq.button( nobj, qry.root  )
      }
      return null
    }
    function local_scaleFind( nobj ){
      if(qry.scale === null) return null

      if(qry.rootType === 'fretRoot'){    //exclude frets
        if(q.fretboard.fretInRange(nobj, qry.root) !== true)
          return null
      }
      for(let ivl of qry.scale.ivls){
        if( nobj.notes.indexOf(ivl.note) >= 0){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            nobj.ivl = ivl
            nobj.note = ivl.note
            return qq.button( nobj, qry.root )
          }
        }
      }
      return null
    }
    function local_chordFind( nobj ){
      if(qry.chord === null) return null
      if(qry.rootType === 'fretRoot'){    //exclude frets
        if(q.fretboard.fretInRange(nobj, qry.root) !== true)
          return null
      }
      for(let ivl of qry.chord.ivls){
        if( nobj.notes.indexOf(ivl.note) >= 0){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            nobj.ivl = ivl
            nobj.note = ivl.note
            return qq.button( nobj, qry.root )
          }
        }
      }
      return null
    }
    function local_ivlFind( nobj ){     //select frets matching interval
      if(qry.ivl === null) return null
      
      let btn = null
      if( (qry.rootType === 'fretRoot' && nobj.tab === qry.root.tab)
      ||  (qry.rootType === 'selRoot' && nobj.notes.indexOf(qry.note) >= 0) ){ //this is the root note object
        btn = 'root'
      } else
      if(qry.rootType === 'fretRoot' && q.fretboard.fretInRange(nobj, qry.root, 4) === true){
        if( nobj.notes.indexOf(qry.ivl.note) >= 0 )
          btn = true
      }else
      if(qry.rootType === 'selNote' && nobj.notes.indexOf(qry.ivl.note) >= 0){
        btn = true
      }

      if(btn === 'root'){
        nobj.ivl = q.intervals.byName('P1')
        nobj.note = qry.note
        btn = qq.button( nobj, qry.root  )
      }else
      if(btn === true && (qry.octave === 0 || qry.octave === nobj.octave)){
        nobj.ivl = qry.ivl
        nobj.note = qry.ivl.note
        btn =  qq.button( nobj, qry.root  )
      }
      return btn
    }

    //make table's tr and td
    let trArray = [],
      fretMax = q.fretboard.fretMax,    
      first = this.props.fretFirst,
      last = this.props.fretLast,
      ss = ''
    for (let row = 1; row <= 9; row++) {
      let frets = []
      let strN = row -1
      let strgFltr = this.props.strgFltr( strN )

      for (let col = 0; col <= fretMax +1; col++) {
        let fval = `"${col}",`, 
          fretFltr = (qry.fretFilter.indexOf( fval ) >= 0)

        let btnStrFltr = null    //create string filter button for fret0 and fretMax
        if(col === 0 && strN >= 1 && strN <= 6){
          btnStrFltr=(<div onClick={this.strgFltrClick} data-strn={strN}
            className={'btnFilter btnStrgFltr btnStrgFltr'+strN}
           ><div>&diams;</div></div>
           )
        }

        if(row === 1){  //top border, fret filter disabled because may not be needed
          let cls = (col === (fretMax +1) ?'borderRight tdBorder'+col :'tdBorder'+col)
          let ss = (col === first || col === (fretMax +1) ?' ' :col)
          if(ss === col && qry.collapsed === true){
            if([5,7,9,12].indexOf(col) >= 0)
              ss = <div data-fret={col} className='collapsed' >&nbsp;</div>
            else
              ss = ''
          }
          frets.push( <td key={col} 
            data-fret={col} data-fretfilter={fretFltr}
            onMouseDown={this.fretFltrClick} className={cls}>{ss}</td> 
          )
        }else
        if(row === 9){  //bottom frame

          if(col === (fretMax +1))    //right bottom corner frame
            frets.push( <td key={col} className={'borderRight tdBottom col'+col}></td> )
          else {      //bottom fret frame
            frets.push(<td key={col} className={'tdBottom col'+col}></td>)
           }

        }else{   // generate frets with right and left borders

          if(col === fretMax +1){   // right border
            frets.push( <td key={col} data-strn={strN} data-col={col} className={'borderRight col'+col}></td> )
          } 
          else{ //fretboard cells
            let btn = null, stringdiv = null

            if(strN >= 1 && strN <= 6)
              stringdiv = <div className='stringdiv' onClick={this.fretClick} data-strn={strN} data-fret={col} ></div>

            //process fret button
            if( fretFltr === false    //no filter applied to fret
             && strgFltr === false    //no filter applied to string
             && col >= first 
             && col <= last){         //filter by fretboard range
              let nobj = q.notes.obj( strN, col )

              if(qry.rootType === 'selNote' && this.props.selNoteVal === 'All'){
                btn = qq.button( nobj, 'ALL' )  //no root when showimg all notes
              }
              else {
                btn = local_scaleFind( nobj )
                if(btn === null) btn = local_chordFind( nobj )
                if(btn === null) btn = local_ivlFind( nobj )
                if(btn === null){
                  if(qry.rootType === 'fretRoot')
                    btn = local_rootFind( nobj )  //only select the fret clicked
                  else
                  if(qry.rootType === 'selNote')
                    btn = local_noteFind( nobj )  //select all frets with note = selNoteVal
                }
                if(btn === null) btn = local_octaveFind( nobj )
              }
            }  

            frets.push(<td key={col} className={'fret fret'+col} onClick={this.fretClick} 
              data-strn={strN} data-fret={col} data-fretfilter={fretFltr} >
              {btnStrFltr}
              {btn}
              {stringdiv}
              <div className='fretbar' onClick={this.fretClick} data-strn={strN} data-fret={col} ></div>
            </td>)
           }
        }
      }

      if(row === 1) 
        ss = 'frame frameTop'
      else
      if(row === 8) 
        ss = 'borderBottom'
      else
      if(row === 9) 
        ss = 'frame frameBottom'
      else{
        ss = 'strg strg' +(row -1)
      }
      trArray.push( <tr key={row} className={ss} data-fltr={strgFltr}>{frets}</tr> )
    }
    return (
      <div className='fretPnlContainer'>
        <table className='fretPnl'><tbody>
          {trArray}
        </tbody></table>
      </div>
    )
  }
}

export default FretPnl
