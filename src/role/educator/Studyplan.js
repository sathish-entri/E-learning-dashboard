import React, { useEffect, useState } from 'react'
import axios from "axios"
import Studycourses from './Studycourses'

export default function Studyplan({id}) {
    const [showstudy,setshowstudy]=useState([])
    useEffect(()=>{
        axios({
            url:`http://localhost:4000/educator/classroom/studyplan/get/${id}`,
            method:"GET", 
            // data:JSON.stringify(studyplan),
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            // console.log(res.data)
            setshowstudy(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })  
    },[])
    // console.log(showstudy)
  return (
    <div className='studyplandiv'>
      <h2 className='studyplandivh2'>STUDY PLAN</h2>
        {showstudy.length>0 ? showstudy.map((res)=>{
            return <div className='studyplanfull'>
                <div>
                <h2 className='studysub'><span className='span'>SUBJECT : </span>{(res.subject).toUpperCase()}</h2>
                  <div className='studyplanfullhead'>
                  <p><span className='span'>TITLE : </span>{(res.topic).toUpperCase()}</p>
                  <p><span className='span'>CREATEDAT : </span>{(res.createdAt).toUpperCase()}</p>
                  </div>
               
                {/* <p><span className='span'>DATE : </span>{res.task}</p> */}
                <p className='studyp'><span className='span'>NOTES : </span>{res.notes}</p>
               
           </div>
           <Studycourses course={res.course} />
            </div>
        }):<p className='empty'>study plan is empty !..</p>}
    </div>
  )
}
