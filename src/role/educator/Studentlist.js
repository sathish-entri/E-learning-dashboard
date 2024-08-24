import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import DataContext from '../../Usecontactapi'
import Searchstudent from './Searchstudent'

export default function Studentlist({searchh}) {

    const{addstudent,setaddstudent,studentlist,setstudentlist,}=useContext(DataContext)
    useEffect(()=>{
        const role={"role":"leaner"}
        axios({
            url:"http://localhost:4000/leanerlist",
            method:"POST", 
            data:JSON.stringify(role),
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            // console.log(res.data)
            setstudentlist(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })
    
    },[])
  
    console.log(addstudent)
        return (
          <div>
            <Searchstudent studentlist={studentlist.filter(item=>((item.name).toLowerCase()).includes(searchh.toLowerCase()))}/>
          </div>
        )
      }
      
