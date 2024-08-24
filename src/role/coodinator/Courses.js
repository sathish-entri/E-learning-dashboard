import React, { useContext, useEffect } from 'react'
import DataContext from '../../Usecontactapi'
import Logout from '../../Logout'
import CoordNav from './CoordNav'
import Editinput from './Editinput'
import Navba from '../../Navba'

export default function Courses({theme,settheme}) {
  const {setidvalue, idvalue, setcourse, course,coornav,setcoornav}=useContext(DataContext)
    const{_id,title,description,language,creater,duration,content,setselectedit,selectedit}=course
    useEffect(()=>{
      setidvalue([...idvalue,_id])

    },[])
    function coursefn(){
        console.log(course)
    }
    console.log(course)
  return (
    <div>
     <Navba theme={theme} settheme={settheme}/>
      {coornav==true?<CoordNav />:null}
      {course.length<=0?<h2>please choose your course & move to All page</h2>:
      selectedit==true?<Editinput  />:
  <div className='course-full-detailpage' onClick={coursefn}>
          <h3>{(title)}</h3>
      <h5>{description}</h5>
      <p>{content}</p>
      <h6>Creater  <span className='span'>{creater}</span></h6>
    </div>}
    </div>
  
  )
}
