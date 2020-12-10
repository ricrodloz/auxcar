import React from "react";
import Checkoxes from "../partials/Checkboxes.js"
import Opcion from "../partials/Opcion.js"

class Pregunta extends React.Component {
  render() {
    return (
      <>
        {
          this.props.preguntas[0].predecesor === 0 ?
          this.props.preguntas.map(dato =>{ 
            return <Checkoxes key={dato.id} pregunta={dato} valor={dato.id} onClick={this.props.onCheckbox} />
          }) :
          <Opcion key={this.props.preguntas[0].id} pregunta={this.props.preguntas[0]} valor={this.props.preguntas[0].id} onClick={this.props.onRadioButton}/>
        }
      </>
    );
  }
}

export default Pregunta;