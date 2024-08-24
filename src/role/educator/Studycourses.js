import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import computerimage from "../../Pictures/compter2.jpg"
import englishimage from "../../Pictures/book1.jpg"
import tamilimage from "../../Pictures/book2.jpg"
import commerceimage from "../../Pictures/computer3.jpg"
// import Stack from 'react-bootstrap/Stack';

import axios from 'axios'
import DataContext from '../../Usecontactapi';
import { useNavigate } from 'react-router-dom';

export default function Studycourses({course}) {
    const[studycourse,setstudycourse]=useState([])
    const{setcourse,setcoornav,plux,setplux}=useContext(DataContext)
    const navigate=useNavigate()
    useEffect(()=>{
      setcoornav(false)
        axios({
            url:`http://localhost:4000/educator/classroom/studyplan/getcourse/${course}`,
            method:"GET", 
            // data:JSON.stringify(studyplan),
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            
            setstudycourse(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })  
    },[])
    function movecoursefn(e){
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
    }
  return (
    <div className='showcourselist'>
       <Container>
      
        <Row>
{studycourse.map((res)=>{
    return <Col xs={12} md={6} lg={6} gap={3} onClick={(e)=>movecoursefn(e)} className='showcourselist1' key={res._id} id={res._id}   style={{backgroundImage : res.subject =="computer science"?`url(${computerimage})` :res.subject=="English" ?`url(${englishimage})`:res.subject=="Commerce"?`url(${commerceimage})`:`url(${tamilimage})`,backgroundSize:"cover",backgroundPosition:"center"}}>
        <h2 id={res._id}>{res.title}</h2>
      <p id={res._id}>{res.description}</p>
      <p id={res._id}>{res.language}</p>
    </Col>
    
    })}
     
        </Row>
        </Container>
      
    </div>
  )
}
