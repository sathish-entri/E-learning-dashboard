import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DataContext from '../../Usecontactapi'


export default function Clasfooter({studentlist}) {
    const{classlist,setclasslist,setstudentlistt}=useContext(DataContext)
        const navigate=useNavigate()
    function footerfn(e){
       setclasslist(e)
       if(e=="assignment"){
        setstudentlistt(studentlist)
       }
    }
  return (
    <div className='classfooter'>
        <button className="course" style={{backgroundColor:classlist=="studyplan"?"red":null}}   onClick={()=>footerfn("studyplan")}>Study plan</button>
        <button className="course" style={{backgroundColor:classlist=="assignment"?"red":null}}  onClick={()=>footerfn("assignment")}>Assignment</button>
        <button className="course" style={{backgroundColor:classlist=="student"?"red":null}}  onClick={()=>footerfn("student")}>Student</button>
    </div>
  )
}
