import axios from 'axios'
import React, { useEffect, useState } from 'react'
import computerimage from "../../Pictures/book2.jpg"
import { useNavigate } from 'react-router-dom'

export default function Classroom() {
   const[leanclassroom,setleanclassroom]=useState([])
   const navigate=useNavigate()
    useEffect(()=>{
        const token=JSON.parse(localStorage.getItem("learning-token"))
        axios({
            url:`http://localhost:4000/leaner/classroom`,
            method:"POST", 
            data:{token},
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            // console.log(res.data)
            setleanclassroom(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })  
    },[])

    function classroomfn(e){
      navigate(`/leaner/classroom/${e}`)
     }
   
      const token=JSON.parse(localStorage.getItem("learning-token"))
  useEffect(()=>{
      // setclasslist("studyplan")
      axios({
          url:"http://localhost:4000/educator/home",
          method:"POST",
          data:{token},
          headers:{"Content-Type":"application/json"}
      }).then((res)=>{
          // console.log(res.data)
          if(Array.isArray(res.data)){
        // setshowclasses(res.data)
          }   
      }).catch((e)=>{
          console.log(e.message)
      })
     
  
  },[])

  return (
    <div>
        {leanclassroom.length>0?
        leanclassroom.map((res)=>{
            return <div key={res._id} className='classroomshow' style={{backgroundImage:`url(${computerimage})` }} onClick={()=>classroomfn(res._id)}>
            <h2 className='fontsize'> CLASS : {(res.classname).toUpperCase()}</h2>
            <p id='spam'> BATCH : {(res.batch).toUpperCase()}</p>
            
        </div>
        }):<p className='empty'>No classes</p>}
    </div>
  )
}
