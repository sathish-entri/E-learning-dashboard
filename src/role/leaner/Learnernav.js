import React from 'react'

export default function Learnernav({setlearnernav,learnernav}) {
    function navclickfn(e){
        setlearnernav(e)
    }
  return (
    <div className='educatorfooter'>
        <button className='course' style={{backgroundColor:learnernav=="studyplan"?"red":null}} onClick={()=>navclickfn("studyplan")} >Studyplan</button>
        <button className='course' style={{backgroundColor:learnernav=="assignment"?"red":null}} onClick={()=>navclickfn("assignment")}  >Assignment</button>
        {/* <button className='course' style={{backgroundColor:learnernav=="classworks"?"red":null}} onClick={()=>footerfn("classworks")}>Classworks</button> */}
    </div>
  )
}
