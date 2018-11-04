import React from 'react'
import Otsikko from './Otsikko'
import Sisalto from './Sisalto'
import Yhteensa from './Yhteensa'

const Kurssi = ({ kurssi }) => {
    return (
        <div>
        <Otsikko kurssi={kurssi}/>
        <Sisalto osat={kurssi.osat}/>
        <Yhteensa kurssi={kurssi}/>
    </div>
    )
  }

export default Kurssi