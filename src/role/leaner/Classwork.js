import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"

export default function Classwork() {
  const[classwork,setclasswork]=useState([])
    useEffect(()=>{
        const token=JSON.parse(localStorage.getItem("learning-token"))
        axios({
            url:`http://localhost:4000/leaner/classwork`,
            method:"POST", 
            data:{token},
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            console.log(res.data)
            setclasswork(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })  
    },[])
  return (
    <div>
      {classwork.length>0 ?classwork.map((res)=>{
        return <div>
          <p>{res.title}</p>
          <p>{res.topic}</p>
          <p>{res.subject}</p>
        </div>
      }):<p className='empty'>no classworks ! please you join any class</p>}
    </div>
  )
}
