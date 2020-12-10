import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Row,
  Col,
  UncontrolledAlert
} from "reactstrap";

import {TextField,InputAdornment,IconButton} from '@material-ui/core';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class InicioSesion extends React.Component {
    constructor(){
        super();
        this.state={
            user: null,
            password: null,
            showPassword: false,
            recordar: false,
            error: false
        };
    }

    handleChange = (e) => {
        switch (e.target.id) {
            case "txtUser":
            this.setState({user: e.target.value});
            break;
            case "txtPass":
            this.setState({password: e.target.value});
            break;
        }
    };

    handleClickShowPassword = () => {
        this.setState({showPassword: !this.state.showPassword});
    }

    handleChecked=(e)=>{
        this.setState({recordar: e.target.checked});
    }

    handleSubmit = () => {
        if(this.state.password && this.state.user){
          this.props.loginF(this.state.user, this.state.password, this.state.recordar);
        }
    }

    alertState=(e)=>{
        if(e && e.target.textContent == "×"){
            this.setState({error: false});
        }
    }

    handleKeyPressed=(e)=>{
        if(e.keyCode == 13){
            this.handleSubmit();
         }
    }
    

  render() {
    var animacion = this.props.sesion ? "shadow shadow-lg--hover animate__animated animate__fadeOutUp animate__fast" : "shadow shadow-lg--hover animate__animated animate__fadeInDown";
    return (
      <>
      <Backdrop open={this.props.loading} style={{"position": "fixed", "zIndex": 5}}>
          <CircularProgress color="inherit" />
      </Backdrop>
      <Row className="justify-content-center mt-5">
        <Col lg="5">
        <UncontrolledAlert color="danger" onClick={this.alertState} fade={true} isOpen={this.props.error ? this.props.error : this.state.error} className="animate__animated animate__slideInDown">
          <span className="alert-inner--icon">
            <i className="ni ni-bell-55" />
          </span>
          <span className="alert-inner--text ml-1">
            <strong>Alerta! </strong> Credenciales incorrectas.
          </span>
        </UncontrolledAlert>
          <Card className={animacion}>
            <CardHeader className="bg-white">
              <div className="display-3 text-center">
                Iniciar Sesión
              </div>
            </CardHeader>
            <CardBody className="">
              <Form role="form">
                <FormGroup>
                    <TextField onChange={this.handleChange} fullWidth id="txtUser" label="Usuario" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                <TextField onKeyDown={this.handleKeyPressed} onChange={this.handleChange} fullWidth InputProps={{
                      endAdornment: <InputAdornment position="end">
                        <IconButton
                        onClick={this.handleClickShowPassword}
                        aria-label="toggle password visibility" component="span"
                        >
                        <i className={this.state.showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                        </IconButton>
                      </InputAdornment>,
                    }}
                        id="txtPass" 
                        type={this.state.showPassword ? "text" : "password"}
                        autoComplete="off" label="Contraseña"/>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox mt-4">
                    <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                    onClick={this.handleChecked}
                    />
                    <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                    >
                    <span>Recuérdame</span>
                    </label>
                </div>
                <div className="text-center">
                  <Button
                    className="my-2"
                    color="primary"
                    type="button"
                    onClick={this.handleSubmit}
                  >
                    Iniciar
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    
      </>
    );
  }
}

export default InicioSesion;
