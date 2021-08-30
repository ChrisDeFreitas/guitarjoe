/*
  App.js
  - by Chris DeFreitas, chrisd@europa.com
  - entrypoint for GuitrJoe app

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
import Fretboard from "./Fretboard.js"

// import InfoPopup from "./InfoPopup.js"
import Popup from 'reactjs-popup';

import { ReactComponent as Logo } from './resources/logo.svg'

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

  const Modal = () => (  
    <Popup
      trigger={<button className="btnInfo">About</button>}
      modal
      nested
    >
      {close => (
        <div className="modal">
          <div className="header"> About GuitarJoe </div>
          <div className="content">
Important: <br />
&nbsp;&nbsp; please explore by clicking/tapping...<br />
&nbsp;&nbsp; clicking a fret and selecting a note provide different results<br />
&nbsp;&nbsp; zoom using your browser's zoom controls
<br /><br />
GuitarJoe is a free web application, no ads, no logins, no tracking.  
The goal was to create a tool that would make guitar theory accessible while practicing.
I was going crazy taking notes and diagraming chords, scales and intervals: I needed a tool
to facilitate my understanding so I could focus on the guitar instead of managing scraps of information.
This application has successfully reduced my hair loss--I hope it has the same effect on you!
<br /><br />
The functionality is stable. 
There is a lot more planned, but I am working on other aspects of the project.
At this point it is a proof of concept as I wrangle technologies and concepts.  
It will always be free; a warm thanks for those who have supported my various journeys.
<br /><br />
Send comments and bugs to chrisd@europa.com. Tested to work in Chrome, Firefox, and Safari(iPad).

<br /><br />
Thanks to:<br />
&nbsp;&nbsp; Application hosted on <a href='https://github.com/ChrisDeFreitas/guitarjoe' target='_new'>Github</a>  <br />
&nbsp;&nbsp; Background image from <a href='https://www.flickr.com/photos/webtreatsetc/with/4514047664/' target='_new'>WebTreats ETC</a> <br />
&nbsp;&nbsp; Built with the <a href='https://reactjs.org/' target='_new'>React</a> Javascript library <br />
&nbsp;&nbsp; Fuggles font by Robert Leuschke on <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Google Fonts</a> <br />
&nbsp;&nbsp; Guitar icon by monkik from the <a href='https://thenounproject.com/term/guitar/2588464/' target='_new'>Noun Project</a> <br />
&nbsp;&nbsp; Guitar scales verified using <a href='https://jguitar.com/scale' target='_new'>jguitar.com</a><br />
&nbsp;&nbsp; Music theory from <a href='https://www.wikipedia.org/' target='_new'>Wikipedia</a><br />
&nbsp;&nbsp; Popup control from <a href='https://react-popup.elazizi.com/' target='_new'>reactjs-popup</a> <br />
<br />
Created by Chris DeFreitas, BC Canada<br />
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                console.log('modal closed ');
                close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Popup>
  )

  return (
    <div className="App">
			<header className="App-header header">
        <Logo className="Logo" alt="Logo" />
        GuitarJoe v0.1 <Modal />
      </header>
			{list}
    </div>
  )
}



export default App;

