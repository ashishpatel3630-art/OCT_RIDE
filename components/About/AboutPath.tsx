import React from 'react'
import Introabout from './introabout'
import Teamsection from './Teamsection'
import CloseIntro from './CloseIntro'
import Footer from '../layout/Footer'
function AboutPath() {
  return (
    <div>
      <Introabout />
      <Teamsection />
      <CloseIntro />
      <Footer />  
      
    </div>
  )
}

export default AboutPath
