import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { IoSettingsSharp } from "react-icons/io5";
import { useState } from 'react';
import Settings from './Settings';

export default function Logout() {
  const{open,setopen}=useState("")
    const navigate = useNavigate()
    function logoutfn(){
        navigate("/")
    }
    function openfn(){
  
    }
  return (
    <div className='home'>
         
         <nav>
      <div>
        <p onClick={logoutfn}>logOut</p>
    </div>
      </nav>
    </div>
  )
}
