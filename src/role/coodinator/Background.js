import React from 'react'
import computerimage from "../../Pictures/computer.jpg"
import englishimage from "../../Pictures/image_search_1722497637446.jpg"

export default function Background({res}) {
    const backgroundImage = res === 'computerscience' || res.subject === 'computer science'
    ? `url(${computerimage})`
    : `url(${englishimage})`;

  console.log(backgroundImage); 
  return (
    <div>
        
    </div>
  )
}
