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
        <div className="header"> About GuitarJoe <hr className='hrLine' /> </div>
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
About Chord Inversions<br />
The guitar provides many combinations for inversions.  The app tryies to display the ideal inversion:  
The bass note is highlighted, then the remaining notes are selected in order, on higher strings.  
Unfortunately, this 
results in certain inversion having no selections on the fretboard, such as CMaj7 third position.  
<br /><br />
&nbsp;- Tested to work in Chrome(Windows), Firefox(Windows, Linux), and Safari(iPad, iPhone)<br />
&nbsp;- Review documentation, updates and references in the <a href='https://github.com/ChrisDeFreitas/guitarjoe/' target='_new'>GitHub Repository</a> <br />
&nbsp;- Send comments and bugs to <a href='mailto:ChrisDeFreitas777@gmail.com?subject=GuitarJoe:'>ChrisDeFreitas777@gmail.com</a>
<br /><br />
Thanks to<br />
&nbsp;- Application hosted on <a href='https://github.com/ChrisDeFreitas/guitarjoe' target='_new'>Github</a>  <br />
&nbsp;- Background image from <a href='https://www.flickr.com/photos/webtreatsetc/with/4514047664/' target='_new'>WebTreats ETC</a> <br />
&nbsp;- Built with the <a href='https://reactjs.org/' target='_new'>React</a> Javascript library <br />
&nbsp;- Fuggles font by Robert Leuschke on <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Google Fonts</a> <br />
&nbsp;- Guitar icon by monkik from the <a href='https://thenounproject.com/term/guitar/2588464/' target='_new'>Noun Project</a> <br />
&nbsp;- Popup control from <a href='https://react-popup.elazizi.com/' target='_new'>reactjs-popup</a> <br />
&nbsp;- <a href='https://github.com/rigobauer/react-abcjs'>react-abcjs</a>, a React component that renders notes on music staffs <br />
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