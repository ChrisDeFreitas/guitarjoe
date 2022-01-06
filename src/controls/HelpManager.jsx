/*
  HelpMnager.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - control to display help in GuitarJoe
  - see HelpData.js for data structure consumed

  Data structure:
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

  To link from one help topic to another:
    1. insert a markup link: [Jump to topic2](#topic2)
      - HelpManager will intercept the click and process the request

  To link from one help topic to a heading in another topic:
    1. in the destination topic create a heading and note the id generated
      create markup: ## Subtopic II
      translated html: <h3 id="subtopic-ii">Subtopic</h3>
    2. insert a markup link: [Jump to topic2 heading](#topic2/subtopic-ii)
      - HelpManager will intercept the click and process the request

  Resolve: to trigger the close animation:
  - could not get framer-motion to work: AnimatePresence/motion.exit={"close"}
  - instead use toggle switch in parent: isOpen = QueryPnl.helpManagerOpen

    ToDo:
    - change contentClick to mouseDown event to prevent anchor from firing (if possible)
*/

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx'
import { motion } from "framer-motion"

import './HelpManager.sass'
import helpData from './HelpData.js'


function HelpManager( props ) {
  let {fbid, stateChange} = props
  const [isOpen, setIsOpen] = useState( true )  //false = rollup, then remove component
  const [topicClicked, setTopicChanged] = useState( false ) //true = new topic to display, do not rollup 
  const [subtopic, setSubtopic] = useState( null )
  const [crumbs, setCrumbs] = useState( ['Help'] )

  if(props.isOpen === false && isOpen === true){
    setIsOpen( false )    //close request from QueryPanel
  }

  useEffect(() => {    
    if(subtopic !== null){
      let el = document.querySelector('#'+subtopic)
      if(el) el.scrollIntoView()
    }
  })

  function btnCloseClick(){
    setIsOpen( false )
  }
  function contentClick( event ){
    let ctrl = event.target 
    if( ctrl.nodeName === 'A' && ctrl.hash !== ''){
      let topic = ctrl.hash.substr(1)
      let subtopic = null
      let idx = topic.indexOf('/')
      if(idx >= 0){
        subtopic = topic.substr(idx +1)
        topic = topic.substr(0, idx)
      }
      // console.log('contentClick\n', topic, subtopic, '\n', ctrl.hash, event.target, event)
      topicSelect( topic, subtopic )
      event.preventDefault()
      return
     }
  }
  function topicClick( event ){
    let btn = event.target,
      topic = btn.dataset.topic
    topicSelect( topic )
  }
  function topicSelect( topic, subtopic = null ){
    let list = crumbs.slice(),
      idx = list.indexOf( topic )
    if( idx >= 0)
      list = crumbs.slice( 0, idx +1 )
    else
      list.push( topic )
      
    setTopicChanged( true )
    setSubtopic( subtopic )
    setCrumbs( list )
  }
  function onAniComplete(){
    if(isOpen === false)  //remove self from screen
      stateChange( 'helpManager', false )
  }

  let keyii = 0
  function key(){ return 'HMgr' +(++keyii) }

  
  let menu = []
  crumbs.forEach( topic => {
    let title = (topic === 'Help'
      ? 'Help'
      : helpData[topic].title
    )
    menu.push( 
      <span key={key()} onClick={topicClick} data-topic={topic}>{title}</span> 
    )
  })
  
  let topic = crumbs[ crumbs.length -1 ]
  if( topic === 'Help' ){
    if( !helpData.default)
      return null
    topic = helpData.default
  }

  let itm = helpData[ topic ]
  let title = itm.title

  if(itm.link !== undefined){    //handle link records
    let tmp = helpData[ itm.link ]
    title = tmp.title +' (' +title +')'
    itm = tmp
  }

  let related = itm.related.map( topic => {
    if( helpData[ topic ] === undefined)
      return null
    let title = helpData[ topic ].title
    return (
      <span key={key()} onClick={topicClick} data-topic={topic}>{title}</span>
    )
  })
  if(related.length > 0){
    related.unshift(<div key={key()} className='caption'>Related Topics</div>)
  }

  return(
    <motion.div key={key()} id={'helpManager'+fbid} className='helpManagerFrame' 
      onClick={contentClick}
      initial={topicClicked ?'open' :'closed'}
      animate={isOpen ?'open' :'closed'}
      variants={{
        open: { height:'auto', opacity:1 },
        closed: { height:'0px', opacity:0 },
      }}
      transition={{ ease:'easeOut', duration:0.3 }}
      onAnimationComplete={onAniComplete}
    >
      <div className='menuFrame'>
        {menu}
        <div className='btnClose' onClick={btnCloseClick} title='Close Help' >
            Close
        </div>
      </div>
      <div className='titleFrame'>{title}</div>
      <Markdown className='contentFrame' children={itm.content} />
      <div className='relatedFrame'>{related}</div>
    </motion.div>
  )

}

HelpManager.propTypes = {
  fbid: PropTypes.number,
  isOpen: PropTypes.bool,
  // firstRender: PropTypes.bool,  
  stateChange: PropTypes.func,
}
export default HelpManager