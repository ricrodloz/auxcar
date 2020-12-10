import React from "react";
import Checkoxes from "../partials/Checkboxes.js"
import Opcion from "../partials/Opcion.js"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Col,
} from 'reactstrap'

class Encuesta extends React.Component {
  render() {
    var clase = "shadow shadow-lg--hover animate__animated animate__fadeInUp animate__fast";
    if(this.props.animar){
      clase = this.props.estado===0 ?
      "shadow shadow-lg--hover animate__animated animate__flipOutX animate__fast"
      :
      "shadow shadow-lg--hover animate__animated animate__slideOutUp animate__fast"
    }
    return (
      <Col className="justify-content-center" sm="6">
        <Card className={clase}>
            <form >
                <CardHeader>
                <h3 className="display-3 mb-0">
                    <strong>Auxcar</strong>
                </h3>
                <div>
                      <div className="icon icon-sm icon-shape">
                        <i className="ni ni-settings" />
                      </div>
                      <div className="icon icon-sm icon-shape">
                        <i className="ni ni-delivery-fast" />
                      </div>
                      <div className="icon icon-sm icon-shape">
                        <i className="ni ni-compass-04" />
                      </div>
                      <div className="icon icon-sm icon-shape">
                        <i className="ni ni-bus-front-12" />
                      </div>
                      <div className="icon icon-sm icon-shape">
                        <i className="ni ni-square-pin" />
                      </div>
                    </div>
                </CardHeader>
                <CardBody >
                {
                this.props.preguntas[0].predecesor === 0 ?
                this.props.preguntas.map(dato =>{ 
                  return <Checkoxes key={dato.id} pregunta={dato} valor={dato.id} onClick={this.props.onCheckbox} seleccionados={this.props.seleccionados} />
                }) :
                  <Opcion key={this.props.preguntas[0].id} pregunta={this.props.preguntas[0]} valor={this.props.preguntas[0].id} seleccionados={this.props.seleccionados} rbValor={this.props.rbValor} onClick={this.props.onRadioButton}/>
                }
                </CardBody>
                <CardFooter >
                  <div className="row">
                    <div className="col-md-8 mb-2">
                      <Button id="btn-1"  color="primary " type="button" 
                      disabled={this.props.preguntas[0].predecesor==0 ? true : false}
                      onClick={this.props.handleBack}>
                          Atrás
                      </Button>
                      <Button id="btn-2"  color="primary" type="button" onClick={this.props.handleNext}>
                          Siguiente
                      </Button>
                    </div>
                    <div className="col-md-4 ">
                      <Button
                        className="btn-icon btn-3 text-right"
                        color="primary"
                        type="button"
                        outline
                        disabled={this.props.preguntas[0].predecesor==0 ? true : false}
                        onClick={this.props.terminar}
                      >
                        Terminar
                      </Button>
                    </div>
                  </div>
                </CardFooter>
            </form>
        </Card>
      </Col>
    );
  }
}

export default Encuesta;