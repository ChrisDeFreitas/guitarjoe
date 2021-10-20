/*
  FretPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - manage activation of fretboard controls for GuitarJoe app

*/

import React from 'react'
import { motion } from "framer-motion"

import './FretPnl.css';
import Fret from './Fret.jsx';
import FretButton from './FretButton.jsx';
import q from "./guitar_lib.js";

class FretPnl extends React.Component{

  constructor (props) {
    super(props)
    this.fretClick = this.fretClick.bind(this)
    this.fretFltrClick = this.fretFltrClick.bind(this)
    this.strgFltrClick = this.strgFltrClick.bind(this)
  }
  keyii = 0
  key(){ return 'FPnl' +(++this.keyii) }

  fretClick( event ){
    let qry = this.props.qry,
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

    if(this.props.strgFiltered( strN ) === true)
      return

    // console.log('fretPnl.fretClick:', strN, fret, cell.className)
    let note = q.notes.obj( strN, fret )
    let btn = document.querySelector( '#Fretboard' +qry.fbid +' .fretButton[data-tab=' +note.tab +']')
    if(btn !== null){
      // Note: ignore because they should click the button
      // however, this works:
      //   event.target = btn
      //   btn.click( event )
      return
    } else
    if(['','noteSelect'].indexOf(qry.rootType) >= 0){
		  this.props.stateChange( 'fretRoot', note )
    }else
    if(qry.rootType === 'fretRoot'){
		  this.props.stateChange( 'fretSelect', [qry.root, note] )
    }else
    if(qry.rootType === 'fretSelect'){
	    this.props.stateChange( 'fretSelect', note )
    }
  }
  fretFltrClick( event ){ //toggle state for frets
    let //qry = this.props.qry,
      btn = event.currentTarget,
      fret = Number( btn.dataset.fret )

    event.stopPropagation()
    // console.log( 'fretFltrClick:', fret, qry.fretFilter )
    this.props.stateChange( 'fretFilter', fret )
  }
  strgFltrClick( event ){
    let btn = event.currentTarget,
      strN = btn.dataset.strn
    this.props.stateChange( 'strgFilter', strN )
    event.stopPropagation()
  }  
  
