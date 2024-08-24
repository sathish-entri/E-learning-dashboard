import React from 'react'
import Logout from '../../Logout'
import Allcourses from '../Allcourses'
// import Educatfooter from './Educatfooterucatfooter'
import Navba from "../../Navba"
import Edufooter from './Edufooter'
import Studentlist from './Studentlist'
import Createclass from './Createclass'
// import Showclass from './Showclass'
import Showclasses from './Showclasses'
import DataContext, { Dataprovider } from '../../Usecontactapi'
import { useEffect,useContext } from 'react'
import Peoplelist from '../Peoplelist'
import { IoAddCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'

export default function Educator({theme,settheme}) {
  const{homescreen,sethomescreen,setaddstudent,setclassstudenthide,classstudenthide }=useContext(DataContext)
  
  useEffect(()=>{
    setaddstudent([])
    setclassstudenthide(false)
  },[])

  const navigate=useNavigate()
  function addfun(){
    navigate("/educator/createclassroom")
  }
  return (
    <div>
      <Navba theme={theme} settheme={settheme} />
    {homescreen=="classroom" ?  <Showclasses />:homescreen=="allcourse" ? <Allcourses />:<Peoplelist />}
    <IoAddCircleSharp onClick={addfun}  className='plux'/>
      <Edufooter homescreen={homescreen} />
   
    </div>
  )
}
