import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import Collapse from 'react-bootstrap/Collapse';
import { IoSettingsSharp } from "react-icons/io5";
import Logout from './Logout';
import { IoCloseSharp } from "react-icons/io5";
import DataContext from './Usecontactapi';
import { IoSchoolSharp } from "react-icons/io5";
import Theme from './Theme';

function Navba({theme,settheme}) {
//   const [open, setOpen] = useState(false);
  const{open, setOpen}=useContext(DataContext)
  return (
    <div>
     <div className='headerr' >
        <div className='headerlearn'>
        <IoSchoolSharp className='headerlearnicon'/> <span className='headerlearniconl'>LEARNING DASHBOARD</span>
        </div>
    
        <div className={!open?'setting':"set"}>
      <IoSettingsSharp className='settingicon' onClick={() => setOpen(!open)} />
 </div>
 </div>
 <div className='head'>
          <div id={open? "example-collapse-text" : ""}>
          <IoCloseSharp onClick={()=>setOpen(!open)} className='settinghover'/>
            <p onClick={()=>settheme(!theme)}>{theme==true?"Whitemode":"Darkmode"}</p>
            <Logout />
          </div>

    
      </div>

    </div>
  );
}

export default Navba;