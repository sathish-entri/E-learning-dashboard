import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Courselist from './Courselist'
import { json } from 'react-router-dom'
import Courses from './Courses'
import DataContext from '../../Usecontactapi'
import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Editinput from './Editinput'
import Form from 'react-bootstrap/Form';
import Educator from '../educator/Educator'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import computerimage from "../../Pictures/compter2.jpg"
import englishimage from "../../Pictures/book1.jpg"
import tamilimage from "../../Pictures/book2.jpg"
import commerceimage from "../../Pictures/computer3.jpg"
import Stack from 'react-bootstrap/Stack';

export default  function ShowCourses() {
  const[resvalue,setresvalue]=useState([])
 
 const{course, setcourse, idvalue, setidvalue, selectedit,filename, setselectedit,deleted,setdeleted,focus,setfocus,focused,setfocused,coornav,setcoornav}=useContext(DataContext)
 const navigate=useNavigate()
  useEffect(()=>{
    const token=JSON.parse(localStorage.getItem("learning-token"))
    setcourse([])
    setidvalue([])
    setfocused(false)
    setcoornav(true)
    axios({
      url:"http://localhost:4000/showcorses",
      method:"POST",
      data:{token},
      headers:{"Content-Type":"application/json"}, 
    }).then((res)=>{
     
      if(Array.isArray(res.data)){
        setresvalue(res.data)
        
      }else{
        console.log("response data is not array")
      }
     
    }).catch((e)=>{
      console.log(e)
    })
  
  },[deleted])
  function showcourselistfn(e){

    if(deleted){
          const token=JSON.parse(localStorage.getItem("learning-token"))
          const idvalue =e.target.id 
     
          axios({
            url:`http://localhost:4000/showcourses/update/${idvalue}`,
            method:"POST",
            data:{token},
            headers:{"Content-Type":"application/json"}
      
          }).then((res)=>{
            console.log(res.data)
           
          }).catch((e)=>{
            console.log(e)
          })
          navigate("/coordinator")
          setdeleted(false)
           
    }else{
    const idvalue =e.target.id
    const token=JSON.parse(localStorage.getItem("learning-token"))
    // console.log("worked")
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
  }}



  return (
    <div className='showcourselist'>
    
  {/* <img src={Computerimage} alt=''/> */}


      {
      course.length<=0  ?
       Array.isArray(resvalue) && resvalue.length>0? 
       <Container>
        <Stack >
        <Row>
      { resvalue.map((res)=>{
       
       return  <Col xs={12} md={6} lg={6} gap={3} className='showcourselist1' key={res._id} id={res._id}  onClick={(e)=>showcourselistfn(e)} style={{backgroundImage : res.subject =="computer science"?`url(${computerimage})` :res.subject=="English" ?`url(${englishimage})`:res.subject=="Commerce"?`url(${commerceimage})`:`url(${tamilimage})`,backgroundSize:"cover",backgroundPosition:"center"}}>
         
       
        <h2 onClick={(e)=>showcourselistfn(e)} id={res._id}>{res.title}</h2>
        <p onClick={(e)=>showcourselistfn(e)} id={res._id}>{res.description}</p>
        <p onClick={(e)=>showcourselistfn(e)} id={res._id}>{res.language}</p>
      
        </Col>
       
       
 
      }) }
       </Row>
       </Stack>
      </Container> :
      <div className='empty'>Course not available</div>:selectedit==true?<Editinput course={course} />:navigate("/courses")}
   
    
    </div>
  )
}





  // function deletefn(e){
  //  console.log("working single")
  //   const token=JSON.parse(localStorage.getItem("learning-token"))
  //  const idvalue =e.target.id
//    setidvalue(e.target.id)
//     axios({
//       url:`http://localhost:4000/showcourses/update/${idvalue}`,
//       method:"POST",
//       data:{token},
//       headers:{"Content-Type":"application/json"}

//     }).then((res)=>{
//       console.log(res.data)
     
//     }).catch((e)=>{
//       console.log(e)
//     })
//  }