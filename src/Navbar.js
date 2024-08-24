import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { IoSettingsSharp } from "react-icons/io5";
import Logout from './Logout';

function Settings() {
  const [open, setOpen] = useState(false);

  return (
    <div>
     <div className='headerr'>
        <p>sathish</p>

      </div>
        <IoSettingsSharp onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open} />
 
      <div style={{ minHeight: '150px' }} >
        <Collapse in={open} dimension="width">
          <div id={open? "example-collapse-text" : ""}>
            <Logout />
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Settings;