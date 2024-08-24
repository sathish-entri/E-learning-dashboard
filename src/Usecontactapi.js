import axios from "axios";
import { createContext } from "react";
import { useState,useEffect } from 'react';
// import 
// import { Dataprovider } from './content/Usercontentapi';



const DataContext=createContext({})

export const Dataprovider=({children})=>{

// cordinator states......................................................................................................................

    const [open, setOpen] = useState(true);
    const[themed, setthemed]=useState(true)
    const [course, setcourse]=useState([])
    const[idvalue,setidvalue]=useState([])
    const[showcourses, setshowcourses]=useState(true)
    const[selectedit, setselectedit]=useState(false)
    const[deleted,setdeleted]=useState(false)
    const[totalcourses,settotalcourses]=useState([])
    const[coorfooter, setcoorfooter]=useState("courses")
    const[focus,setfocus]=useState(true)
    const[focused,setfocused]=useState(true)
    const[foc,setfoc]=useState(true)
    const[file,setfile]=useState([])
    const[filename,setfilename]=useState()

//educator states........................................................................................
const userdetails=JSON.parse(localStorage.getItem("learning-token"))
const[classroom,setclassroom]=useState({
    classname:"",
    batch:"",
    subject:"",
    language:"",
    studentlist:[],
    token:userdetails
})
    const[classes,setclasses]=useState([])
    const[homescreen,sethomescreen]=useState("classroom")
    const[classlist,setclasslist]=useState("studyplan")
    const[addstudent,setaddstudent]=useState([])
    const[addcourse,setaddcourse]=useState([])
    const[studentlistt, setstudentlistt]=useState([])
    const[classstudenthide,setclassstudenthide]=useState(false)
    const[classstudenthides,setclassstudenthides]=useState(false)
    const[studentlist,setstudentlist]=useState([])
    const [searchcourse,setsearchcourse]=useState("")
    const[coornav,setcoornav]=useState(true)
    const[plux,setplux]=useState('')

    return(
        <DataContext.Provider value={{
           setidvalue, course, setcourse,idvalue,setidvalue,showcourses,focus,setfocus, setshowcourses,selectedit, setselectedit,deleted,setdeleted,totalcourses,settotalcourses,coorfooter, setcoorfooter,open, setOpen,focused,setfocused,foc,setfoc,
          filename,setfilename,file,setfile,classes,setclasses,homescreen,sethomescreen,classlist,setclasslist,addstudent,setaddstudent,addcourse,setaddcourse,studentlistt, setstudentlistt,classstudenthide,setclassstudenthide,studentlist,setstudentlist,
          classroom,setclassroom,searchcourse,setsearchcourse,classstudenthides,setclassstudenthides,coornav,setcoornav,plux,setplux,themed,setthemed
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext