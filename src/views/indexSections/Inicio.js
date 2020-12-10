import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Row,
  Col
} from "reactstrap";
// core components

class Inicio extends React.Component {
  render() {
    return (
      <>
      <Row className="align-items-center justify-content-center mt-5">
        <Col lg="6" className="text-center ">
          <h1 className="display-3 text-white animate__animated animate__fadeInDown animate__slow">
            Hola!{" "}
            <span>Bienvenido a <strong>Auxcar</strong>, tu asistente vehicular</span>
          </h1>
          <div className="mt-1 animate__animated animate__fadeIn">
            <div className="icon icon-md icon-shape">
              <i className="ni ni-settings text-white" />
            </div>
            <div className="icon icon-md icon-shape">
              <i className="ni ni-delivery-fast text-white" />
            </div>
            <div className="icon icon-md icon-shape">
              <i className="ni ni-compass-04 text-white" />
            </div>
            <div className="icon icon-md icon-shape">
              <i className="ni ni-bus-front-12 text-white" />
            </div>
            <div className="icon icon-md icon-shape">
              <i className="ni ni-square-pin text-white" />
            </div>
          </div>
          <h2 className="lead text-muted text-white animate__animated animate__fadeInUp animate__slow mt-1">
          A continuación te haremos algunas preguntas para realizar el diagnóstico de tu vehículo
          </h2>
          <div className="btn-wrapper animate__animated animate__fadeInUp animate__slow">
            <Button
              className="btn-icon btn-3 btn-white "
              color="default"
              to="/ubicacion"
              type="button"
              tag={Link}
            >
              <span className="btn-inner--icon mr-1">
                <i className="fa fa-car" />
              </span>
              <span className="btn-inner--text">
                Empezar
              </span>
            </Button>
          </div>
        </Col>
      </Row>
      </>
    );
  }
}

export default Inicio;
