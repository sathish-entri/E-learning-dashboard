import React, { useContext } from 'react'
import DataContext from '../../Usecontactapi'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import leanericon from "../../Pictures/leaner.png"
// import leanericon from "../../"
import educatoricon from "../../Pictures/educator.jpg"


export default function Searchstudent({studentlist}) {
    const{setaddstudent,addstudent}=useContext(DataContext)
    function studentfn(e){
        setaddstudent( [...addstudent,e.target.id])

       
    }
  return (
    <div>
       <Container>
       <Row>
    {studentlist.map((res)=>{
      return  <Col xs={12} md={3} lg={4} className='educatorlinediv' onClick={(e)=>studentfn(e)} id={res._id} key={res._id}>
      <div><img src={res.role=="coordinator"?educatoricon:leanericon} alt='' height="100px" width="100px" onClick={(e)=>studentfn(e)} id={res._id}/></div>
            <div className='educatorlinedivp' onClick={(e)=>studentfn(e)} id={res._id}>
            <p onClick={(e)=>studentfn(e)} id={res._id}><span className='span' onClick={(e)=>studentfn(e)} id={res._id}>NAME : </span>{res.name}</p>
            <p onClick={(e)=>studentfn(e)} id={res._id}><span className='span' onClick={(e)=>studentfn(e)} id={res._id}>EMAIL : </span>{res.email}</p>
            <p onClick={(e)=>studentfn(e)} id={res._id}><span className='span' onClick={(e)=>studentfn(e)} id={res._id}>ROLE : </span>{res.role}</p>
            </div>
          
      </Col>
})}
  </Row>
  </Container>
  </div>
   
  )
}
