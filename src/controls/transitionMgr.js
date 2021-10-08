/*
  transitionMgr.js
  - execoute supplied function after css transition ends

*/

var q = {
  version:'0.1',

  test(){ console.log('transitionMgr v.'+this.version) },

  exec( ctrl, callback ){
    console.log('transitionMgr.exec() ', ctrl, callback)
  },

}

export default q