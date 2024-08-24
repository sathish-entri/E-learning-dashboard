import React, { useState } from 'react'
import { useEffect,useContext } from 'react'
import DataContext, { Dataprovider } from '../../Usecontactapi'
import axios from "axios"
import computerimage from "../../Pictures/book2.jpg"
import { useNavigate } from 'react-router-dom'
// import { showcourseedit } from '../../../../server/controlles/showcourses_update'

export default function Showclasses() {
   const navigate = useNavigate()
    const [showclasses, setshowclasses] = useState([])
    const{classlist,setclasslist,classroom}=useContext(DataContext)
    
   function classroomfn(e){
    navigate(`/educator/classroom/${e}`)
   }
 
    const token=JSON.parse(localStorage.getItem("learning-token"))
useEffect(()=>{
    setclasslist("studyplan")
    axios({
        url:"http://localhost:4000/educator/home",
        method:"POST",
        data:{token},
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
        // console.log(res.data)
        if(Array.isArray(res.data)){
      setshowclasses(res.data)
        }   
    }).catch((e)=>{
        console.log(e.message)
    })
   

},[classroom])
// console.log(showclasses.length)
// console.log(classes)
  return (
    <div>
        {showclasses.length>0 ?
        showclasses.map((res)=>{
            return <div className='classroomshow' style={{backgroundImage:`url(${computerimage})` }} onClick={()=>classroomfn(res._id)}>
                <h2 className='fontsize'> CLASS : {(res.classname).toUpperCase()}</h2>
                <p id='spam'> BATCH : {(res.batch).toUpperCase()}</p>
                
            </div>
        }) :  <p className='empty'>No! classroom, Please create a classroom</p>}
      
    </div>
  )
}
