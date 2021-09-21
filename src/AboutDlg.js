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
&nbsp;- Everything is clickable...please explore<br />
&nbsp;- use your browser's zoom controls to enlarge/shrink the controls
<br /><br />
GuitarJoe is a free web application, no ads, no logins, no tracking.  
The goal was to create a tool that would make guitar theory accessible while practicing.
I am not anything close to a musician, so
I was going crazy taking notes and diagraming chords, scales and intervals: I needed a tool
to facilitate my understanding so I could focus on the guitar instead of managing scraps of information.
This application has successfully reduced my hair loss--I hope it has the same effect on you!
<br /><br />
At this point it is a proof of concept as I wrangle technologies and concepts.  
I am an IT guy who is (obviously) not musically gifted, so there is a lot of research behind the functionality.
My aim is to keep the app freely available to support those learning guitar; a warm thanks for those who have supported my various journeys.
<br /><br />
&nbsp;- Tested to work in Chrome(Windows), Firefox(Windows, Linux), and Safari(iPad, iPhone)<br />
&nbsp;- Review documentation, updates and references in the <a href='https://github.com/ChrisDeFreitas/guitarjoe/' target='_new'>GitHub Repository</a> <br />
&nbsp;- Send comments and bugs to <a href='mailto:ChrisDeFreitas777@gmail.com?subject=GuitarJoe:'>ChrisDeFreitas777@gmail.com</a>
<br /><br />
Thanks to<br />
&nbsp;- Application hosted on <a href='https://github.com/ChrisDeFreitas/guitarjoe' target='_new'>Github</a>  <br />
&nbsp;- Background image from <a href='https://www.flickr.com/photos/webtreatsetc/with/4514047664/' target='_new'>WebTreats ETC</a> <br />
&nbsp;- Built with the <a href='https://reactjs.org/' target='_new'>React</a> Javascript library <br />
&nbsp;- Chords verified using <a href='https://www.omnicalculator.com/other/chord' target='_new'>Omni Chord Calculator</a><br />
&nbsp;- <a href='https://chir.ag/projects/name-that-color/'>Name that Color</a> by Chirag Meta
&nbsp;- Fuggles font by Robert Leuschke on <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Google Fonts</a> <br />
&nbsp;- Guitar icon by monkik from the <a href='https://thenounproject.com/term/guitar/2588464/' target='_new'>Noun Project</a> <br />
&nbsp;- Intervals verified using <a href='https://www.omnicalculator.com/other/music-interval' target='_new'>Omni Music Interval Calculator</a><br />
&nbsp;- Music theory from <a href='https://www.wikipedia.org/' target='_new'>Wikipedia</a><br />
&nbsp;- Popup control from <a href='https://react-popup.elazizi.com/' target='_new'>reactjs-popup</a> <br />
&nbsp;- Scales researched with <a href='https://ianring.com/musictheory/scales' target='_new'>A Study of Scales</a> at <a href='https://ianring.com/musictheory/'>The Exciting Universe Of Music Theory</a><br />
&nbsp;- Scales researched with <a href='https://www.scales-chords.com/scalenav.php' target='_new'>ScaleChords' Musical Scale Navigator</a><br />
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