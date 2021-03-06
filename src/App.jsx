/*
  App.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - entrypoint for GuitrJoe app

*/
import React, { useState, useRef } from 'react';

import './App.css';
// import './Bgnd.css';
// import Bgnd from "./Bgnd.js";
import Fretboard from "./Fretboard"
import About from "./AboutDlg"
import { ReactComponent as Logo } from './resources/logo.svg'

function App(){

  const [fbs, setFbs] = useState( [{id:0, state:true}] )  //one cell for each fretboard instance
  const [newid, setNewId] = useState( null )		// assigned in duplicate()

  const useFirstRender = () => {    //will return false after initial call
    const ref = useRef(true);
    const firstRender = ref.current;
    ref.current = false;
    return firstRender;
  }

  function indexOfFbid( fbid ){
    for(let ii=0; ii < fbs.length; ii++){
      if(fbs[ii].id === fbid)
        return ii
    }
    return false
  }
  function duplicate( fretboard ){
    let fbid = fretboard.props.fbid,
      list = fbs.slice(),
      nid = list.length,
      obj = {id:nid, state:fretboard.state},
      idx = indexOfFbid( fbid )
      
    if(idx === false)
      throw new Error(`App.duplicate() error, fbid=[${fbid}] not found.`)
      
    list.splice( (idx +1), 0, obj)		
    setFbs( list )
    setNewId( nid )
    // console.log('App.duplicate', list)
  }
  function remove( fretboard ){
    let fbid = fretboard.props.fbid,
      list = fbs.slice(),
      idx = indexOfFbid( fbid )
     
    if(idx === false)
      throw new Error(`App.remove() error, fbid=[${fbid}] not found.`)

    list[ idx ].state = false
    setNewId( null )
    setFbs( list )
    // console.log('App.remove()', fbid, list)
  }

  let list = [], 
    fbCount=fbs.length,
    firstRender = useFirstRender()

  for(let ii=0; ii < fbCount; ii++){
    let el = null,
      id = fbs[ii].id,       //use in .key to help react
      state = fbs[ii].state  //one of: true, state object, false(a deleted fretboard)
    if(id === newid){   //create new fretboard
      el = <Fretboard key={id} fbid={id} duplicate={duplicate} remove={remove} 
				collapsed={state.collapsed}
				fretFirst={state.fretFirst}
				fretLast={state.fretLast}
				fretBtnText={state.fretBtnText}
				
        fretFilter={state.fretFilter}
				strgFltrList={state.strgFltrList}
        noteFilter={state.noteFilter}
        
        fretSelect={state.fretSelect}
        fretSelectMatch={state.fretSelectMatch}
        fretSelectMatchDisplay={state.fretSelectMatchDisplay}

				mode={state.mode}
				fretRoot={state.fretRoot}
				selNoteVal={state.selNoteVal} 
				octave={state.octave} 

				scaleName={state.scaleName}
        scaleTriadDisplay={state.scaleTriadDisplay}
        scaleTriadSelected={state.scaleTriadSelected}

				chordName={state.chordName}
        chordInvrDisplay={state.chordInvrDisplay}
        chordInvrSelected={state.chordInvrSelected}
		
        ivlName={state.ivlName}
        helpManager={state.helpManager}
        firstRender={false}
      />
    }else{
      if(state !== false){ //existing fretboard; magic of react does not overwrite old data
        el = <Fretboard key={id} fbid={id} 
          duplicate={duplicate} 
          firstRender={firstRender}
          remove={remove} 
        />
      }
    }
    if(el != null)
      list.push( el )
  }

  return (
    <div className="App">
			<header className="App-header header">
        <Logo className="Logo" alt="Logo" />
        GuitarJoe v0.1.8 
        <About />
      </header>
			{list}
    </div>
  )
}

export default App;
