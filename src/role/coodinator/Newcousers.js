import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { json, useNavigate } from 'react-router-dom'
import Logout from '../../Logout'
import CoordNav from './CoordNav'
import Navba from '../../Navba'
import DataContext from '../../Usecontactapi'

export default function Newcousers({setnewcourses,theme,settheme}) {
  // const{}

 
 const{setfocus,focused,setfocused,filename,setfilename,file,setfile}=useContext(DataContext)


 useEffect(()=>{
  setfocused(true)
  setfocus(false)
})

const fileref = useRef()
  const userdetails=JSON.parse(localStorage.getItem("learning-token"))
  const navigate=useNavigate()
 
 const[formdata, setformdata]=useState({})
  const[additem, setadditem]=useState({
     title:"",
     subject:"",
     description:"",
     language:"",
     creater:"",
     duration:"",
     content:"",
    //  image:"",
    //  file:formdata,
     token:userdetails
})
// var filedata
// function savefile(e){
//   e.preventDefault()
 
  // setfilename(fileref.current.files[0].name)

  
// const formData=new FormData();
//  formData.append("file",file)
//  setformdata(formData)
//  setadditem({...additem,"image":formData})
// }

function newcousersaddfn(e){

  e.preventDefault()
  // setfile(fileref.current.files[0])
// const file=fileref.current.files;
// const filename=fileref.current.files[0].name;
// if(file){
// console.log(file)
//   }
//     const formData = new FormData();
// formData.append("file",file)
//   formData.append("filename",file)

  navigate("/coordinator")

// console.log(formData)


  axios({
    url:"http://localhost:4000/coordinator/newcorses",
    method:"POST",
    data:JSON.stringify(additem),
    // data:formData,
    headers:{"Content-Type":"application/json"}, 
  }).then((res)=>{
    console.log(res)
  }).catch((e)=>{
    console.log(e.message)
  })

}
function newcousersaddfnn(e){
  
  e.preventDefault()
}
  return (
    <div  className='editformdiv'>
      
      <Navba theme={theme} settheme={settheme}/>
      <CoordNav />
        <form onClick={(e)=>newcousersaddfnn(e)} className='editform' method='POST' encType='multipart/form-data'>
            <input  placeholder='Tittle' name='title' type='text' onChange={(e)=>setadditem({...additem,"title":e.target.value})} /><br/>
            <input  placeholder='subject' name='subject' type='text' onChange={(e)=>setadditem({...additem,"subject":e.target.value})} /><br/>
            <input  placeholder='Description' name='description' type='text' onChange={(e)=>setadditem({...additem,"description":e.target.value})}/><br/>
            <input  placeholder='Language' name='language' type='text' onChange={(e)=>setadditem({...additem,"language":e.target.value})}/><br/>
            <input  placeholder='craeted by' name='creater' type='text' onChange={(e)=>setadditem({...additem,"creater":e.target.value})}/><br/>

            
            <input  placeholder='Duration' name='duration' type='text' onChange={(e)=>setadditem({...additem,"duration":e.target.value})}/><br/>
        
            <textarea placeholder='content' onChange={(e)=>setadditem({...additem,"content":e.target.value})}></textarea>
            <div>
              {/* <label>files</label> */}
            {/* <input  type='file'  ref={fileref} /><br/> */}
           </div>
           <button onClick={(e)=>newcousersaddfn(e)}>Add</button>
        </form>
        {/* onChange={savefile}  */}

           </div>
 
  )
}
