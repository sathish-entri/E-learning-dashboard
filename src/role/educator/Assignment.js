import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { BsHandIndexThumb } from "react-icons/bs";
import { FaHandPointRight } from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";

export default function Assignment({id}) {
const[assignment,setassignment]=useState([])
  const navigate=useNavigate()
  function createassignfn(){
  navigate( `/educator/classroom/assignment/${id}`)
  }
  function submitionfn(e){
  navigate(`/educator/classroom/assignment/submition/${e}`)
  }
  useEffect(()=>{
    axios({
      url:`http://localhost:4000/educator/classroom/assignment/get/${id}`,
      method:"GET", 

      headers:{"Content-Type":"application/json"}

    }).then((res)=>{
      console.log(res.data)
      setassignment(res.data.assignment)
 
    }).catch((e)=>{
      console.log(e)
    })
  },[])
  return (
    <div>
       <div className='studyplandiv'>
       <h2 className='studyplandivh2'>ASSIGNMENTS</h2>
      {assignment.length>0 ? assignment.map((res)=>{
        return <div key={res._id} className='studyplanfull' id='assignment'>
        <h2 className='studysub'><span className='span'>SUBJECT : </span>{(res.subject).toUpperCase()}</h2>
          <div className='studyplanfullhead'>
          <p><span className='span'>TITLE : </span>{(res.topic).toUpperCase()}</p>
          <p><span className='span'>CREATEDAT : </span>{(res.createdAt).toUpperCase()}</p>
          </div>
       
        {/* <p><span className='span'>DATE : </span>{res.task}</p> */}
        <div className='studyplanfullhead'>
        <p className='study'><span className='span'>DESCRIPTION : </span>{res.description}</p>
        <p><span className='span'>EXPIREDDAT : </span>{(res.expiresAt).toUpperCase()}</p>
       </div>
       <p className='studentsub' onClick={()=>submitionfn(res._id)} >student supmission   <IoStorefront className='click'/></p>
   </div>
      }):<p>no assignments</p>}
      </div>
    
      <footer>
      <IoAddCircleSharp  onClick={createassignfn} className='plux'/>
      </footer>
    </div>
  )
}
