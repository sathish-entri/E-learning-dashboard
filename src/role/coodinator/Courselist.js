import React from 'react'

export default function Courselist({res,id}) {
    function showcourselistfn(e){
        console.log(e.target)
     }

  return (
    <div className='showcourselist2' key={res._id} id={id} onClick={(e)=>showcourselistfn(e)} >
        <h3 onClick={(e)=>showcourselistfn(e)} id={id}>{res.title}</h3>
        <p onClick={(e)=>showcourselistfn(e)} id={id}>{res.description}</p>
        <p onClick={(e)=>showcourselistfn(e)} id={id}>{res.language}</p>
        <p onClick={(e)=>showcourselistfn(e)} id={id}>{res.creater}</p>
        <p onClick={(e)=>showcourselistfn(e)} id={id}>{res.duration}</p>
    </div>
  )
}
