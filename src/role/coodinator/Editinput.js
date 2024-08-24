import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DataContext from '../../Usecontactapi'
import { useContext } from 'react'

export default function Editinput() {
    const userdetails=JSON.parse(localStorage.getItem("learning-token"))
      
    const {setselectedit,setfocus, course}=useContext(DataContext)
    // const{_id,title,description,language,creater,duration,content}=course
useEffect(()=>{
  setfocus(false)
})

    console.log(course)
    const navigate=useNavigate()
    const[additem, setadditem]=useState({
       title:course.title ||"",
       description:course.description ||"",
       language:course.language ||"",
       creater:course.creater ||"",
       duration:course.duration ||"",
       content:course.content ||"",
       token:userdetails
  })
  function newcousersaddfn(e){
    navigate("/coordinator")
    setselectedit(false)
  e.preventDefault()
  console.log(userdetails)
   
    axios({
      url:`http://localhost:4000/showcourses/edit/${course._id}`,
      method:"POST",
      data:JSON.stringify(additem),
      headers:{"Content-Type":"application/json"}, 
    }).then((res)=>{
      console.log(res)
    }).catch((e)=>{
      console.log(e)
    })
  
  }
  function newcousersaddfnn(e){
    // setselectedit(false)
    e.preventDefault()
  }

  return (
    <form onClick={(e)=>newcousersaddfnn(e)} className='editform'>
  
     <input className='title' placeholder='Tittle' value={additem.title} name='title' type='text' onChange={(e)=>setadditem({...additem,"title":e.target.value})} /><br/>
    <input  className='description' placeholder='Description' value={additem.description} name='description' type='text' onChange={(e)=>setadditem({...additem,"description":e.target.value})}/><br/>
    <input  className='language' placeholder='Language' value={additem.language} name='language'  type='text' onChange={(e)=>setadditem({...additem,"language":e.target.value})}/><br/>
    <input  className='created' placeholder='craeted by' value={additem.creater} name='creater' type='text' onChange={(e)=>setadditem({...additem,"creater":e.target.value})}/><br/>
    <input  className='duration' placeholder='Duration' value={additem.duration} name='duration'  type='text' onChange={(e)=>setadditem({...additem,"duration":e.target.value})}/><br/>
    {/* <input  type='text' placeholder='image'/> */}
    <textarea placeholder='content' value={additem.content}  onChange={(e)=>setadditem({...additem,"content":e.target.value})}></textarea>
   <button onClick={(e)=>newcousersaddfn(e)}>Add</button> 
   </form>

  )
}
