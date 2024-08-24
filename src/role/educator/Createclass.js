import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from "axios"
import DataContext, { Dataprovider } from '../../Usecontactapi'
import { useNavigate } from 'react-router-dom'
import Studentlist from './Studentlist'
import Searchstudent from './Searchstudent'

export default function Createclass() {
  const[searchh,setsearchh]=useState("")

const searchRef =useRef()

    const navigate=useNavigate()
// const userdetails=JSON.parse(localStorage.getItem("learning-token"))
    const {addstudent,setaddstudent,addcourse,setaddcourse,classstudenthide,setclassstudenthide,studentlist,setstudentlist,classroom,setclassroom}=useContext(DataContext)
  
useEffect(()=>{
    setclassroom({...classroom,"studentlist":addstudent})
    // setclassstudenthide(true)
   },[addstudent])

//................................................................................................
    function classroomfn(e){
       e.preventDefault()
      console.log(classroom)
              axios({
            url:"http://localhost:4000/educator/classroom",
            method:"POST", 
            data:JSON.stringify(classroom),
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            console.log(res.data)
            // setclasses(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })
          navigate('/educator')
          setclassstudenthide(false)
       console.log(searchh)
    }
    function searchfn(e){
      setsearchh(e.target.value)
      setclassstudenthide(true)
    }
  return (
    <div className='studyinput'>
      <h4>CREATE CLASSROOM</h4>
    <div className='editform'>
    <label className='span'>CLASSNAME</label><br></br>
        <input placeholder='Enter a ClassName'onChange={(e)=>setclassroom({...classroom,"classname":e.target.value})} /><br></br>
        <label className='span'>DIVISION</label><br></br>
        <input placeholder='ENTER A BATCH OR SECTION' onChange={(e)=>setclassroom({...classroom,"batch":e.target.value})} /><br></br>
        <label className='span'>INSTITUDE</label><br></br>
        <input placeholder='institute' onChange={(e)=>setclassroom({...classroom,"subject":e.target.value})} /><br></br>
        <label className='span'>LANGUAGE</label><br></br> 
       <input placeholder='language' onChange={(e)=>setclassroom({...classroom,"language":e.target.value})} /><br></br>
        <label className='span'>ADD STUDENT</label><br></br>
        <input placeholder='searchstudents' onChange={(e)=>searchfn(e)} onClick={()=>setclassstudenthide(!classstudenthide)}  className='searchstudent' value={searchh} /><br></br>
        <button onClick={(e)=>classroomfn(e)}>create</button>
  
       {classstudenthide ?<Studentlist  searchh={searchh} setclassroom={setclassroom}/>:null} 
       
    </div>
    </div>
  )
}
