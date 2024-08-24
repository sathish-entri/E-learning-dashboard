import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import leanericon from "../../Pictures/leaner.png"
import educatoricon from "../../Pictures/educator.jpg"
import DataContext from '../../Usecontactapi'

export default function Classstudent({studentlist}) {
  const[student,setstudent]=useState([])

    useEffect(()=>{
        axios({
            url:"http://localhost:4000/educator/classroom/classstudent",
            method:"POST", 
            data:JSON.stringify(studentlist),
            headers:{"Content-Type":"application/json"}
          
          }).then((res)=>{
            console.log("normal")
            setstudent(res.data)
        
          }).catch((e)=>{
            console.log(e)
            console.log("error working")
          })
    },[])
  return (
    <div>
    { student.length>0 ? 
      <Container>
      <Row>
      { student.map((res)=>{
          return  <Col xs={12} md={3} lg={4} className='educatorlinediv'>
          <div><img src={res.role=="coordinator"?educatoricon:leanericon} alt='' height="100px" width="100px" /></div>
          <div className='educatorlinedivp'>
          <p><span className='span'>NAME : </span>{res.name}</p>
          <p><span className='span'>EMAIL : </span>{res.email}</p>
          <p><span className='span'>ROLE : </span>{res.role}</p>
          </div>
        
         
      </Col>
      })}
     </Row>
      </Container>
    : <p>no Students</p>}
    </div>
  )
}
