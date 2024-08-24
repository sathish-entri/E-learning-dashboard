import React, { useContext, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import computerimage from "../Pictures"
import computerimage from "../Pictures/compter2.jpg"
import englishimage from "../Pictures/computer3.jpg"
import tamilimage from "../Pictures/book1.jpg"
import commerceimage from "../Pictures/book3.jpg"
import axios from 'axios';
import DataContext from '../Usecontactapi';
import { useNavigate } from 'react-router-dom';

export default function Allcourseslist({totalcourses,setaddcourse,addcourse}) {

  const{setcourse,coornav,setcoornav}=useContext(DataContext)
useEffect(()=>{
setcoornav(false)
},[])

  const navigate=useNavigate()
  function courseselectfn(e){
   
    if(addcourse==undefined){
      const idvalue =e.target.id
      const token=JSON.parse(localStorage.getItem("learning-token"))
    console.log(idvalue)  
  
      axios({
      url:`http://localhost:4000/showcourses/get/${idvalue}`,
      method:"POST",
      data:{token},
      headers:{"Content-Type":"application/json"}

    }).then((res)=>{
      console.log(res.data)
      setcourse(res.data)
 
    }).catch((e)=>{
      console.log(e)
    })
navigate("/courses")
    }else{
      setaddcourse([...addcourse,e.target.id])
   
  }
  
  }
  return (
    <div  className='showcourselist'>
      <Container>
        <Row>
          {totalcourses.map((res)=>{
      return (
        <Col xs={6} md={6} lg={6} gap={3} className='showcourselist1' id={res._id} key={res._id} onClick={(e)=>courseselectfn(e)} style={{backgroundImage : res.subject =="computer science"?`url(${computerimage})` :res.subject=="English" ?`url(${englishimage})`:res.subject=="Commerce"?`url(${commerceimage})`:`url(${tamilimage})`,backgroundSize:"cover",backgroundPosition:"center"}}>
      <h2 id={res._id}>{res.title}</h2>
      <p id={res._id}>{res.description}</p>
      <p id={res._id}>{res.language}</p>
      {/* <p id={res._id}>{res.duration}</p> */}
      </Col>
    )
})}
 </Row>
 </Container>

    </div>

  )
}
