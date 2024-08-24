import React from 'react'
import { useEffect,useContext } from 'react'
import DataContext from '../../Usecontactapi'

export default function Edufooter() {
  const{homescreen,sethomescreen}=useContext(DataContext)
 function showscreenfn(e){
  sethomescreen(e)

 }
  return (
    <div className='educatorfooter'>
    <button className='course' style={{backgroundColor:homescreen=="classroom"?"red":null}} onClick={()=>showscreenfn("classroom")}>Classroom</button>
    <button className='course' style={{backgroundColor:homescreen=="allcourse"?"red":null}} onClick={()=>showscreenfn("allcourse")}>All course</button>
    <button className='course' style={{backgroundColor:homescreen=="people"?"red":null}} onClick={()=>showscreenfn("people")}>People</button>
</div>
  )
}
