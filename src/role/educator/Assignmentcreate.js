import React, { useContext } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import Studentlist from './Studentlist'
import DataContext from '../../Usecontactapi'

export default function Assignmentcreate() {
  const pid=useParams()
//   console.log(pid)
    const{studentlistt, setstudentlistt}=useContext(DataContext)
    // console.log(studentlistt)
    const navigate=useNavigate()
    const [assignment,setassignment]=useState({
        classroom_id:pid.id,
        Studentlist:studentlistt,
    title:"",
    topic:"",
    subject:"",
    description:"",
    finaldate:"",
    marks:""
    })
function submitfn(e){
    e.preventDefault(e)
    console.log(assignment)
    axios({
        url:"http://localhost:4000/educator/classroom/assignment/post",
        method:"POST", 
        data:JSON.stringify(assignment),
        headers:{"Content-Type":"application/json"}

      }).then((res)=>{
        console.log(res.data)
        // setstudentlist(res.data)
   
      }).catch((e)=>{
        console.log(e)
      })
    navigate(-1)
}
  return (
    <div className='studyinput'>
      <h4>CREATE ASSIGNMENT</h4>
   <form className='editform'>
    <label className='span'>TITLE</label><br></br>
    <input type='text' placeholder='Enter a Title' onChange={(e)=>setassignment({...assignment,"title":e.target.value})}/><br></br>
    <label className='span'>TOPIC</label><br></br>
    <input type='text' placeholder='Enter a Topic' onChange={(e)=>setassignment({...assignment,"topic":e.target.value})}/><br></br>
    <label className='span'>SUBJECT</label><br></br>
    <input type='text' placeholder='subject Name' onChange={(e)=>setassignment({...assignment,"subject":e.target.value})}/><br></br>
    <label className='span'>DESCRIPTION</label><br></br>
    <input type='text' placeholder=' Enter a Description' onChange={(e)=>setassignment({...assignment,"description":e.target.value})}/><br></br>
    <label className='span'>DURATION</label><br></br>
    <input type='number' placeholder='how many dates' onChange={(e)=>setassignment({...assignment,"finaldate":e.target.value})}/><br></br>
    <label className='span'>Marks</label><br></br>
    <input type='number' placeholder='Total Marks' onChange={(e)=>setassignment({...assignment,"marks":e.target.value})}/><br></br>
    <button onClick={(e)=>submitfn(e)}>submit</button>
   </form>
   </div>
  )
}
