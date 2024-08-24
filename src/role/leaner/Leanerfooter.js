import React from 'react'

export default function Leanerfooter({setleanerfoot,leanerfoot}) {
    function footerfn(e){
        setleanerfoot(e)
    }
  return (
    <div className='educatorfooter'>
        <button className='course' style={{backgroundColor:leanerfoot=="classroom"?"red":null}} onClick={()=>footerfn("classroom")}>Classroom</button>
        <button className='course' style={{backgroundColor:leanerfoot=="courses"?"red":null}} onClick={()=>footerfn("courses")}> Courses</button>
        {/* <button className='course' style={{backgroundColor:leanerfoot=="classworks"?"red":null}} onClick={()=>footerfn("classworks")}>Classworks</button> */}
    </div>
  )
}
