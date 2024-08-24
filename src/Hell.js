import React, { useState, useEffect } from 'react'
import axios from "axios"

export default function Hell() {
    const [hello,sethello]=useState("")
    useEffect(()=>{
    
        axios({
          url:"http://localhost:4000/",
          method:"GET",
          headers:{"Content-Type":"application/json"}, 
        }).then((res)=>{
         sethello(res.data)
        }
        ).catch((e)=>{
        console.log(e.message)
        })
    },[])
  return (
    <div>
        <p>{hello}</p>
    </div>
  )
}
