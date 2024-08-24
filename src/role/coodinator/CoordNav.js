
import React, { useContext, useState } from 'react'

import axios from 'axios'
import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom'
import DataContext from '../../Usecontactapi'


export default function CoordNav() {
  const{course, setcourse,showcourses,open,setOpen, setfoc,setshowcourses,setselectedit,deleted,setdeleted,idvalue,foc,focus,setfocus,focused,setfocused}=useContext(DataContext)




  const navigate=useNavigate()

  function Showcoursesfn(res,sec){
      navigate(`/${res}`)
      
    
    if(res=="coordinator"){
     setcourse([])
     setselectedit(false)
     setfocus(true)
     setfoc(true)
    setdeleted(false)
    }else{
        if(res=="editcourses"){
            setselectedit(true)
            setfocus(false)
            setfoc(false)
        }
        if(res=="coordinator/Newcousers"){
          setfocus(false)
          setfoc(true)
        }

    }
  
   }
 
 
 //delete function
function deletedfn2(res){
  setfocus(false)
  setfoc(true)
      if(idvalue.length==0){
      //  deletefn()
      setdeleted(true)  
      }else{
        deletefn()
      }
   
}

   function deletefn(){
    // navigate("/coordinate")
    console.log(course._id.length) 
      const token=JSON.parse(localStorage.getItem("learning-token"))
      // deleted==true && 
    if(course._id.length>0){
     const idvalue =course._id
      axios({
        url:`http://localhost:4000/showcourses/update/${idvalue}`,
        method:"POST",
        data:{token},
        headers:{"Content-Type":"application/json"}
  
      }).then((res)=>{
        console.log(res.data)
       
      }).catch((e)=>{
        console.log(e)
      })
      navigate("/coordinator")
      setdeleted(false)
   }else{
    console.log("else work")
   }
  
  }
   function editfn(e){
     
    
      const token=JSON.parse(localStorage.getItem("learning-token"))
     
    if(course._id.length>0){
     const idvalue =course._id
      axios({
        url:`http://localhost:4000/showcourses/edit/${idvalue}`,
        method:"POST",
        data:{token},
        headers:{"Content-Type":"application/json"}
  
      }).then((res)=>{
        console.log(res.data)
       
      }).catch((e)=>{
        console.log(e)
      })
      navigate("/coordinator")
   }}
   function backfn(){
    navigate(-1)
   }
  return (

       <div className={!open?"coornav":'coordinator-coures-nav'}>
          <button className={focus?"alltrue":'all'} onClick={()=>Showcoursesfn("coordinator")}>All</button>
          <button className={focused?'newcourse':"newc2"} onClick={()=>Showcoursesfn("coordinator/Newcousers")}>Create</button>
         
          <button className={foc?"edit":"edit2"} onClick={()=>Showcoursesfn("editcourses")}>Edit </button>
          {/* <p onClick={()=>Showcoursesfn("coordinator")}>delete</p> */}
          <button className='delete' onClick={()=>deletedfn2("deleted")}>Delete</button>
          {/* <button className="delet" onClick={backfn}>Back</button> */}
      </div> 

  )
}
