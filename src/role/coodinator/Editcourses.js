import React, { useContext, useEffect } from 'react'
import Logout from '../../Logout'
import CoordNav from './CoordNav'
import Newcousers from './Newcousers'
import ShowCourses from './Showcourses'
import Navba from '../../Navba'
import DataContext from '../../Usecontactapi'

export default function Editcourses({theme,settheme}) {
  const{setfoc,setfocus}=useContext(DataContext)
  useEffect(()=>{
    setfocus(false)
  })
  return (
    <div>
        <Navba theme={theme} settheme={settheme} />
        <CoordNav />
        <ShowCourses />
        
    </div>
  )
}
