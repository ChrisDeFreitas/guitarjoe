/*
  HelpData.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - data for HelpManager.jsx

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
GuitarJoe works in four modes that are automatically activated:
\n
**AllNotes Mode** - Display all notes on fretboard\n
- From the Note list, select 'All' - the Fretboard is populated with NoteButtons.
- Click the button's left caption to give it a green background.
- Click the button's right caption to cycle between Staff and Tab data.
- Use the Octave list to display notes in a selected Octave.
\n
**NoteSelect Mode** - Display a Root note across the fretboard\n
- From the Note list, select any note - All Root NoteButtons are displayed.
- Selected scales, chords, and intervals will use this Root.
\n
**FretRoot Mode** - Focus on notes in part of the fretboard\n
- Click a note on the fretboard - this is the Root note.
- Selected octaves, scales, and chords will be within 3 frets of the Root.
\n
**FretSelect Mode** - Find matching chords and notes\n
- Click multiple notes on the fretboard - related chords and scales will be 
displayed within the InfoPanel.\n
\n 
See "About" for application and GitHub code repository details.  

  `,
}
helpData.Fretboard = {
  title:'Fretboard',
  related:['QueryPanel', 'InfoPanel', 'Modes'],
  content:`
The Fretboard contains the first 14 frets of a guitar fretboard.
It has many clickable features:\n
### Notes 
- Click on any note to place a NoteButton -   
If it is the only button, click again to remove it.  
If more than one, they will have left and right captions.  
- Click the left caption to highlight the button in green.  
In FretSelect mode, this will remove the button from the Fretboard.  
- Click the right caption to cycle combinations of note, interval, staff and tab data.  
In AllNotes mode, the caption cycles between staff and tab data.   
\n
### Fret Numbers
- Fret numbers are located above the FretBoard.
If the FretBoard is collapsed the buttons are removed and green lines be 
above frets 5, 7, 9, and 12.
- Click a Fret Number to disable a fret and hide any NoteButtons on the fret.
The fret is grayed and it's notes are not clickable.
- When clicked again, existing NoteButtons will be replaced.
- If the FretBoard is collapsed the space remains clickable.
\n
### String Filter Buttons
- The String Filter Buttons are green rectangles on the string's left edge.
- Click one to disable the string and hide NoteButtons on the string. 
The string is grayed and it's notes are not clickable.
- When clicked again, existing NoteButtons will be replaced.
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
- This is the arrow button on the far left.  Click to compact or expand the display.
\n
**List Captions**\n
- Clicking a caption will toggle the last selected value on and off.  
- You can also turn off a selection by selecting the blank list item.
\n
**Note List**\n
- Select a Root note to work with. 
Selected Octaves, Scales, Chords, and Intervals will use this as their root.
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
below, within the InfoPanel.
- The scale's NoteButtons displayed are determined by the Mode.
\n
**Chord List**\n
- Select from a variety of chords. 
- When a chord is selected, Chord Inversions based on the Root note are displayed 
below, within the InfoPanel.
- The chord's NoteButtons displayed are determined by the Mode.
\n
**Interval List**\n
- Display NoteButtons the selected Interval from the Root note.
\n
**Reset Button**\n
- Remove all changes to the Fretboard.
\n
**Help Button**\n
- Click to toggle this HelpPanel.
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