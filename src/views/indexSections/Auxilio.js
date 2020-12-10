import React from "react";

// reactstrap components
import {
  Row
} from "reactstrap";

// core components
import Solicitud from "../partials/Solicitud";
import Finalizado from "../partials/Finalizado";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class Auxilio extends React.Component {
    constructor(){
        super();
        this.state = {
            latitud: 0,
            longitud: 0,
            cliente: "",
            contacto: "",
            referencia: "",
            done: false,
            animar: false,
            showError: false,
            open: false,
            mensajeError: "Por favor, complete todos los campos."
        }
    }
    
  componentWillMount() {
    if(this.props.location.asistenciaDistrito!=undefined){
      window.scroll(0,0);
      this.getUbicacion();
    }else{
      this.props.history.push('/');
    }
  }

  getUbicacion=()=>{
    if(navigator.geolocation) {
      navigator.geolocation.watchPosition((position)=>{
        this.setState({latitud: position.coords.latitude, longitud: position.coords.longitude});
      },()=>{this.setState({mensajeError: "Por favor, otorgue permisos de geolocalización."});});
    }else{
      this.setState({mensajeError: "Geolocalización no disponible"});
    }
  }
  
  handleChange = (e) => {
    switch (e.target.id) {
        case "txtCliente":
        this.setState({cliente: e.target.value});
        break;
        case "txtContacto":
        this.setState({contacto: e.target.value});
        break;
        case "txtReferencia":
        this.setState({referencia: e.target.value});
        break;
    }
  };

  alertState=(e)=>{
    if(e && e.target.textContent == "×"){
      this.setState({showError: false});
    }else{
      window.scroll(0,0);
      this.setState({showError: true});
    }
  }

  saveAuxilio = (insertedId) => {
    fetch(`https://rest-api-auxcar.cloudno.de/api/auxilio`,
    {
      method: 'POST',
      body: `
      {
          "lat": ${this.state.latitud},
          "long": ${this.state.longitud},
          "cliente": "${this.state.cliente}",
          "contacto": "${this.state.contacto.substr(4)}",
          "diagnostico": ${insertedId},
          "referencia": "${this.state.referencia}"
      }
      `,
      headers:{
          'Content-Type': 'application/json'
      }
    }).then(response=>{
      return response.json(); 
    }).then(JSONresponse=>{
      this.setState({done:false});
      return JSONresponse.status;
    }).then(status=>{
      if(status==200){
        this.setState({animar: true, open: false});
        setTimeout(() => {
          this.setState({done:true});
        }, 500);
      }
    })
    .catch(()=>{
        console.clear();
        this.setState({open: true});
        setTimeout(()=>this.saveAuxilio(insertedId),7000);
    });
  }

  saveDiagnostico = () => {
    fetch(`https://rest-api-auxcar.cloudno.de/api/diagnostico`, {
          method: 'POST',
          body: `{
              "distrito": ${this.props.location.codDistrito},
              "costo": ${this.props.location.costo},
              "fallas": [${this.props.location.fallas.toString()}]
          }`,
          headers:{
              'Content-Type': 'application/json'
          }
      })
      .then(response=>{
        return response.json();
      })
      .then(JSONresponse=>{
        return JSONresponse.insertedId;
      }).then(_id=>{
        this.setState({open: false});
        this.saveAuxilio(_id);
      })
      .catch(()=>{
          console.clear();
          this.setState({open: true});
          setTimeout(()=>this.saveDiagnostico(),7000);
      });
  }

  handleSubmit=()=>{
    if(this.state.cliente.length>0 &&
      this.state.contacto.length>0 &&
      this.state.referencia.length>0 && 
      this.state.latitud != 0 && 
      this.state.longitud != 0){
        this.saveDiagnostico();    
    }else{
      this.alertState();
    }
  }

  render() {
    return (
      <>
        <Backdrop open={this.state.open} style={{"position": "fixed", "zIndex": 5}}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <Row className="justify-content-center">
          {
            this.state.done ? <Finalizado /> : 
            <Solicitud 
            showError={this.state.showError}
            mensajeError={this.state.mensajeError}
            animar={this.state.animar}
            distrito={this.props.location.asistenciaDistrito}
            handleChange={this.handleChange}
            latitud={this.state.latitud}
            longitud={this.state.longitud}
            alertState={this.alertState}
            handleSubmit={this.handleSubmit}/>
          }
        </Row>
      </>
    );
  }
}

export default Auxilio;
