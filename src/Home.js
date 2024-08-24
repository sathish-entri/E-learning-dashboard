import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Coodinator from "./role/coodinator/Coodinator"
import Educator from "./role/educator/Educator"
import  Leaner from "./role/leaner/Leaner"
import DataContext from './Usecontactapi'
import { useContext } from 'react'


export default function Home({theme,settheme}) {
const[role,setrole]=useState("")
const{open, setOpen}=useContext(DataContext)
    const navigate = useNavigate()
   

  useEffect(()=>{
    // themed==true?settheme(true):settheme(false)
    const roleandtoken=localStorage.getItem("learning-token")
    axios({
      url:"http://localhost:4000/home",
      method:"POST",
      data:(roleandtoken),
      headers:{"Content-Type":"application/json"}, 
    }).then((res)=>{
      setrole(res.data)
    }
    ).catch((e)=>{
      console.log(e)
    
   } )
  },[])
console.log(role)
console.log(theme)
  return (
    <div className={!open?"home":""} >
     
      <header className="Appp">
{/* <h1>home page</h1> */}
     {navigate(`/${role}`)}

      </header>
   
    </div>
   
  )
}
