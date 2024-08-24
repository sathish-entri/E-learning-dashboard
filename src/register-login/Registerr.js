  import React, { useContext } from 'react'
  import { useState } from 'react'
  import {useEffect} from "react"
  import axios from "axios"
  import DataContext from '../Usecontactapi'

  export default function Registerr({setlogin}) {


    const{setfilename,filename}=useContext(DataContext)

    function registerfn(){
      setlogin(false)
    }

  const[errormsg ,seterrormsg]=useState({})
  const[error,seterror]=useState({
    fname:"",
    email:"",
    mobile:"",
    password:"",
    cpassword:"",
    role:"",
    image:"",
    files:""
  })
  // console.log(error)
  function onchangefn(e){
    var {name,value} = e.target
    console.log(error)
    seterror({...error,[name]:value})

  }

  // function savefiles(e){
  //   setfilename(e.target.files)

    
  // const formData=new FormData();
  // formData.append("file",e.target.files)
  // seterror({...error,"files":e.target.files})
  // }

  function formsubmitfn(e){
    e.preventDefault()
    console.log(error)
  var handleerror={}
  if(!error.fname.trim()){
    handleerror.fname="name is required"
  }
  if(!error.email.trim()){
    handleerror.email="email is required"
  }
  if(!error.mobile.trim()){
    handleerror.mobile="mobile number is required"
  }
  if(error.mobile.trim().length !==10){
    handleerror.mobile="invalid mobile number"
  }
  if(!error.password.trim()){
    handleerror.password="password is required"
  }
  if(error.cpassword.trim() !== error.password.trim()){
    handleerror.cpassword="password is not match"
  }
  if(!error.role){
    handleerror.role="role is manitory"
  }
  // console.log(handleerror)
  seterrormsg(handleerror)
  if(Object.keys(handleerror).length===0){
      
    axios({ 
      url:"http://localhost:4000/register",
      method:"POST",
      data:JSON.stringify(error),
      headers:{"Content-Type":"application/json"}, 
    }
    ).then((res)=>{
      alert(res.data)
      setlogin(false)
    
    }).catch((e)=>{
      
      alert(e.response.data)
      // handleerror.email="alredt eruku"
    })

  }
  seterrormsg(handleerror)

  }

function alertfn(e){
  // if(e.target.value=="leaner"){
  //   alert("Please use that account for better understant my project                     emailid: ashik@gmail.com /password : ashik")
  // }
}
    
    return (
      <div className='register'>
      <form  onSubmit={(e)=>formsubmitfn(e)} className='register1'>
      {/* <form  action="http://localhost:4000/leaner/assignment/upload" method="post" enctype="multipart/form-data"  >
         <input type='file' accept='image/png, image/jpeg' id='image' name='image' ></input> */}
      <input type='text' name='fname' placeholder='Enter your name'  onChange={(e)=>onchangefn(e)}/><br/>
      <span  id='spam' className='span'>{errormsg.fname}</span><br/>
      <input type='email' name='email' placeholder='Enter your email' onClick={()=>alert("don't give your orginal account id")} onChange={(e)=>onchangefn(e)}/><br/>
      <span  id='spam' className='span'>{errormsg.email}</span><br/>
      
      <input type='number' name='mobile'  placeholder='Enter your mobile number' onClick={()=>alert("dont give your orginal id")} onChange={(e)=>onchangefn(e)}/><br/>
      <span  id='spam' className='span'>{errormsg.mobile}</span> <br/>
      <input type='password' name='password' placeholder='password' onChange={(e)=>onchangefn(e)}/><br/>
      <span  id='spam' className='span'>{errormsg.password}</span> <br/>
      <input type='password' name='cpassword'  placeholder='confirm password' onChange={(e)=>onchangefn(e)}/><br/>
      <span  id='spam' className='span'>{errormsg.cpassword}</span> <br/>
      <select onChange={(e)=>onchangefn(e)} name="role" onClick={(e)=>alertfn(e)} >
      <option value="" name="role" selected disabled hidden >Choose Your Role </option>
        <option value="coordinator" name="role">Coordinator</option>
        <option value="educator" name="role">Educator</option>
        <option value="leaner" name="role" >Student</option>
      </select><br/>
      <span  id='spam' className='span'>{errormsg.role}</span><br/>
      <button type='submit' >submit</button>
      <p>Move to Login Page ?<span className='span' onClick={registerfn}>click me</span></p>
  </form>
        </div>
    )
  }

