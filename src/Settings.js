import React from 'react'
import Logout from './Logout';
import { IoCloseSharp } from "react-icons/io5";
import DataContext from './Usecontactapi';
import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import Collapse from 'react-bootstrap/Collapse';
import { IoSettingsSharp } from "react-icons/io5";
import { IoSchoolSharp } from "react-icons/io5";

import Theme from './Theme';

export default function Settings() {
    const{open, setOpen}=useContext(DataContext)
  return (
    <div>
    <div className='headerr' >
       <div className='headerlearn'>
       <p className='headerlearnicon'>Home</p>
       </div>
   
       <div className={!open?'setting':"set"}>
     <IoSettingsSharp onClick={() => setOpen(!open)} />
</div>
</div>
<div className='head'>
         <div id={open? "example-collapse-text" : ""}>
         <IoCloseSharp onClick={()=>setOpen(!open)} className='settinghover'/>
           <Theme />
           <Logout />
         </div>

   
     </div>

   </div>
  )
}
