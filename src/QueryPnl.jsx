/*
  QueryPnl.jsx
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  - manage query controls for GuitarJoe app

*/
import React from 'react'
import { motion } from "framer-motion"

import './Fretboard.css'
import QueryBar from "./QueryBar"
import InfoPnl from "./InfoPnl"
import ArrowButton from './controls/ArrowButton'
import HelpManager from './controls/HelpManager.jsx'


class QueryPnl extends React.Component {

  constructor(props){
    super(props)

    this.helpManagerOpen = true  //have helpManager remove self when === false
                                 //technique does not work with state because of re-renders
    this.btnCollapseClick = this.btnCollapseClick.bind(this)
    this.btnClearClick = this.btnClearClick.bind(this)
    this.btnHelpClick = this.btnHelpClick.bind(this)
    this.btnDupeClick = this.btnDupeClick.bind(this)
    this.btnDelClick = this.btnDelClick.bind(this)
  }

  //event handlers
  btnCollapseClick(){
    let val = !this.props.qry.collapsed
    this.props.stateChange( 'collapsed', val )
  }
  btnClearClick(){
    // this.props.dispatch({ type:"FretboardActions/fretFirstUpdate", payload:'' })
    this.props.reset()
  }
  btnDelClick(){
    this.props.remove()
  }
  btnDupeClick(){
    this.props.duplicate()
  }
  btnHelpClick(){
    if( this.helpManagerOpen === true ){  
      this.helpManagerOpen = false //will hide then call parent.stateChange
      this.forceUpdate()
    }
    else{ //show help
      this.helpManagerOpen = true
      let val = !this.props.qry.helpManager
      this.props.stateChange( 'helpManager', val )
    }
  }
  

  render(){
    // console.log('queryPnl.render()', this.props)
    let qry = this.props.qry
    let qryBtnClass = (qry.collapsed ?'qryBtnSmall' :'qryBtn')
    
    let arrowUord = (qry.collapsed ?'dn' :'up')
    let arrowTitle = (qry.collapsed ?'Show Query panel' :'Hide Query panel')
    let arrowWidth = (qry.collapsed ?'1.5em' :'2em')

    let helpManager = null
    if(qry.helpManager === true){
      helpManager = <HelpManager 
        fbid={qry.fbid} 
        stateChange={this.props.stateChange} 
        isOpen={this.helpManagerOpen} 
      />
    }
    else
     this.helpManagerOpen = false //reset
    
    return (
      <div className={'queryPnl queryPnlShow'} >
        <table className='tbQuery' ><tbody><tr>
        <td className='tdQryBtnsLeft'>
           <ArrowButton upOrDn={arrowUord} width={arrowWidth} title={arrowTitle} onChange={this.btnCollapseClick}/>
        </td><td className='tdQryContent'>
          <QueryBar
            qry={qry} 
            stateChange={this.props.stateChange}
            setChangeHandler={this.props.setChangeHandler}
          />
          <InfoPnl 
            qry={qry} 
            stateChange={this.props.stateChange}
            setChangeHandler={this.props.setChangeHandler}
          />
          {helpManager}
        </td><td className='tdQryBtnsRight'>
            <div className={qryBtnClass +' qryBtnClear'} onClick={this.btnClearClick} title='Reset query controls'>
              <motion.div 
                    whileTap={{ transform:'rotateZ(360deg)' }}
                    transition={{ type:'spring', damping: 30 }}
                  >
                  &#8635;
              </motion.div>
            </div>
            <div className={qryBtnClass +' qryBtnHelp'} onClick={this.btnHelpClick} title='Display HelpPanel' >
              <motion.div 
                whileTap={{ transform:'rotateZ(360deg)' }}
                transition={{ type:'spring', damping: 30 }}
              >
                &#63;
              </motion.div>              
            </div>
            <div className={qryBtnClass +' qryBtnDupe'} onClick={this.btnDupeClick} title='Duplicate fretboard' >
              <motion.div 
                whileTap={{ transform:'rotateZ(360deg)' }}
                transition={{ type:'spring', damping: 30 }}
              >
                &#10010;
              </motion.div>              
            </div>
            { qry.fbid === 0 ?null
              :<div className={qryBtnClass +' qryBtnDel'} onClick={this.btnDelClick} title='Remove this fretboard' >
                  <motion.div 
                    whileTap={{ transform:'rotateZ(360deg)' }}
                    transition={{ type:'spring', damping: 30 }}
                  >
                    &#10000;
                  </motion.div>
                </div>
            }
        </td></tr></tbody></table>
      </div>
    )
  }
}

export default QueryPnl
