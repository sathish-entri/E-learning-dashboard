import React from 'react'

export default function Uploadassifn() {
  return (
    <form  action="http://localhost:4000/upload" method="post" enctype="multipart/form-data" > 
        <input type='file' accept='image/png, image/jpeg' id='image' name='image' ></input>
        <button  style={{backgroundColor:"red"}} type='submit'> Submit</button>
       </form>
  
  )
}
