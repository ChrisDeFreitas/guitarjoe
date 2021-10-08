# GuitarJoe
GuitarJoe is a web based tool that allows you to visually explore the guitar fretboard, scales, chords, intervals and notes. The current version is a proof of concept.  

The application is published to the web through <a href='https://pages.github.com/'>GitHub Pages</a>.  I plan to leave it publicly accessible until it wears out its GitHub welcome. So you can use and share it via the GitHub.io link that publishes the ./docs folder for public access:  https://chrisdefreitas.github.io/guitarjoe  

The goal was to create a tool that would make guitar theory accessible while practicing.  I was going crazy taking notes and diagramming chords, scales and intervals: I needed a tool to facilitate my understanding so I could focus on the guitar instead of managing scraps of information.  This application has successfully reduced my hair loss--I hope it has the same effect on you!

The name is based on the slang "Joe Workie," a synonym for construction worker. At the tender age of 12 it felt like one of those adults terms I had to learn--it wasn't. In this context, GuitarJoe does the heavy lifting of translating music theory to the guitar fretboard.  Here is a screenshot of my first use of the application.  I am working on playing with 5 fingers and use triplets to exercise my pinky.  It was a transformative moment, focusing on the notes in front of me instead of scribbled diagrams:  
  <img src="https://github.com/ChrisDeFreitas/guitarjoe/blob/main/public/guitarjoe-screen01.png" title="guitarjoe-screen01.png" />  

## Application Notes
- The purpose of the application is to visually explore basic music theory applied to the guitar fretboard.  It is not meant to teach or explain, but to explore. For example, I am always using it to answer these questions:  
  &nbsp; &nbsp; Am I fretting this chord/scale correctly?  
  &nbsp; &nbsp; How can I divide this chord/scale into interesting triads or power chords?  
  &nbsp; &nbsp; What scale is this cool riff in?   
  &nbsp; &nbsp; Where does this note/chord/inversion/scale exist on the fretboard?  

- Everything is clickable.  This is a key principle of the application design: everything displayed provides relevant data, and functionality is an implicit feature of data. 
- Another important principle is that user selections not be changed by the app.  So if you turn on a feature it will remain until you turn it off.  
- The app is in the early phase of development so if something seems wonky please let me know.  It may be something I had not considered.

## Music Notes
I am not a musician (I often say I'll be ready to play in a band around the age of 90).  So the data is the result of a lot of online research and verified against many other online sources.  I've documented the major online references in the sections titled Helpful References, and Thanks to.

#### Scales
The Blues Heptatonic scale has different representations online, so it is debatable.  I love learning about cultures and history so I've included some exotic scales like the Japanese Akebono I and II for practice.

#### Chords
Typically guitar chords are represented as fixed pattern of notes, leading to approaches like the CAGED system.  This app takes a different approach.  When a chord is selected all chord notes are displayed.  The user can superimpose patterns onto the selection.  The short term goal is to simplify coding at this early stage.  But, I like this approach because it allows me to see the anatomy of the chord, and find alternative chord voicings, triads, and power chords.

#### Chord Inversions
On a guitar, chord inversions work differently than in general music theory.  For guitar, the important part is the bass note, other notes may appear in any order.  In music theory all inversions require the shifted note to be exactly one octave higher.  Because the guitar provides so many possible combinations for inversions, the app straddles these uses by trying to display the ideal inversion:  The bass note is highlighted, then the remaining notes are selected in order on higher strings, ignoring octaves, and filtering by distance frets are from the bass note.  Unfortunately, this results in certain inversion having no selections on the fretboard, such as CMaj7 third position.  

## Technical Notes
- The entire application is contained within the single web page; it does not require a remote server.  The only external link is to the <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Fuggles Google Font</a> used in the header. So one could use the ./docs folder on any webserver.
- The logic of the application resides in <a href='https://github.com/ChrisDeFreitas/guitarjoe/blob/main/src/guitar_lib.js'>guitar_lib.js</a>--the code should be readable by non-techies so  feel free to review/use/suggest changes.  I created the library's test suite as I initially built the library, so it will not test all functionality. The test suite is used primarily to develop complex functionality, such as guitar_lib.notes.match() that matches a list of notes to a list of intervals.
- In terms of security, the application currently does not store or access browser data.  The future plans include saving/restoring application state using <a href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'>HTML5 Local Storage</a>--but that is way in the future.  As the code is hosted on GitHub it is scanned on a regularly for security vulnerabilities and open for review by the public.
- The application is a standard <a href='https://create-react-app.dev/'>Create React App</a>, except the ./build folder is renamed to ./docs to work with <a href='https://pages.github.com/'>GitHub Pages</a>.  See <a href='https://create-react-app.dev/docs/advanced-configuration'>BUILD_PATH environment variable</a> for details on that redirection.


## Helpful References
  - Article: [Chord Progressions for Pentatonic Melodies](https://www.secretsofsongwriting.com/2018/07/09/chord-progressions-for-pentatonic-melodies/)
  - Article: [How Chords and Scales are Related](https://www.thejazzpianosite.com/jazz-piano-lessons/jazz-scales/chord-scale-system/)
  - [The abc standard](https://abcnotation.com/wiki/abc:standard:v2.1)
  - [Chord calculator](https://whitevise.com/chords/)
  - [Chord shape calculator](https://jguitar.com/chord)
  - [Chord note calculator](https://www.omnicalculator.com/other/chord)
  - [Chord shape identifier](https://jguitar.com/chordname) 
  - [Music interval calculator](https://www.omnicalculator.com/other/music-interval)
  - <a href='https://chir.ag/projects/name-that-color/'>Name that Color</a> by Chirag Meta 
  - [Scale calculator](https://www.scales-chords.com/scalenav.php)
  - [A Study of Scales](https://ianring.com/musictheory/scales/)
  - Web based fretboard with paid services: [Fretastic](https://fretastic.com/guitar)
  - Wikipedia: [Chord names and symbols](https://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music))
  - Wikipedia: [Diatonic scale](https://en.wikipedia.org/wiki/Diatonic_scale)
  - Wikipedia: [Intervals](https://en.wikipedia.org/wiki/Interval_(music))
  - Wikipedia: [Scales](https://en.wikipedia.org/wiki/Scale_(music))
  - Wikipedia: [Scale: Blues](https://en.wikipedia.org/wiki/Blues_scale)
  - Wikipedia: [Scale: Double harmonic](https://en.wikipedia.org/wiki/Double_harmonic_scale)
  - Wikipedia: [Scale: Gypsy minor](https://en.wikipedia.org/wiki/Hungarian_minor_scale)
  - Wikipedia: [Scale: Hungarian major](https://en.wikipedia.org/wiki/Hungarian_major_scale)
  - Wikipedia: [Scale: Phrygian dominant](https://en.wikipedia.org/wiki/Phrygian_dominant_scale)
  - YouTube: [200 Guitar Riffs and Licks from the '60s](https://www.youtube.com/watch?v=gWc7RN61qaU)
  - YouTube: [Advanced Music Theory - Harmony](https://www.youtube.com/watch?v=-xZ6m1vBQg8)
  - YouTube: [La Muchacha - Pal´ Monte](https://www.youtube.com/watch?v=gMtCmxy5Umc)

## Thanks to
 - Application hosted on <a href='https://github.com/ChrisDeFreitas/guitarjoe' target='_new'>GitHub</a>   
 - Background image from <a href='https://www.flickr.com/photos/webtreatsetc/with/4514047664/' target='_new'>WebTreats ETC</a>  
 - Built with the <a href='https://reactjs.org/' target='_new'>React</a> Javascript library  
 - Fuggles font by Robert Leuschke on <a href='https://fonts.google.com/?query=Robert+Leuschke/' target='_new'>Google Fonts</a>  
 - Guitar icon by monkik from the <a href='https://thenounproject.com/term/guitar/2588464/' target='_new'>Noun Project</a>  
 - <a href='https://developer.mozilla.org/'>Mozilla Developer Network</a> web technology reference
 - Popup control from <a href='https://react-popup.elazizi.com/' target='_new'>reactjs-popup</a>  
 - <a href='https://github.com/rigobauer/react-abcjs'>react-abcjs</a>, a React component that uses abcjs 
 - <a href='https://code.visualstudio.com/'>Visual Studio Code</a> development environment


## Updates

#### 20211006:  

- upgraded to v0.1.6  
- the InfoPnl now displays triads built on degrees of the selected scale  
-- reference: https://appliedguitartheory.com/lessons/building-chords-major-scale/  
-- reference: https://en.wikipedia.org/wiki/Triad_(music)  
-- verified with: https://jguitar.com/chordname  
- create ArrowButton.jsx to control collapse/expand user interaction
- added collapse/expand functionality to the display of chord inversions, scale degree triads, and selected fret matches
- added ArrowButton to QueryPnl; clicking will apply setting to chord inversions, scale degree triads, and selected fret matches
- for speed, implemented spread syntax for object creation in guitar_lib.js  
- AboutDlg: fixed display on small screens by scrolling content; updated content  
- removed package.json reference to react-redux because redux is not used
- various tweaks and updates

#### 20211003:  
- upgraded to v.0.1.5
- created FretButton.jsx
- created InfoPnl.jsx
- the root of chords and inversions are made to standout with a darker shade
- tweaks and updates

#### 20211001:  
Added inversions for all chords. Guitar inversions work differently than in regular music theory.  For guitars, the important part is the bass note, the other notes may appear in any order.  In general music theory all inversions require the shifted note to be exactly one octave higher.  The app straddle these uses by highlighting inversion notes in their correct sequence, ignoring octaves.

FretButtons can now display their note on a staff or as guitar tab. This required adding special CSS for the latest Safari browsers:  Safari uses too much space when laying out notes containing a ♭ symbol, and the spacing of the controls is substantially different from FireFox and Chrome (on iPad and iPhone FireFox and Chrome use Safari to layout web pages).

- upgraded to v.0.1.4
- added ability to display Inversions for chords
- added new fretButton caption mode that displays Tabs
- added new fretButton caption mode that displays notes on the staff using react_abcjs  
-- tested against:  https://appliedguitartheory.com/lessons/learning-guitar-chord-inversions/   
-- reference: https://online.berklee.edu/takenote/guitar-chords-101-triad-inversions-up-the-fretboard/  
- moved fretButton styles to new file, FretButton.css
- converted Fretboard.state.strFilter to an array
- tweaks and updates

#### 20210922:  
- added color coding of chords and intervals so they standout when displayed with scales
- when a fretRoot and interval are selected, the InfoPnl now displays the root with its octave, ie G3 instead of G.  This is not applicable to selNote mode as all root notes are selected.
- fretSelectMatches are no longer cleared when the mode changes, to adhere to the principle that the user selections are not altered by the application.

#### 20210921:  
Finally added the ability to select multiple frets, then view scales and chords containing those notes (it's been a problem vexing me for a while). The new mode is called "Fret Select" and appears automatically after you click the second fret.  The list of related scales and chords will appear  within the InfoPnl, click one to have it drawn on the fretboard.  I've limited the scales searched to the typical Western ones: Major, Minor, Pentatonic, and Blues--this is easily changed.  As usual everything is clickable, so please experiment to learn about the functionality.   

Research into unusual scales found that pentatonic scales are [ancient, and common](https://en.wikipedia.org/wiki/Pentatonic_scale) throughout the world. I thought it would be interesting to experiment with those intervals while practicing so I added the Japanese Akebono I and II, and the Pygmy scales.  They appear to be consistently referenced across the web, and used in many cultures. In this context its important to note that the Western Pentatonic Major and Minor scales are native to many cultures from the past and the present. Also note, I couldn't find any theoretical references to the Pygmy scale but it is consistently used in modern Handpans and Tongue drums.   

- upgraded to v.0.1.3
- refactored Fretboard.state.fretFilter into array  
- implemented fretSelect mode: clicking multiple frets displays related chords and scales
- added green highlight when mouse hovers over items in InfoPnl
- clicking a label in the InfoPnl will turn off all manually highlighted notes, scales, and chords
- added scales: Akebono I (aka "Dorian Pentatonic"), Akebono II (aka "Hon-kumoi-joshi"), and the Pygmy Scale (aka "Aeolian Pentatonic").  Links to references are in their guitar_lib.scales.list[] definition.
- changed short form of Natural minor triad to "Minor" from "Nat.min" for readability, and to conform to the confusing standard of notating all minor scales the same way.
- clicking a fret with a button, will now route to buttonClick() instead of fretClick()

#### 20210914:  
- refactored to create guitar_lib.notes; created consistent nomenclature for notes and note objects
- refactored guitar_lib.fretboard: fret is an integer, fobj is an object returned by fretboard.obj()
- various fixes, tweaks, and optimizations

#### 20210911:  
- changed the Selected fret button background color to green  
- clicking a fret button now Selects the button (green background color) despite the previous button state (fretRoot, selRoot, or noteFilter)
- fixed bug: when an Interval is selected, the root fret button now displays the P1 interval caption
- when a fret is clicked (a fret root selected), and an Interval is selected, matching notes within 4 frets will appear. Previously, the range was 3 notes.

#### 20210909:  
- Email address update.

#### 20210908:  
This update allows note buttons to be highlighted by clicking on a note in the InfoPnl.  Once a note is selected within the InfoPnl, it will remain selected until clicked again or the reset button is clicked.  To save space, when the queryPnl is collapsed, fret numbers will be replaced by green 
bars over the 5,7,9 and 12 frets.  The click to disable fret functionality will remain
active when collapsed.

- upgraded to v.0.1.2
- on collapse fret numbers hidden, 5,7,9,12 replaced by green line
- clicking a note in the InfoPnl changes background color of similar fretButtons to blue
- created style for header buttons
- renamed ./public/logo.svg to favicon.svg
- refactored: guitar_lib.fretboard, included string and fret functions  
- refactored fretPnl.button()
- refactored to create button.dataset.selected and associated CSS
- installed source-map-explorer, found no glaring errors

#### 20210905:  
This was a rewrite of the interval calculation functionality.  Originally based on semitones but that lost track of the ♭/# info.  The new algorithm took a long time to develop and ripped the guts out of the app.  But it works well and has room for expansion, see guitar_lib.letterCalc().  In the testing I fixed many transcription errors in scales, chords and intervals--another bonus for the grueling effort.  

Usage of ♭♭ and ## removed from app. This simplifies manipulation of intervals by the library.  It is assumed anyone needing to calculate ♭♭ and ## have requirements beyond the scope of the guitar fretboard.  

- upgraded to v.0.1.1
- fixed bug: selecting C# Major scale, InfoPnl displays D♭, E♭...; should be C#, D#; need logic to display sharp vs flat consistently  
-- rewrote guitar_lib.letterCalc() because the algorithm was based on semitones  
-- removed guitar_lib.letterBySemis() because the the idea was wrong  
-- refactored code using letterBySemis() to use the new letterCalc()  
-- refactoring affected most operations so it is a big update  
- scale and chord definition error updates
- added Phrygian dominant scale   


## ToDo
- when scale selected, add chords built on scale degree
-- initially, scale === major  
-- InfoPnl: Scale Degree Chrods for C Scale   
-- InfoPnl: ii: C minor = e g b
-- q.chords.degree( root, chord.abr, int degree  ) ==> { chordName, chordType, root, degree, notes:[nobj1, ...] }  
-- degree chords built as chord triads for all scales; highlight root note  
-- how to algorithmically determine chord type (maj/min/dim) for scales not major or minor  
-- reference: https://appliedguitartheory.com/lessons/building-chords-major-scale/. 
- change layout of FretButton's controls to be position:absolute to prevent them from jumping up and down
- allow the first created Fretboard control to be deleted.  Currently, only its children may be deleted.
- fix ./public/favicon.svg colors: image appears dim on white backgrounds  
- browser bug: zooming out causes random frets and strings to disappear (assume due to x/y location; test by adjusting)   
- refactor FretPnl.render(): simplify, optimize  
- add backup feature:  
-- allow multiple backups by user assigning backup name  
-- default backup name = 'Auto', will restore on startup; others must be manually loaded by user   
-- add header button: Backups  
-- functions: backup, restore, delete, save/load from file?  
-- default save to Local Storage  
- FretSelect mode update: create an interface allowing the chords and scales looked up to be filtered
- allow for number and range of frets to changed by user 
- add ability to play videos in background  
- dig into source-map-explorer details  


