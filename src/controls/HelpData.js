/*
  HelpData.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - data for HelpManager.jsx

  data structure:
    helpData = {
      default: topic2,    //required, default topic displayed on startup
      topic1: {           // a link record
        title: string,
        link: topic2,     //display content for this topic
      },
      topic2: {           //a standard help record, at least one required
        title: string,
        related: array,   //related topics, displayed at bottom of window
        content: Markdown text    //help info
      }
    }
*/

var helpData = {}
export default helpData

helpData.default = 'QuickTips'
helpData.Modes = {
  title:'Modes',
  link:`QuickTips`
}
helpData.QuickTips = {
  title:'Quick Tips',
  related:['Fretboard', 'QueryPanel', 'InfoPanel', 'Scales','Chords','Intervals'],
  content:`
See the About dialog for details about the application and code repository on GitHub.
GuitarJoe works in four modes that are activated automatically based on how it is used:
\n
**AllNotes Mode** - Display all notes on fretboard\n
- From the Note list, select 'All' - all notes on the Fretboard are populated with NoteButtons.
- Use the Octave list to display notes in a selected Octave.
- On any NoteButton, click the note to highlight the button in green.
- On any NoteButton, click the lower right corner to cycle between Staff and Tab display.
\n
**NoteSelect Mode** - Display a Root note across the fretboard\n
- From the Note list, select any note - Root NoteButtons are drawn across the fretboard.
- Selected scales, chords, and intervals will be based on the Root.
\n
**FretRoot Mode** - Focus on notes in part of the fretboard\n
- Click a note on the fretboard - this is the Root note.
- Selected octaves, scales, and chords will be within 3 frets of the Root.

\n
**FretSelect Mode** - Find matching chords and notes\n
- Click multiple notes on the fretboard - related chords and scales will be 
displayed within the InfoPanel.
- The first note clicked is the Root note.
  `,
}
helpData.Fretboard = {
  title:'Fretboard',
  related:['QueryPanel', 'InfoPanel', 'Modes'],
  content:`
The Fretboard contains the first 14 frets of a guitar fretboard.
It has many clickable features:\n
**Notes**\n
- Click on any note to place a NoteButton.
- Click the NoteButton's caption to highlight the button in green.
- Click the NoteButton's lower right corner to cycle the data displayed.
In AllNotes mode, it cycles between Staff and Tab display. 
In the other modes it will cycle through combinations of note, interval, staff and tab data.
\n
**Fret Numbers**\n
- Fret numbers are located above the FretBoard.
If the FretBoard is collapsed the buttons are removed and green lines appear 
above fret numbers 5, 7, 9, and 12.
- Click a Fret Number to disable a fret and hide any NoteButtons on the fret.
The fret is grayed and notes on the fret will no longer be clickable.
- When clicked again, existing NoteButtons will be returned.
- If the FretBoard is collapsed the space remains clickable.
\n
**String Filter Buttons**\n
- The String Filter Buttons are green rectangles on the string's left edge.
- Click a String button to disable a string and hide any NoteButtons 
on the string. The string is grayed and
notes on the string will no longer be clickable.
- When clicked again, existing NoteButtons will be returned.
\n
  `
}
helpData.QueryPanel = {
  title:'QueryPanel',
  related:['Fretboard', 'InfoPanel', 'Modes'],
  content:`
The QueryPanel is found below the Fretboard.
Use it to tell GuitarJoe what work you want to do. 
Features:\n

**Collapse Button**\n
- This is the first button from the left, with the arrow.  Click to compact or expand the display.
\n
**List Captions**\n
- Clicking a caption will toggle the last selected value on and off.  
- You can also turn off a selection by selecting the blank list item.
\n
**Note List**\n
- Select a Root note to work with. 
Selected Octaves, Scales, Chords, and Intervals will be 
relative to the Root note.
- Select "All" to display all NoteButtons on the Fretboard.
- When "All" is selected, only the Octave list will be active.
\n
**Octave List**\n
- When selected, only NoteButtons within the selected Octave are displayed.
- This may remove all NoteButtons because they are not within the selected Octave.
\n
**Scale List**\n
- Select from a variety of scales. 
- When a scale is selected, Scale Degrees based on the Root note are displayed 
below the QueryPanl within the InfoPanel.
- The NoteButtons displayed are determined by the GuitarJoe's Mode.
\n
**Chord List**\n
- Select from a variety of chords. 
- When a chord is selected, Chord Inversions based on the Root note are displayed 
below the QueryPanl within the InfoPanel.
- The NoteButtons displayed are determined by the GuitarJoe's Mode.
\n
**Interval List**\n
- Display NoteButtons the selected Interval from the Root note.
\n
**Reset Button**\n
- Remove all changes to the Fretboard.
\n
**Help Button**\n
- Click to toggle this Help Panel.
\n
**Duplicate Button**\n
- Click to create a duplicate of the Fretboard.  Any number of Fretboards may be created.
\n
**Delete Button**\n
- Click to delete the Fretboard. Currently, the first Fretboard may not be deleted.
\n
  `
}
helpData.InfoPanel = {
  title:'InfoPanel',
  related:['Fretboard', 'QueryPanel', 'Modes'],
  content:`
The InfoPanel provides extra information about data displayed by GuitarJoe.
It is found below the QueryPanel.
Data within the InfoPanel may by copied and pasted to other applications using 
the browser's clipboard functions.
Features:\n
**Captions**\n
- Captions are bold, white text.  Clicking any caption will disable all active InfoPanel features.
- You can also turn off a feature by clicking the item that turned it on.
\n
**FretSelect Mode**\n
- Clicking multiple notes automatically starts this mode.
- Names of Scales and Chords containing all notes clicked are shown.
- Clicking a name will display it's NoteButtons across the Fretboard.
- To dig deeper into a scale or chord, duplicate the Fretboard, then Reset 
and configure the new QueryPanel as needed.
\n
**Scale Info (for NoteSelect and FretRoot modes)**\n
- The scale name is displayed with notes and intervals of the scale.
- Scale degree triads with their notes and intervals are also displayed.
- Clicking a note will highlight it's NoteButtons on the Fretboard 
and the InfoPanel.
- Clicking a triad's name will highlight it's NoteButtons on the Fretboard.
\n
**Chord Info  (for NoteSelect and FretRoot modes)**\n
- The chord name is displayed with notes and intervals of the chord.
- For Major, Minor, and Dominant Seventh chords, bar chord shapes are displayed.
This is similar to, but not, the CAGED system.
- Chord inversions are displayed for all chords.
- Clicking a note will highlight it's NoteButtons on the Fretboard and the InfoPanel.
- Clicking the name of a chord shape or inversion will highlight it's NoteButtons.
\n
**Interval Info**\n
- The Interval name and it's note and interval are displayed.
- Clicking a note will highlight it's NoteButtons on the Fretboard and the InfoPanel.
`
}