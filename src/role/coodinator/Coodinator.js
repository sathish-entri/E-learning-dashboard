import React, { useContext, useEffect, useState } from 'react'
import Showcourses from './Showcourses'
import Newcousers from './Newcousers'
import Logout from '../../Logout'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import DataContext from '../../Usecontactapi'
import Courses from './Courses'
import CoordNav from './CoordNav'
// import CoordFooter from './educatorlist/CoordFooter'
import Coorfooter from './educatorlist/Coorfooter'
import Educatorlist from './educatorlist/Educatorlist'
import Leanerlist from './educatorlist/Leanerlist'
import { IoBookSharp } from "react-icons/io5";
import { MdPerson } from "react-icons/md";
import { MdPerson3 } from "react-icons/md";
import Form from 'react-bootstrap/Form';
import Navba from '../../Navba'

export default function Coodinator({theme,settheme}) {
  const{course, setcourse,showcourses, setshowcourses,coorfooter, setcoorfooter,setfoc,setfocused,setfocus}=useContext(DataContext)
 
  const navigate=useNavigate()
  
  const[coursecol ,setcoursecol]=useState(true)
  function Showcoursesfn(res){
   navigate(`/${res}`)
   if(res=="coordinator"){
    setcourse([])
   }
  }
useEffect(()=>{
  setfocus(true)
     setfoc(true)
})

//delete function

  function deletefn(e){
    
    // console.log(course._id)
    // console.log(course.length)
     const token=JSON.parse(localStorage.getItem("learning-token"))
    
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
     navigate("coordinator/Newcousers")
  }

}
//...............................................................................................
function showfooter(res){
  setcoorfooter(res)
  res=="course"?setcoursecol(true):setcoursecol(false)
}


  return (
    <div  className='coordinator'>
      <Navba theme={theme} settheme={settheme}/>
      {coorfooter==("courses")? <CoordNav />:coorfooter=="educators"?null:null}
      <main>
      {coorfooter==("courses")?<Showcourses  course={course} setcourse={setcourse}/>:coorfooter=="educators"?<Educatorlist />:<Leanerlist />}
        
      </main>

      <footer className='coordfooter'>
        <button  className="course" style={{backgroundColor:coursecol==true?"red":null}} onClick={()=>showfooter("courses")}>Courses <span><IoBookSharp /></span></button>
              <button className='educator' onClick={()=>showfooter("educators")}>Educators <span><MdPerson3 /></span></button>
              <button className='leaner' onClick={()=>showfooter("leaners")}>Leaners<span><MdPerson /></span></button>
            

           
      </footer>
  </div>
  )
}
