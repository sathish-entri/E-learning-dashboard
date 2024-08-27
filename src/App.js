import logo from './logo.svg';
import './App.css';
import Registerr from './register-login/Registerr';
import { Route, Routes } from 'react-router-dom';
import Login from "./register-login/Login"
import {useState} from "react"
import Home from './Home';
import Coodinator from "./role/coodinator/Coodinator"
import Educator from "./role/educator/Educator"
import  Leaner from "./role/leaner/Leaner"
import Newcousers from './role/coodinator/Newcousers';
import Logout from './Logout';
import ShowCourses from './role/coodinator/Showcourses';
import Courses from './role/coodinator/Courses';
import { Dataprovider } from './Usecontactapi';
import Editcourses from './role/coodinator/Editcourses';
import Educatorlist from './role/coodinator/educatorlist/Educatorlist';
import Leanerlist from './role/coodinator/educatorlist/Leanerlist';
import Cor from './Cor';
import Createclass from './role/educator/Createclass';
import Classroom from './role/educator/Classroom';
import Studentlist from './role/educator/Studentlist';
import Studycreate from './role/educator/Studycreate';
import Assignmentcreate from './role/educator/Assignmentcreate';
import ClassList from './role/leaner/ClassList';
import Submitassign from './role/educator/Submitassign';
// import Hell from './Hell';

function App() {
  let localvalue = localStorage.getItem("register")
 
  const[login, setlogin]=useState(localStorage.getItem("register")== "false" ?false:true)
  const [theme,settheme]=useState(true)
  return (
    <div className={theme==true?"App":'HH'}>
      
      <Dataprovider>
        
      <header className="App-header" >
        <Routes>
        
          <Route path='/' element={ login? <Registerr setlogin={setlogin} /> :<Login setlogin={setlogin} />}/>
          <Route path='/home' element={<Home theme={theme} settheme={settheme} />}/>
          <Route path='/coordinator' element={ <Coodinator theme={theme} settheme={settheme} />}/>
          <Route path='/educator' element={<Educator theme={theme} settheme={settheme} /> }/>
          <Route path='/leaner' element={<Leaner theme={theme} settheme={settheme} />}/>
          <Route path='/studentlist' element={<Studentlist theme={theme} settheme={settheme} />}/>
          <Route path='/coordinator/Newcousers' element={<Newcousers theme={theme} settheme={settheme}/>}/>
          <Route path='/courses' element={<Courses theme={theme} settheme={settheme}/>}/>
          <Route path='/editcourses' element={<Editcourses theme={theme} settheme={settheme}/>}/>
          <Route path='/coordinator/educator' element={<Educatorlist theme={theme} settheme={settheme}/>}/>
          <Route path='/coordinator/leaner' element={<Leanerlist theme={theme} settheme={settheme}/>}/>
          <Route path='/educator/createclassroom' element={<Createclass theme={theme} settheme={settheme}/>}/>
          <Route path='/educator/classroom/:id' element={<Classroom theme={theme} settheme={settheme}/>}/>
          <Route path='/leaner/classroom/:id' element={<ClassList theme={theme} settheme={settheme}/>}/>
          <Route path='/educator/classroom/studyplan/:id' element={<Studycreate theme={theme} settheme={settheme}/>}/>
          <Route path='/educator/classroom/assignment/:id' element={<Assignmentcreate theme={theme} settheme={settheme}/>}/>
          <Route path='/educator/classroom/assignment/submition/:id' element={<Submitassign theme={theme} settheme={settheme}/>}/>
         
        </Routes>
          
      </header>
      </Dataprovider>
    
    </div>
  );
}

export default App;
