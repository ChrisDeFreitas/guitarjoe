/*
  HelpMnager.js
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - control to display help in GuitarJoe
  - see HelpData.js for data structure consumed

  Note, to trigger the close animation:
  - could not get framer-motion to work: AnimatePresence/motion.exit={"close"}
  - instead use toggle switch in parent: isOpen = QueryPnl.helpManagerOpen
*/

import React, { useState } from 'react'
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx'
import { motion } from "framer-motion"

import './HelpManager.sass'
import helpData from './HelpData.js'


function HelpManager( props ) {
  // console.log('HelpManager', props)
  
  let {fbid, stateChange} = props
  const [isOpen, setIsOpen] = useState( true )
  const [crumbs, setCrumbs] = useState( ['Help'] )

  if(props.isOpen === false && isOpen === true)
    setIsOpen( false )    //close request from QueryPanel

  function topicClick( event ){
    let btn = event.target,
      topic = btn.dataset.topic

    let list = crumbs.slice(),
      idx = list.indexOf( topic )
    if( idx >= 0)
      list = crumbs.slice( 0, idx +1 )
    else
      list.push( topic )
    setCrumbs( list )
  }
  function btnCloseClick(){
    setIsOpen( false )
  }
  function onAniComplete() {
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
  if(related.length > 0)
    related.unshift(<div key={key()} className='caption'>Related Topics</div>)

  return(
    <motion.div className='helpManagerFrame' id={'helpManager'+fbid}
      key={key()}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { height: 'auto', opacity:1 },
        closed: { height: '0px', opacity:0 },
      }}
      transition={{ ease:"easeOut", duration:0.3 }}
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
  stateChange: PropTypes.func,
}
export default HelpManager