import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Clasfooter from './Clasfooter'
import Logout from '../../Logout'
import Settings from '../../Settings'

import Studentlist from './Studentlist'
import Assignment from './Assignment'
import DataContext from '../../Usecontactapi'
import { useContext } from 'react'
import Classstudent from './Classstudent'
import Classroomlist from './Classroomlist'
import Navba from '../../Navba'


export default function Classroom({theme,settheme}) {
    const params = useParams()
const navigate=useNavigate()

    const id= params.id
    const[classroom,setclassroom]=useState([])
    const{classlist,setclasslist,setplux}=useContext(DataContext)
    useEffect(()=>{
      // setclasslist("studyplan")
      setplux(true)
        axios({
            url:`http://localhost:4000/educator/classroom/get/${id}`,
            method:"GET", 
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            setclassroom(res.data)
            
       
          }).catch((e)=>{
            console.log(e)
          })
    },[])

  return (
    <div>
        <nav>
            <Navba theme={theme} settheme={settheme}/>
        </nav>
        <main>
            {classlist=="studyplan" ? <Classroomlist id={id} classroom={classroom} />
        :classlist=="assignment"?<Assignment  id={id} />:<Classstudent studentlist={classroom.studentlist}/>}
        </main>
           <footer>
          
            <Clasfooter studentlist={classroom.studentlist} />
            </footer>   
            </div>
    // </div>
  )
}
