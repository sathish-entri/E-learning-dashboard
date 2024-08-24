import React, { useState,useEffect } from 'react'
import Coorfooter from './Coorfooter'
import axios from 'axios'
import educatoricon from "../../../Pictures/educator.jpg"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Educatorlist() {
const[educatorl,seteducatorl]=useState([])

    useEffect(()=>{
        const role={"role":"educator"}
        axios({
            url:"http://localhost:4000/educatorlist",
            method:"POST", 
            data:JSON.stringify(role),
            headers:{"Content-Type":"application/json"}
    
          }).then((res)=>{
            console.log(res.data)
            seteducatorl(res.data)
       
          }).catch((e)=>{
            console.log(e)
          })
    
    },[])
  return (
    <div>
        <main className='educatorlinedivmain'>
       
        {educatorl.length>0 ? 
         <Container>
        <Row>
       { educatorl.map((res)=>{
            return <Col xs={6} md={6} lg={4} className='educatorlinediv'>
                <div><img src={educatoricon} alt='' className='educatorlinedivimg' /></div>
                <div className='educatorlinedivp'>
                <p><span className='span'>NAME : </span>{res.name}</p>
                <p><span className='span'>EMAIL : </span>{res.email}</p>
                <p><span className='span'>ROLE : </span>{res.role}</p>
                </div>
              
               
            </Col>
        })}
 </Row>
 </Container>
        :<p> no educators</p>}
       
        </main>
        <footer>
            <Coorfooter />
        </footer>
    </div>
  )
}
