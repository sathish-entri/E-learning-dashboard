import React, { useContext, useEffect, useState } from 'react'
import Allcourses from '../Allcourses'
import DataContext from '../../Usecontactapi'
import { useNavigate,useParams } from 'react-router-dom'
import axios from 'axios'

export default function Studycreate() {
const navigate=useNavigate()
const params = useParams()
const id =params.id
const[studyplan,setstudyplan]=useState(
  { 
    classroom_id:id,
    subject:"",
    topic:"",
    task:"",
    notes:"",
    course:[]
})

const {addstudent,setaddstudent,setaddcourse,searchcourse,setsearchcourse,addcourse,classstudenthides,setclassstudenthides}=useContext(DataContext)
useEffect(()=>{
  setstudyplan({...studyplan,"course":addcourse})
},[addcourse])


console.log(addcourse)


function studysubmitfn(e){
  console.log(studyplan)
    e.preventDefault()
    axios({
        url:"http://localhost:4000/educator/classroom/studyplan",
        method:"POST", 
        data:JSON.stringify(studyplan),
        headers:{"Content-Type":"application/json"}

      }).then((res)=>{
        console.log(res.data)
        // setstudentlist(res.data)
   
      }).catch((e)=>{
        console.log(e)
      })
    navigate(-1)
}
function searchfn(e){
  setsearchcourse(e.target.value)
}
  return (
    <div className='studyinput'>
      <h4>CREATE STUDYPLAN</h4>
        <form className='editform'>
          <label className='span'>SUBJECT</label><br></br>
            <input placeholder='Enter a Subject Name'  onChange={(e)=>setstudyplan({...studyplan,"subject":e.target.value})} /><br></br>
            <label className='span'>TOPIC</label><br></br>
            <input type='text' placeholder='Enter aTopic' onChange={(e)=>setstudyplan({...studyplan,"topic":e.target.value})}/><br></br>
            <label className='span'>NOTES</label><br></br>
            {/* <input type='text' placeholder='Tasks'onChange={(e)=>setstudyplan({...studyplan,"task":e.target.value})} /><br></br> */}
            <input type='text' placeholder='Enter Notes' onChange={(e)=>setstudyplan({...studyplan,"notes":e.target.value})} /><br></br>
            <label className='span'>DURATION</label><br></br>
            <input type='number' placeholder='how many days' onChange={(e)=>setstudyplan({...studyplan,"duration":e.target.value})}/><br></br>
            <label className="span">ADD COURSES</label><br></br>
            <input type='text' value={addcourse} onClick={()=>setclassstudenthides(!classstudenthides)} placeholder='search courses' onChange={(e)=>searchfn(e)} /><br></br>
            <button type='submit' onClick={(e)=>studysubmitfn(e)}>Submit</button>
             {classstudenthides ?<Allcourses addcourse={addcourse} />:null} 
            
        </form>
    </div>
  )
}
