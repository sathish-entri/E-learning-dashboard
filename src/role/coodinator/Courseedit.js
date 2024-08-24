import React from 'react'
import Logout from '../../Logout'
import CoordNav from './CoordNav'
import Settings from '../../Settings'
import Navba from '../../Navba'

export default function Courseedit({theme,settheme}) {
  return (
    <div>
        <Navba theme={theme} settheme={settheme} />
        <CoordNav />        

    </div>
  )
}
