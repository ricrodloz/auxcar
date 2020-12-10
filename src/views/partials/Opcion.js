import React from "react";

class Opcion extends React.Component {
  

  render() {
    return (
      <>
      <h6>
        {this.props.pregunta.pregunta}
      </h6>
      <div className="custom-control custom-radio mb-3 mt-3">
        <input
          className="custom-control-input"
          id="customRadio2"
          name={this.props.valor}
          type="radio"
          value="si"
          onClick={this.props.onClick}
          defaultChecked={this.props.rbValor && this.props.seleccionados.includes(this.props.pregunta.id) ? true : false}
        />
        <label className="custom-control-label" htmlFor="customRadio2">
          <span>Sí</span>
        </label>
      </div>
        <div className="custom-control custom-radio mb-3">
            <input
            defaultChecked={!this.props.rbValor && this.props.seleccionados.includes(this.props.pregunta.id) ? true : false}
            onClick={this.props.onClick}
            className="custom-control-input"
            id="customRadio1"
            name={this.props.valor}
            type="radio"
            value="no"
            />
            <label className="custom-control-label" htmlFor="customRadio1">
            <span>No</span>
            </label>
        </div>
            
      </>
    );
  }
}

export default Opcion;