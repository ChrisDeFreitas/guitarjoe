import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const InfoPopup = () => (  
  <Popup trigger={<button>Trigger</button>} position="top left">    
    {close => (      
      <div>        
        Content here        
        <div className="close" onClick={close}>          
          &times;        
        </div>
       </div>    
    )}  
  </Popup>
)

export default InfoPopup