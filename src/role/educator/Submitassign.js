import React, { useState } from 'react'
import Navba from '../../Navba'
import Clasfooter from './Clasfooter'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'


export default function Submitassign({theme,settheme}) {
    const params=useParams()
    console.log(params.id)
    const[assignment,setassignment]=useState([])
    
    const[marks,setmarks]=useState({
        mark:""
    })
    const [submit,setsubmit]=useState([])
    const{id}=params.id
    useEffect(()=>{
        axios({
          url:`http://localhost:4000/educator/classroom/assignment/getone/${params.id}`,
          method:"GET", 
    
          headers:{"Content-Type":"application/json"}
    
        }).then((res)=>{
          console.log(res.data)
          setassignment(res.data.assignment)
          setsubmit(res.data.upload)
     
        }).catch((e)=>{
          console.log(e)
        })
      },[])
    //   console.log(submit)
    function markfn(e){
        e.preventDefault()
        console.log(e.target.id)
            axios({
                url:`http://localhost:4000/educator/classroom/assignment/mark/${e.target.id}`,
                method:"POST", 
                data:JSON.stringify(marks),
                headers:{"Content-Type":"application/json"}
              
              }).then((res)=>{
                console.log(res.data)
                // setstudent(res.data)
            
              }).catch((e)=>{
                console.log(e)
                console.log(e.message)
              })
      
    }
  return (
    <div>
        <Navba theme={theme} settheme={settheme}/>
 
       <div className='studyplandiv'>
       <h2 className='studyplandivh2'>ASSIGNMENTS</h2>
      
       <div key={assignment._id} className='studyplanfull' id='assignment1'>
        <h2 className='studysub'><span className='span'>SUBJECT : </span>{(assignment.subject)}</h2>
          <div className='studyplanfullhead'>
          <p><span className='span'>TITLE : </span>{(assignment.topic)}</p>
          <p><span className='span'>CREATEDAT : </span>{(assignment.createdAt)}</p>
          </div>
       
        {/* <p><span className='span'>DATE : </span>{res.task}</p> */}
        <div className='studyplanfullhead'>
        <p className='study'><span className='span'>DESCRIPTION : </span>{assignment.description}</p>
        <p><span className='span'>EXPIREDDAT : </span>{(assignment.expiresAt)}</p>
       </div>
       {submit.length>0?submit.map((res)=>{
        return <div key={res._id} className='submitdiv'>
            <div>
            <p> <span className='span'>Name : </span>{res.user_name}</p>
            </div>
            <p> <span className='span'>Email : </span>{res.user_email}</p>
          

        <img src={res.imagepath} alt=''  className='assignimage' />
        <div id="markform">

            <label>Mark</label>
            <div>
            <p>{assignment.marks}/</p><span><input type='number' name="mark" onChange={(e)=>setmarks({...marks,"mark":e.target.value})} /></span> 
            <button style={{backgroundColor:"red"}} id={res._id} onClick={(e)=>markfn(e)}>SAVE</button>
            </div>
           
            </div>
       
        </div>
       }):<p>STUDENTS NOT SUBMIT</p>}
      
   </div>
    
      </div>
    </div>
 
  )
}
