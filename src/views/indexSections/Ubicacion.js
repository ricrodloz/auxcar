import React from "react";
// reactstrap components
import {
  Col,
  Row,
  Button
} from "reactstrap";

import {
  Backdrop,
  CircularProgress
} from '@material-ui/core';

import Select from "react-select";

class Ubicacion extends React.Component {
  constructor(){
    super();
    this.state={
      data: [],
      distritos: [],
      distritoSelected: "",
      distritoName: "",
      costoDistrito: 0.0,
      loading: false
    }        
  }

  handleProvinciaChange=(value)=>{
    const distritos_data = this.state.data.slice().filter((distrito) => distrito.provincia  == value.value);
    this.setState({distritos: distritos_data, distritoSelected: "", costoDistrito: 0.0});
  }

  handleChange=(val)=>{
    this.setState({costoDistrito: val.costo, distritoSelected: val.value, distritoName: val.label});
  }

  handleClick=()=>{
    if(this.state.costoDistrito>0){
    this.props.history.push({
        pathname: "/asistencia-vehicular",
        asistenciaPrecio: this.state.costoDistrito,
        asistenciaDistrito: this.state.distritoName,
        codDistrito: this.state.distritoSelected
      });
    }
  }

  loadData = () => {
    fetch(`https://rest-api-auxcar.cloudno.de/api/distrito`)
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        this.setState({data: data, loading: false});
    })
    .catch(e=>{
        console.clear();
        this.setState({loading: true});
        setTimeout(()=>this.loadData, 7000);
    });
  }

  componentWillMount(){
    this.loadData();
  }
  
  render() {
    const provincias = [
        { value: '1', label: 'Ferreñafe' },
        { value: '2', label: 'Lambayeque' },
        { value: '3', label: 'Chiclayo' }
      ]
      
    return (
        <>
        <Backdrop open={this.state.loading} style={{"position": "fixed", "zIndex": 5}}>
            <CircularProgress color="inherit" />
        </Backdrop>
          <Row className="align-items-center animate__animated animate__fadeIn">
            <Col className="order-md-2 " md="6">
              <img
                alt="..."
                className="img-fluid floating"
                src={require("assets/img/theme/location.png")}
              />
            </Col>
            <Col className="order-md-1 " md="6">
              <div className="pr-md-5">
                <div>
                <h3 className="display-3 text-white mb-0">Auxcar</h3>
                <div>
                  <div className="icon icon-sm icon-shape">
                    <i className="ni ni-settings text-white" />
                  </div>
                  <div className="icon icon-sm icon-shape">
                    <i className="ni ni-delivery-fast text-white" />
                  </div>
                  <div className="icon icon-sm icon-shape">
                    <i className="ni ni-compass-04 text-white" />
                  </div>
                  <div className="icon icon-sm icon-shape">
                    <i className="ni ni-bus-front-12 text-white" />
                  </div>
                  <div className="icon icon-sm icon-shape">
                    <i className="ni ni-square-pin text-white" />
                  </div>
                </div>
                <p className="text-white">
                ¿Dónde te encuentras?
                </p>
                </div>
                <form action="" className="">
                <div className="mt-5">
                    <Select options={provincias}
                      onChange={this.handleProvinciaChange}
                      label="Single select"
                      placeholder="Provincia"
                      onFocus={e => this.setState({ searchAltFocused: true })}
                      onBlur={e => this.setState({ searchAltFocused: false })}
                      theme={theme => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#1aae6fc7',
                        },
                      })}
                      />
                  
                </div>
                <div className="mt-3" >
                  <Select options={this.state.distritos}
                    onChange={this.handleChange}
                    placeholder="Distrito"
                    onFocus={e => this.setState({ searchAltFocused: true })}
                    onBlur={e => this.setState({ searchAltFocused: false })}
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#1aae6fc7',
                      },
                    })}
                    />
                </div>
                <div className="mt-4">
                <Button
                      outline  type="button"
                      color="success"
                      onClick={this.handleClick}
                    >
                      <span className="btn-inner--text">
                        Seguir
                      </span>
                    </Button>
                    
                </div>
                </form>
              </div>
            </Col>
          </Row>
        </>
      );
  }
}

export default Ubicacion;