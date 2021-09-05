/*
  About Dialog
  - for GuitarJoe by Chris DeFreitas

  requires:
    Dialog.css
*/
import React from 'react';
import Popup from 'reactjs-popup';
import './Dialog.css';

const About = () => (  
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
&nbsp;- please explore by clicking/tapping stuff<br />
&nbsp;- clicking a fret or selecting a note provide different results<br />
&nbsp;- zoom using your browser's zoom controls
<br /><br />
GuitarJoe is a free web application, no ads, no logins, no tracking.  
The goal was to create a tool that would make guitar theory accessible while practicing.
I am not anything close to a musician, so
I was going crazy taking notes and diagraming chords, scales and intervals: I needed a tool
to facilitate my understanding so I could focus on the guitar instead of managing scraps of information.
This application has successfully reduced my hair loss--I hope it has the same effect on you!
<br /><br />
The functionality is stable. 
At this point it is a proof of concept as I wrangle technologies and concepts.  
There is a lot more planned, but I am working on other aspects of the project.
It will always be free; a warm thanks for those who have supported my various journeys.
<br /><br />
&nbsp;- Tested to work in Chrome, Firefox, and Safari(iPad)<br />
&nbsp;- Review documentation, updates and references in the <a href='https://github.com/ChrisDeFreitas/guitarjoe/' target='_new'>GitHub Repository</a> <br />
&nbsp;- Send comments and bugs to <a href='mailto:chrisd@europa.com?subject=GuitarJoe:'>chrisd@europa.com</a>
<br /><br />
Thanks to<br />
&nbsp;- Application hosted on <a href='https://github.com/ChrisDeFreitas/guitarjoe' target='_new'>Github</a>  <br />
&nbsp;- Background image from <a href='https://www.flickr.com/photos/webtreatsetc/with/4514047664/' target='_new'>WebTreats ETC</a> <br />
&nbsp;- Built with the <a href='https://reactjs.org/' target='_new'>React</a> Javascript library <br />
&nbsp;- Chords verified using <a href='https://www.omnicalculator.com/other/chord' target='_new'>Omni Chord Calculator</a><br />
&nbsp;- Fuggles font by Robert Leuschke on <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Google Fonts</a> <br />
&nbsp;- Guitar icon by monkik from the <a href='https://thenounproject.com/term/guitar/2588464/' target='_new'>Noun Project</a> <br />
&nbsp;- Intervals verified using <a href='https://www.omnicalculator.com/other/music-interval' target='_new'>Omni Music Interval Calculator</a><br />
&nbsp;- Music theory from <a href='https://www.wikipedia.org/' target='_new'>Wikipedia</a><br />
&nbsp;- Popup control from <a href='https://react-popup.elazizi.com/' target='_new'>reactjs-popup</a> <br />
&nbsp;- Scales verified using <a href='https://www.scales-chords.com/scalenav.php' target='_new'>ScaleChords Musical Scale Navigator</a><br />
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

export default About