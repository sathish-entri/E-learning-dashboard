import React, { useState,useEffect } from 'react'
import Coorfooter from './Coorfooter'
import axios from 'axios'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import educatoricon from "../../../Pictures/leaner.png"

export default function Leanerlist() {
const[educatorl,seteducatorl]=useState([])

    useEffect(()=>{
        const role={"role":"leaner"}
        axios({
            url:"http://localhost:4000/leanerlist",
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
            return <Col xs={12} md={3} lg={4} className='educatorlinediv'>
                <div><img  className='educatorlinedivimg' src={educatoricon} alt='' height="100px" width="100px" /></div>
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

