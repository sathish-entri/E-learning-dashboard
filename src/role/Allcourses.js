import React, { useContext, useEffect } from 'react'
import DataContext from '../Usecontactapi'
import axios from "axios"
import Allcourseslist from './Allcourseslist'

export default function Allcourses({addcourse}) {
    const{totalcourses,settotalcourses,setaddcourse,searchcourse,setcoornav}=useContext(DataContext)
    
useEffect(()=>{

  axios({
    url:"http://localhost:4000/allcourses",
    method:"GET",
    // data:JSON.stringify(error),
    headers:{"Content-Type":"application/json"}, 
  }).then((res)=>{
        console.log(res.data)
        settotalcourses(res.data)
   
      }).catch((e)=>{
        console.log(e)
      })

},[])



  return (
    <div>
     <Allcourseslist totalcourses={totalcourses.filter(item=>((item.title).toLowerCase()).includes(searchcourse.toLowerCase()))} setaddcourse={setaddcourse} addcourse={addcourse} />
    </div>
  )
}
