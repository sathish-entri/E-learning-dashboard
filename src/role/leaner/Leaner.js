import React, { useState } from 'react'
import Logout from '../../Logout'
import Allcourses from '../Allcourses'
import Navba from '../../Navba'
import Leanerfooter from './Leanerfooter'
import Classwork from './Classwork'
import Classroom from './Classroom'
import Uploadassifn from './Uploadassifn'

export default function Leaner({theme,settheme}) {
  const[leanerfoot,setleanerfoot]=useState("classroom")
  // const[footer,setfooter]=useState("classroom")
  console.log(theme)
  return (
    <div>
      <Navba theme={theme} settheme={settheme} />
      {/* <Uploadassifn /> */}
      {leanerfoot=="classroom" ?<Classroom />:leanerfoot=="courses"?<Allcourses />:<Classwork />}
      <Leanerfooter setleanerfoot={setleanerfoot} leanerfoot={leanerfoot}  />
    </div>
  )
}
