/*
  App.js
  - by Chris DeFreitas, chrisd@europa.com
  - entrypoint for GuitrJoe app

References:
  - colorizer.org
  - https://mdigi.tools
  - https://hslpicker.com/#2a1fad

Tested with:
  - wikipedia.com
  - https://jguitar.com/scale?root=A&scale=Hungarian+Gypsy&fret=0&labels=tone&notes=sharps
  - https://en.wikipedia.org/wiki/Interval_(music) 
 
*/
import React, { useState } from 'react';

// import { useSelector, useDispatch } from 'react-redux'

import './App.css';
import './Fretboard.css';
import './FretPnl.css';
import './Bgnd.css';
// import Bgnd from "./Bgnd.js";
import Fretboard from "./Fretboard.js";

function App(){

  const [fbs, setFbs] = useState( [{id:0, state:true}] )  //one cell for each fretboard instance
  const [newid, setNewId] = useState( null )		// assigned in duplicate()
  
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

  let list = [], fbCount=fbs.length
  for(let ii=0; ii < fbCount; ii++){
    let el = null,
      id = fbs[ii].id,       //use in .key to help react
      state = fbs[ii].state  //one of: true, state object, false(a deleted fretboard)
    if(id === newid){   //create new fretboard
      el = <Fretboard key={id} fbid={id} duplicate={duplicate} remove={remove} 
				fretFirst={state.fretFirst}
				fretLast={state.fretLast}
				fretBtnText={state.fretBtnText}
				fretFilter={state.fretFilter}
				strgFltrList={state.strgFltrList}
				rootType={state.rootType}
				fretRoot={state.fretRoot}
				selNoteVal={state.selNoteVal} 
				octave={state.octave} 
				scaleName={state.scaleName}
				chordName={state.chordName}
				ivlName={state.ivlName}
      />
    }else{
      if(state !== false) //existing fretboard; magic of react does not overwrite old data
        el = <Fretboard key={id} fbid={id} duplicate={duplicate} remove={remove} />
    }
    if(el != null)
      list.push( el )
  }

  return (
    <div className="App">
			<header className="App-header header">GuitarJoe v0.1</header>
			{list}
    </div>
  )
}



export default App;
