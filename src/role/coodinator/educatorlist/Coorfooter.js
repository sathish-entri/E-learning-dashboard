import React, { useContext } from 'react'
import DataContext from '../../../Usecontactapi'

export default function Coorfooter() {
    const{setcoorfooter}=useContext(DataContext)
    function showfooter(res){
        setcoorfooter(res)
      }
  return (
    <div>
         {/* <p onClick={()=>showfooter("courses")}>Courses</p>
            <p onClick={()=>showfooter("educators")}>Educators</p>
            <p onClick={()=>showfooter("leaners")}>Leaners</p>
            function showfooter(res){
        setcoorfooter(res)
      } */}
    </div>
  )
}
