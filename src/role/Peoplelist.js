import React, { useEffect, useState } from 'react'
import axios from "axios"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import leanericon from "../Pictures/leaner.png"
import educatoricon from "../Pictures/educator.jpg"

export default function Peoplelist() {
    const[peoplelist,setpeoplelist]=useState([])
    useEffect(()=>{
        axios({
            url:"http://localhost:4000/Peoplelist",
            method:"GET",
            // data:{token},
            headers:{"Content-Type":"application/json"}
        }).then((res)=>{
            setpeoplelist(res.data)
            
        }).catch((e)=>{
            console.log(e)
        })
    },[])
    console.log(peoplelist)
  return (
    <div>
        {peoplelist.length >0 ?
        <Container>
        <Row>
        { peoplelist.map((res)=>{
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
 
        :<p>not people here</p>}
    </div>
  )
}
