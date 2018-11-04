import React from 'react'

const Yhteensa = (props) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return (
        <div>
      <p>Yhteensä {props.kurssi.osat.map(osa => osa.tehtavia).reduce(reducer)} tehtävää</p>
        </div>
      )
}

export default Yhteensa