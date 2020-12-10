import React from "react";
import { Link } from 'react-router-dom'

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// reactstrap components
import {
  Col,
  Row,
  Card,
  CardBody,
  Button
} from "reactstrap";

class Reporte extends React.Component {
    state = {
      fallas: [],
      asistenciaPrecio: 0.0,
      reparacion: 0.0,
      subtotal: 0.0,
      open: false
    }

  componentDidMount(){
    if(this.props.location.fallas_identificadas!=undefined){
     this.init();
    }else{
      this.props.history.push('/inicio');
    }
  }
  
  init=()=>{
    fetch(`https://rest-api-auxcar.cloudno.de/api/fallas-vehiculares`, {
      method: 'POST',
      body: `{
        "fallas": [${this.props.location.fallas_identificadas.toString()}]
      }`,
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response=>{
      return response.json();
    })
    .then(data=>{
      let reparacion=0.0;
      data.map(falla=>{
        reparacion+=falla.costo;
      });
      this.setState({
        asistenciaPrecio: this.props.location.asistenciaPrecio,
        reparacion: reparacion,
        subtotal: reparacion+this.props.location.asistenciaPrecio,
        fallas: data,
        open: false
      });
    }).catch(()=>{
      console.clear();
      this.setState({open: true});
      setTimeout(()=>this.init(),7000);
    });
  }
  
  render() {
      //section section-lg
      //section section-lg bg-gradient-default
    return (
        <>
        <Backdrop open={this.state.open} style={{"position": "fixed", "zIndex": 5}}>
            <CircularProgress color="inherit" />
        </Backdrop>
          <Row className="justify-content-center mt-4 ">
            <Col className="text-center mb-4 animate__animated animate__fadeInDown" sm="12">
              <h2 className="display-3 text-white">Reporte de diagnóstico vehicular</h2>
              <p className="text-white">
                El diagnóstico es el siguiente:   
              </p>
            </Col>
            <Col lg="7 mb-4">
              <Card className="shadow animate__animated animate__fadeInUp">
                <CardBody>
                    <div className="table-responsive-sm ">
                        <table className="table w-auto" >
                            <thead className="table-borderless ">
                            <tr>
                                <th className="h6">Falla</th>
                                <th className="h6">Costo de reparación</th>
                                <th className="h6">Causa probable</th>
                            </tr>
                            </thead>
                            <tbody className="table-borderless  description mt-3">
                            {
                            this.state.fallas.map((falla, i)=>{
                              return(
                              <tr key={i+"_tr"}>
                                <td>{falla.descripcion}</td>
                                <td>{falla.costo == 0 ? "Pendiente" : "S/. " + falla.costo}</td>
                                <td>{falla.causa}</td>
                              </tr>);
                            })}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className="mb-2 shadow shadow-lg animate__animated animate__fadeInUp">
                <CardBody>
                  <div className="row">
                    <div className="col"><h5 className="mt-3">Reparación</h5></div>
                      <div className="col text-right">
                        <p className="mt-3">
                          {this.state.reparacion==0 ? "Pendiente" : `S/.${this.state.reparacion}`}
                          
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col"><h5 className="mt-3">Asistencia</h5></div>
                      <div className="col text-right">
                        <p className="mt-3">
                          S/.{this.state.asistenciaPrecio}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col"><h5 className="mt-3">Subtotal*</h5></div>
                      <div className="col text-right"><p className="mt-3">
                        S/.{this.state.subtotal}
                      </p></div>
                    </div>
                    <div className="row">
                      <Col className="text-left" sm="12">
                      <small>(*) Los costos por asistencia varían por la distancia a recorrer por el mecánico.</small>
                      </Col>
                      <Col className="text-left" sm="12">
                      <small>(**)El subtotal no considera el costo de repuestos nuevos, en caso se requiera.</small>
                      </Col>
                    </div>
                </CardBody>
              </Card>
              <div className="text-center">
                <div className="btn-wrapper animate__animated animate__fadeInDown">
                  <Button
                    className="btn-white mt-2"
                    to='/inicio'
                    tag={Link}
                    >
                    Cerrar reporte
                  </Button>
                  <Button
                    className="mt-2"
                    color="success"
                    to={{pathname:'/solicitud-auxilio',
                    asistenciaDistrito:this.props.location.asistenciaDistrito,
                    codDistrito:this.props.location.codDistrito,
                    costo: this.state.subtotal,
                    fallas: this.props.location.fallas_identificadas
                    }}
                  tag={Link}
                  >
                    Solicitar mecánico
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

        </>
      );
  }
}

export default Reporte;