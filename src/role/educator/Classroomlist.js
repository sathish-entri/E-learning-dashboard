import React, { useContext, useEffect } from 'react'
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import DataContext from '../../Usecontactapi';
import page1 from "../../Pictures/pag2.jpg"
import Studyplan from './Studyplan';

export default function Classroomlist({classroom,id}) {
const{addcourse,setaddcourse,classstudenthides,setclassstudenthides,setplux,plux}=useContext(DataContext)

    useEffect(()=>{
        setaddcourse([])
        setclassstudenthides(false)
    },[])
    const navigate=useNavigate()
function createstudyfn(){
navigate(`/educator/classroom/studyplan/${id}`)
}
  return (
    <div className='classroomlist'>
    <div className='classroomlisthead' style={{backgroundImage:`url(${page1})`,backgroundSize:"cover",backgroundPosition:"full"}}>
                <h3 className='fontsize'>{(classroom.classname)}</h3>
                <h5 id='spam'>{(classroom.batch)}</h5>
      </div>
      <Studyplan id={id} />
     {plux==true?<IoAddCircleSharp  onClick={createstudyfn} className='plux'/> : null} 
            </div>
  )

}
