import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

export default function Assignment({id}) {
    const[assignment,setassignment]=useState([])
    const[expired,setexpired]=useState("")
    const[userid,setuserid]=useState(JSON.parse(localStorage.getItem("learning-token")))
    useEffect(()=>{
      console.log(userid)
        axios({
          url:`http://localhost:4000/educator/classroom/assignment/get/${id}`,
          method:"GET", 
    
          headers:{"Content-Type":"application/json"}
    
        }).then((res)=>{
          console.log(res.data)
          setassignment(res.data.assignment)
          setexpired(res.data.duodate)
        }).catch((e)=>{
          console.log(e)
        })
      },[])
      
      function onchangefn(e){
        var {name,value} = e.target
        
        // console.log(error)
        // seterror({...error,[name]:value})
    
      }
  return (
  
       <div className='studyplandiv'>
       <h2 className='studyplandivh2'>ASSIGNMENT</h2>
      {assignment.length>0 ? assignment.map((res)=>{
        return <div className='studyplanfull' id='assignment' key={res._id}>
        <h2 className='studysub'><span className='span'>SUBJECT : </span>{(res.subject).toUpperCase()}</h2>
          <div className='studyplanfullhead'>
          <p><span className='span'>TITLE : </span>{(res.topic).toUpperCase()}</p>
          <p><span className='span'>CREATEDAT : </span>{(res.createdAt).toUpperCase()}</p>
          </div>
       
        <p className='studyp'><span className='span'>DESCRIPTION : </span>{res.description}</p>
        {expired==""?null:<p className='span'>DATE OVER</p>}
        <p className='span'>MARK :{res.marks}/<span></span></p>
          <form action="http://localhost:4000/leaner/assignment/upload" className='upload-assignment' method="post" enctype="multipart/form-data" > 
         <p>UPLOAD ASSIGNMENT</p>
        <input type='text' style={{marginLeft:"-99999",display:"none"}}  name='id' value={res._id} onChange={(e)=>onchangefn(e)}/><br></br>
        <input type='text' style={{marginLeft:"-99999",display:"none"}} name='token' value={userid.token} onChange={(e)=>onchangefn(e)}/><br></br>
        <input type='file' className='uploadassignment'  accept='image/png, image/jpeg' id='image' name='image' ></input><br></br>
        <button  style={{backgroundColor:"red",color:"white"}} type='submit' >Submit</button>
       </form>
      
   </div>
      }):<p className='empty'>No assignments</p>}
      </div>
  )
}
