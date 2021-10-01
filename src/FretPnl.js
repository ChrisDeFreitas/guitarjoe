/*
  FretPnl.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - manage activation of fretboard controls for GuitarJoe app

*/

import React from 'react'
import './FretPnl.css';
import './FretButton.css';
import q from "./guitar_lib.js";
import Abcjs from "./react-abcjs"

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
    let qry = this.props.qry,
      btn = event.target
    if(btn.nodeName !== 'BUTTON'){ 
      btn = btn.parentNode      //span
      if(btn.nodeName !== 'BUTTON') 
        btn = btn.parentNode    //span span
    }
    if(btn.nodeName !== 'BUTTON') return
    event.stopPropagation()

    if(['fretRoot','selNote'].indexOf( qry.rootType ) >= 0  
    && ['fretRoot','selNote'].indexOf( btn.dataset.state ) >= 0
    && qry.scale === null && qry.chord === null && qry.ivl === null){    //nothing to do, turn off fretRoot state
	    this.props.stateChange( 'fretRoot', null )
    } else
    if(qry.rootType === 'fretSelect' && btn.dataset.state === 'fretSelect'
    && btn.dataset.tab === qry.fretSelect[0].tab){ //hide button
        // console.log('buttonClick(): stop fretSelect')
    		this.props.stateChange( 'fretSelect', null )
        return
    } else
    if(qry.rootType === 'fretSelect' && this.props.fretSelectFind( btn.dataset.tab ) >= 0){ //this is a selected fret
      if(qry.fretSelect.length === 2 )    //one selected fret after this hidden, change to fretRoot
		    this.props.stateChange( 'fretRoot', qry.fretSelect[0] )
      else    //more than two frets selected, deselect this button
     		this.props.stateChange( 'fretSelect', btn.dataset.tab)
    }
    else{   //toggle button selected state
      let selected = Number( btn.dataset.selected )
      if(selected === 0)
        btn.dataset.selected = 1
      else
      if(selected === 1)
        btn.dataset.selected = 0
    }
  }
  fretBtnTextChange( event ){   //toggle formatting of fret button captions
    // console.log('fretBtnTextChange', event)
    let qry = this.props.qry
    event.stopPropagation()
    
   if(qry.note === 'All'){
      if(qry.fretBtnText === 'NoteTab')
   	  	this.props.stateChange( 'fretBtnText', 'NoteAbc' )
      else
        this.props.stateChange( 'fretBtnText', 'NoteTab' )
    }
    else
    if(this.props.qry.fretBtnText === 'NoteFirst')
   		this.props.stateChange( 'fretBtnText', 'IvlFirst' )
    else
    if(this.props.qry.fretBtnText === 'IvlFirst')
   		this.props.stateChange( 'fretBtnText', 'IvlAbc' )
    else
    if(this.props.qry.fretBtnText === 'IvlAbc')
   		this.props.stateChange( 'fretBtnText', 'IvlTab' )
    else
   		this.props.stateChange( 'fretBtnText', 'NoteFirst' )
  }
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
      event.target = btn
      this.buttonClick( event )
      return
    } else
    if(['','selNote'].indexOf(qry.rootType) >= 0){
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

  button( nobj, root ){
    // sample:
    // <button title='Note' className='fretButton'>C
    //   <sub title='octave'>4</sub>
    //   <sup title='Interval'>P1</sup>
    // </button>
    let qry = this.props.qry, ivl = nobj.ivl, capStyle = qry.fretBtnText

    let btnState = '', selected = 0
    //tag root note button
    if(root === 'ALL'){   //user selected All Notes
      if(qry.octave !== 0 && qry.octave !== nobj.octave)
        return null      
      // capStyle = 'NoteTab' //force for this selection
      console.log(111, qry.fretBtnText)
      // capStyle = qry.fretBtnText
      if( ['NoteAbc','NoteTab'].indexOf( qry.fretBtnText ) < 0 )
        capStyle = 'NoteAbc'
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
    }else
    if(qry.rootType === 'fretSelect'){
      // if(nobj.ivl.abr === 'P1' && nobj.tab === qry.fretSelect[0].tab){
      if(nobj.tab === qry.fretSelect[0].tab){
        btnState = qry.rootType
      }else
      if(nobj.fsmatch)
        btnState = 'fretSelectMatch'
    }
 
    
    if(btnState === '' && nobj.state)    //allow color coding of selChords and selInterval notes
      btnState = nobj.state
    if(nobj.state === 'invr' || nobj.state === 'invr1' )  //displaying an inversion
      btnState = nobj.state
    if(qry.noteFilter.indexOf( nobj.note ) >= 0){ //test against props.noteFilter -- allow overriding roottype because user selected
      btnState = 'noteFilter'
    }

    //format button caption
    let btncaption = [], key=0
    let renderParams = {    //for AbcJs
      minPadding:5,   //doesn't work
      paddingtop:0,
      paddingbottom:0,
      paddingleft:0,
      paddingright:0,
      //responsive: "resize",
      scale:(nobj.octave <= 2 || nobj.octave >= 5 ?0.3 :0.4),
      staffwidth:18,
      textboxpadding:0,
    }

    let note = nobj.note
    let nii = note.indexOf('♭')
    if(nii >= 1)    //safari does not render ♭ properly
      note = <span className='btnFlatNote'>{note.substr(0, nii)}&#9837;</span>
    else
      note = <span>{note}</span>

    
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
    }else
    if(capStyle === 'IvlAbc'){
      btncaption.push(
        <span key={++key} className='spanIvl' onClick={this.buttonClick} >
          <span key={++key} onClick={this.buttonClick} >{ivl.abr.substr(0,1)}</span>
          {ivl.abr.substr(1)}
        </span>
      )
      btncaption.push(
        <sub key={++key} className='ivlabc abc' onClick={this.fretBtnTextChange}
           ><Abcjs key={++key} 
          abcNotation={'K:clef=none\n y' +q.notes.toAbc( nobj )}
          renderParams={renderParams} parserParams={{}} engraverParams={{}}
        /></sub>
      )
    } else
    if(capStyle === 'IvlTab'){
      btncaption.push(
        <span key={++key} className='spanIvl' onClick={this.buttonClick} >
          <span key={++key} onClick={this.buttonClick} >{ivl.abr.substr(0,1)}</span>
          {ivl.abr.substr(1)}
        </span>
      )
      btncaption.push(
        <sub key={++key} className='ivltab tab' onClick={this.fretBtnTextChange}
          >{nobj.tab}</sub>
      )
    }else
    if(capStyle === 'NoteTab'){      
      btncaption.push(
        <span key={++key} className='spanNote'  onClick={this.buttonClick} >{note}
            <sub key={++key} className='subOctave' onClick={this.buttonClick} >{nobj.octave}</sub>
        </span>
      )
      btncaption.push(
        <sub key={++key} className='notetab tab' onClick={this.fretBtnTextChange}
          >{nobj.tab}</sub>
      )
    }else
    if(capStyle === 'NoteAbc'){
      btncaption.push(
        <span key={++key} className='spanNote'  onClick={this.buttonClick} >{note}
            <sub key={++key} className='subOctave' onClick={this.buttonClick} >{nobj.octave}</sub>
        </span>
      )
      btncaption.push(
        <sub key={++key} className='abc' onClick={this.fretBtnTextChange}
           ><Abcjs key={++key} 
          abcNotation={'K:clef=none\n y' +q.notes.toAbc( nobj )}
          renderParams={renderParams} parserParams={{}} engraverParams={{}}
        /></sub>
      )
    } 
    else {
    // if(capStyle === 'NoteFirst'){
      btncaption.push(
        <span key={++key} className='spanNote'  onClick={this.buttonClick} >{note}
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
      <button key={++key} className='fretButton'  onClick={this.buttonClick}
        data-strn={nobj.strgnum} data-fret={nobj.fret} data-semis={nobj.semis}  data-tab={nobj.tab} 
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

      // if(nobj.fret === qry.root.fret && nobj.strgnum === qry.root.strgnum){
      if(nobj.tab === qry.root.tab){
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
    function local_fretSelectFind( nobj ){
      if(qry.rootType !== 'fretSelect') return null
      if(qry.fretSelect.length === 0) return null

      for(let fso of qry.fretSelect){
        if(nobj.tab === fso.tab){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            nobj.ivl = fso.ivl
            nobj.note = fso.note
            return qq.button( nobj, qry.root )
          }
        }
      }
      return null
    }
    function local_fretSelectMatchFind( nobj ){
      if(qry.rootType !== 'fretSelect') return null
      if(qry.fretSelectMatch === null) return null

      for(let ivl of qry.fretSelectMatch.obj.ivls){
        if(nobj.notes.indexOf( ivl.note ) >= 0){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            nobj.ivl = ivl
            nobj.note = ivl.note
            if(qq.props.fretSelectFind( nobj.tab ) < 0)
              nobj.fsmatch = true
            return qq.button( nobj, qry.root )
          }
        }
      }
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
      if(qry.inversionNotes !== null){
        let inv = qq.props.inversionNoteByTab( nobj.tab )
        if(inv !== null){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            // nobj.ivl = ivl
            nobj.note = inv.note
            nobj.ivl = inv.invr
            nobj.state = 'invr' +(inv.invr.num === 1 ?1 :'')
            return qq.button( nobj, qry.root )
          }
        }
      }
      if(qry.rootType === 'fretRoot'){    //exclude frets
        if(q.fretboard.fretInRange(nobj, qry.root) !== true)
          return null
      }
      for(let ivl of qry.chord.ivls){
        if( nobj.notes.indexOf(ivl.note) >= 0){
          if(qry.octave === 0 || qry.octave === nobj.octave){
            nobj.ivl = ivl
            nobj.note = ivl.note
            nobj.state = 'chord'   //new, allow for color coding of chords
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
      ||  (qry.rootType === 'selNote' && nobj.notes.indexOf(qry.note) >= 0) ){ //this is the root note object
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
        nobj.state = 'interval'   //new, allow for color coding of intervals
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
      let strgFltr = this.props.strgFiltered( strN )

      for (let col = 0; col <= fretMax +1; col++) {
        let tab = '',
          fretFltr = (qry.fretFilter.indexOf( col ) >= 0)

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
            let btn = null, stringdiv = null, nobj = null

            if(strN >= 1 && strN <= 6)
              stringdiv = <div className='stringdiv' onClick={this.fretClick} data-strn={strN} data-fret={col} ></div>

            //process fret button
            if( strN <= 6
             && fretFltr === false    //no filter applied to fret
             && strgFltr === false    //no filter applied to string
             && col >= first 
             && col <= last){         //filter by fretboard range
              nobj = q.notes.obj( strN, col )
              tab = nobj.tab

              if(qry.rootType === 'selNote' && this.props.selNoteVal === 'All'){
                btn = qq.button( nobj, 'ALL' )  //no root when showimg all notes
              }
              else {
                // all modes respect selOctave filter
                //fretSelect mode
                btn = local_fretSelectMatchFind( nobj )
                if(btn === null) btn = local_fretSelectFind( nobj )
                // fretRoot and selNote mode
                if(btn === null) btn = local_ivlFind( nobj )
                if(btn === null) btn = local_chordFind( nobj )
                if(btn === null) btn = local_scaleFind( nobj )
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
              data-strn={strN} data-fret={col} data-tab={tab} data-fretfilter={fretFltr} >
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