  rootFind( nobj ){    //select fret = selected fret
    let qry = this.props.qry
    if(qry.rootType !== 'fretRoot') return null

    if(nobj.tab === qry.root.tab){
      return <FretButton key={this.key()}
                root={qry.root} nobj={nobj}  qry={qry} 
                fretSelectFind={this.props.fretSelectFind} 
                stateChange={this.props.stateChange} 
              />
    }
    return null
  }
  noteFind( nobj ){    //select all frets with note = selNoteVal
    let qry = this.props.qry
    if(qry.rootType !== 'noteSelect') return null

    let idx = nobj.notes.indexOf(qry.note)
    if(qry.note === '' ||  idx >= 0){
      if(qry.octave === 0 || qry.octave === nobj.octave){
        if(qry.note !== '')
          nobj.note = qry.note
        // return qq.button( nobj, qry.root  )
        return <FretButton key={this.key()} 
                root={qry.root} nobj={nobj}  qry={qry} 
                fretSelectFind={this.props.fretSelectFind} 
                stateChange={this.props.stateChange} 
              />
  }  }
    return null
  }
  fretSelectFind( nobj ){
    let qry = this.props.qry

    if(qry.rootType !== 'fretSelect') return null
    if(qry.fretSelect.length === 0) return null

    for(let fso of qry.fretSelect){
      if(nobj.tab === fso.tab){
        if(qry.octave === 0 || qry.octave === nobj.octave){
          nobj.ivl = fso.ivl
          nobj.note = fso.note
          // return qq.button( nobj, qry.root )
          return <FretButton key={this.key()} 
                    root={qry.root} nobj={nobj}  qry={qry} 
                    fretSelectFind={this.props.fretSelectFind} 
                    stateChange={this.props.stateChange} 
                  />
        }
      }
    }
    return null
  }
  fretSelectMatchFind( nobj ){
    let qry = this.props.qry

    if(qry.rootType !== 'fretSelect') return null
    if(qry.fretSelectMatch === null) return null

    for(let ivl of qry.fretSelectMatch.obj.ivls){
      if(nobj.notes.indexOf( ivl.note ) >= 0){
        if(qry.octave === 0 || qry.octave === nobj.octave){
          nobj.ivl = ivl
          nobj.note = ivl.note
          if(this.props.fretSelectFind( nobj.tab ) < 0)
            nobj.fsmatch = true
          // return qq.button( nobj, qry.root )
          return <FretButton key={this.key()} 
                    root={qry.root} nobj={nobj}  qry={qry} 
                    fretSelectFind={this.props.fretSelectFind} 
                    stateChange={this.props.stateChange} 
                  />
        }
      }
    }
    return null
  }
  scaleTriadFind( nobj ){
    let qry = this.props.qry
    if(qry.scale === null) return null
    if(qry.scaleTriadIvls === null) return null

    let ivl = q.intervals.findNote( qry.scaleTriadIvls, nobj )
    if( ivl === null ) return null

    nobj.note = ivl.note
    nobj.ivl = ivl
    nobj.state = 'triad' +(ivl.num === 1 ?1 :'')
    return <FretButton key={this.key()} 
              root={qry.root} nobj={nobj}  qry={qry} 
              fretSelectFind={this.props.fretSelectFind} 
              stateChange={this.props.stateChange} 
           />
  }
  octaveFind( nobj ){  //find notes for selected octave
    let qry = this.props.qry
    if(qry.note !== '') return

    if(qry.octave === nobj.octave){
      nobj.ivl = qry.ivl
      return <FretButton key={this.key()} 
                root={qry.root} nobj={nobj}  qry={qry} 
                fretSelectFind={this.props.fretSelectFind} 
                stateChange={this.props.stateChange} 
              />
    }
    return null
  }
  scaleFind( nobj ){
    let qry = this.props.qry
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
          // return qq.button( nobj, qry.root )
          return <FretButton key={this.key()} 
                    root={qry.root} nobj={nobj}  qry={qry} 
                    fretSelectFind={this.props.fretSelectFind} 
                    stateChange={this.props.stateChange} 
                  />
        }
      }
    }
    return null
  }
  chordFind( nobj ){
    let qry = this.props.qry
    if(qry.chord === null) return null

    if(qry.chordInvrNotes !== null){    //inversion format take precedence
      let inv = this.props.inversionNoteByTab( nobj.tab )
      if(inv !== null){
        if(qry.octave === 0 || qry.octave === nobj.octave){
          nobj.note = inv.note
          nobj.ivl = inv.invr
          nobj.state = 'invr' +(inv.invr.num === 1 ?1 :'')
          return <FretButton key={this.key()} 
                    root={qry.root} nobj={nobj}  qry={qry} 
                    fretSelectFind={this.props.fretSelectFind} 
                    stateChange={this.props.stateChange} 
                  />
        }
      }
    }
    if(qry.rootType === 'fretRoot'){    //exclude frets out of range
      if(q.fretboard.fretInRange(nobj, qry.root) !== true)
        return null
    }
    for(let ivl of qry.chord.ivls){
      if( nobj.notes.indexOf(ivl.note) >= 0){
        if(qry.octave === 0 || qry.octave === nobj.octave){
          nobj.ivl = ivl
          nobj.note = ivl.note
          nobj.state = 'chord' +(ivl.abr === 'P1' ?'1' :'')
          return <FretButton key={this.key()} 
                    root={qry.root} nobj={nobj}  qry={qry} 
                    fretSelectFind={this.props.fretSelectFind} 
                    stateChange={this.props.stateChange} 
                  />
        }
      }
    }
    return null
  }
  ivlFind( nobj ){     //select frets matching interval
    let qry = this.props.qry
    if(qry.ivl === null) return null
    
    let btn = null
    if( (qry.rootType === 'fretRoot' && nobj.tab === qry.root.tab)
    ||  (qry.rootType === 'noteSelect' && nobj.notes.indexOf(qry.note) >= 0) ){ //this is the root note object
      btn = 'root'
    } else
    if(qry.rootType === 'fretRoot' && q.fretboard.fretInRange(nobj, qry.root, 4) === true){
      if( nobj.notes.indexOf(qry.ivl.note) >= 0 )
        btn = true
    }else
    if(qry.rootType === 'noteSelect' && nobj.notes.indexOf(qry.ivl.note) >= 0){
      btn = true
    }

    if(btn === 'root'){
      nobj.ivl = q.intervals.byName('P1')
      nobj.note = qry.note
      // btn = qq.button( nobj, qry.root  )
    }else
    if(btn === true){
      if(qry.octave === 0 || qry.octave === nobj.octave){
        nobj.ivl = qry.ivl
        nobj.note = qry.ivl.note
        nobj.state = 'interval'   //new, allow for color coding of intervals
        // btn =  qq.button( nobj, qry.root  )
      }
      else
        btn = null
    }
    if(btn != null)
      return <FretButton key={this.key()} 
                root={qry.root} nobj={nobj}  qry={qry} 
                fretSelectFind={this.props.fretSelectFind} 
                stateChange={this.props.stateChange} 
              />
    return null
  }

  buttonFind( nobj ){
    let qry = this.props.qry
    let btn = null

    // ordering is critical because it determines which buttons are on top
    // all modes respect selOctave filter

    //All notes mode
    if(qry.rootType === 'noteSelect' && this.props.selNoteVal === 'All')
      btn = <FretButton key={this.key()} 
              root={'ALL'} nobj={nobj}  qry={qry} 
              fretSelectFind={this.props.fretSelectFind} 
              stateChange={this.props.stateChange} 
            />
    //fretSelect mode
    if(btn === null) btn = this.fretSelectMatchFind( nobj )
    if(btn === null) btn = this.fretSelectFind( nobj )

    //noteSelect mode
    if(btn === null) btn = this.ivlFind( nobj )
    if(btn === null) btn = this.chordFind( nobj )
    if(btn === null) btn = this.scaleTriadFind( nobj )
    if(btn === null) btn = this.scaleFind( nobj )
    if(btn === null){
      if(qry.rootType === 'fretRoot')
        btn = this.rootFind( nobj )  //only select the fret clicked
      else
      if(qry.rootType === 'noteSelect')
        btn = this.noteFind( nobj )  //select all frets with note = selNoteVal
    }
    if(btn === null) btn = this.octaveFind( nobj )
    return btn
  }

  render(){
    // console.log('fretPnl.render()', this.props)
    let qry = this.props.qry

    //make table's tr and td
    let trArray = [],
      fretMax = q.fretboard.fretMax,    
      first = this.props.fretFirst,
      // last = this.props.fretLast,
      ss = ''
    for (let row = 1; row <= 9; row++) {
      let frets = []
      let strN = row -1
      let strgFltr = this.props.strgFiltered( strN )

      for (let col = 0; col <= fretMax +1; col++) {
        let 
          fretFltr = (qry.fretFilter.indexOf( col ) >= 0),
          cls = '', 
          clickfunc = this.fretClick,
          content = null

        if(row === 1){  //top border, with fret numbers, fret filtering
          let ss = (col === first || col === (fretMax +1) ?' ' :col)
          let ssClassName = 'fretFilterDiv'
          if( qry.collapsed === true){
            ss = ''
            if( [5,7,9,12].indexOf(col) >= 0 )
              ssClassName = 'fretFilterCollapsed'
          }
          cls = (col === (fretMax +1) ?'borderRight tdBorder'+col :'tdBorder'+col)
          clickfunc = this.fretFltrClick
/*
this animation causes other anims to run on every re-draw
              animate={ qry.collapsed === true ?'collapsed' :'default' }
              variants={{
                collapsed: { color:'#0000', textShadow:'1px 1px 5px #0000' },
                default: { color:'#ffffff80', textShadow:'1px 1px 5px #0008' },
              }}
              transition={{ ease:"easeOut", duration:0.4 }}
*/          
          content = <div key={this.key()} data-fret={col} className={ssClassName} >{ss}</div>
        }else
        if(row === 9){  //bottom frame
            cls = (col === (fretMax +1)
              ? 'borderRight tdBottom col'+col    //right bottom corner frame
              : 'tdBottom col'+col
            )
        }
        else{   // generate frets with right and left borders
          cls = (col === fretMax +1
            ?'borderRight col'+col      // right border
            :'fret fret'+col)

          //process fret button
          let nobj = null
          if( strN <= 6
           && fretFltr === false    //no filter applied to fret
           && strgFltr === false    //no filter applied to string
           && col >= this.props.fretFirst 
           && col <= this.props.fretLast){         //filter by fretboard range
            nobj = q.notes.obj( strN, col )
            content = this.buttonFind( nobj )
          }
        }
        
        frets.push(
          <Fret key={this.key()}
            fretFirst={this.props.fretFirst}
            fretLast={this.props.fretLast}
            fretFiltered={fretFltr} 

            strg={strN} 
            fret={col} 

            className={cls} 
            content={content}
            onClick={clickfunc} 
            strgFltrClick={this.strgFltrClick} 
          />
        )
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
