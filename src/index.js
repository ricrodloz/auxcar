import React from "react";
import {render} from "react-dom";
import { Route, Switch, Redirect, HashRouter  } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "animate.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Inicio from "views/indexSections/Inicio.js";
import Asistencia from "views/indexSections/Asistencia.js";
import Ubicacion from "views/indexSections/Ubicacion.js";
import Reporte from "views/indexSections/Reporte.js";
import Auxilio from "views/indexSections/Auxilio.js";
import InicioSesion from 'views/indexSections/InicioSesion.js'
import SolicitudesAuxilio from 'views/adminViews/SolicitudesAuxilio.js'
import AdminUsuarios from 'views/adminViews/AdminUsuarios.js'
import FallasVehiculares from 'views/adminViews/FallasVehiculares.js'
import Distritos from 'views/adminViews/Distritos.js'

import {  
  Container
} from "reactstrap";

import DemoNavbar from "components/Navbars/DemoNavbar.js";

//<Redirect to="/" />
class App extends React.Component{
  constructor(){
    super();
    this.state={
      sesionId: null,
      username: null,
      loading: false,
      sesion: false,
      error: false,
      userRol: null
    }
  }
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  logOut=()=>{
    localStorage.removeItem("auxcar_auth_user"); 
    localStorage.removeItem("auxcar_auth_sesionId"); 
    this.setState({username: null, sesion:false,sesionId:null,userrRol:null});
  }

  logIn=(user,password,recordar)=>{
    this.authentication(user,password,recordar);
  }

  authentication = (user,password,recordar) => {
    fetch(`https://rest-api-auxcar.cloudno.de/api/auth`,{
          method: 'POST',
          body: `{
              "user": "${user}",
              "pass": "${password}"
          }`,
          headers:{
          'Content-Type': 'application/json'
          }   
      }).then((response)=>{
          return response.json();
      }).then((JSON)=>{
          let usuario = JSON.data[0];
          if(usuario!=undefined){
              this.setState({sesion: true, error: false});
              if(recordar){localStorage.setItem("auxcar_auth_user",usuario.nombre);
                          localStorage.setItem("auxcar_auth_sesionId",usuario.idUsuario);
                          localStorage.setItem("auxcar_auth_userRol",usuario.rol);}
              setTimeout(()=>this.setState({loading:false, username: usuario.nombre,sesionId: usuario.idUsuario, userRol:usuario.rol}),500);
          }else{
            this.setState({error: true});
          }
      }).catch(()=>{
          console.clear();
          this.setState({loading: true});
          setTimeout(()=>this.authentication(user,password),7000);
      });
  }

  componentWillMount(){
    let user_ls = localStorage.getItem("auxcar_auth_user");
    let sesionId = localStorage.getItem("auxcar_auth_sesionId");
    let userRol = localStorage.getItem("auxcar_auth_userRol");
    if(user_ls){
      this.setState({username: user_ls,sesionId:sesionId,userRol:userRol});
    }
  }

  render(){
    return(
      <HashRouter hashType="noslash" >
        <DemoNavbar username={this.state.username} rol={this.state.userRol} logOut={this.logOut}/>
        <main ref="main" >
          <div className="position-relative"  >
          <div className="shape shape-style-1 bg-default position-fixed" style={{"zIndex": -1}}>
            <img
              alt="..."
              className="img-center "
              src={require("assets/img/brand/background-index.jpeg")}
              style={{"opacity": 0.3}}
            />
          </div>
            <section className="section section-lg section-shaped position-relative" >
              <Container className="align-items-center">
                {
                  this.state.username ? 
                  <AdminAccesos userRol={this.state.userRol.toLowerCase()} userLog={this.state.sesionId}/>   
                  :
                  <Switch>
                    <Route path="/" exact render={props => <Inicio {...props} />} />

                    <Route
                      path="/inicio"
                      exact
                      render={props => <Inicio {...props} />}
                    />

                    <Route
                      path="/ubicacion"
                      exact
                      render={props => <Ubicacion {...props} />}
                    />

                    <Route
                      path="/asistencia-vehicular"
                      exact
                      render={props => <Asistencia {...props} />}
                    />

                    <Route
                      path="/reporte-diagnostico"
                      exact
                      render={props => <Reporte {...props} />}
                    />

                    <Route
                      path="/solicitud-auxilio"
                      exact
                      render={props => <Auxilio {...props} />}
                    />

                    <Route
                      path="/inicio-sesion"
                      exact
                      
                      render={props => <InicioSesion error={this.state.error} sesion={this.state.sesion} logOut={this.logOut} loading={this.state.loading}
                      loginF={this.logIn} {...props} />}
                    />

                    <Redirect to="/" />

                  </Switch>  
                }
              </Container>
            </section>
          </div>
        </main>
      </HashRouter>
    );
  }
}

function AdminAccesos(params){
  if(params.userRol=="administrador"){
    return(<Switch>
        <Route 
          path="/"
          exact
          render={props => <SolicitudesAuxilio {...props} />}
          />

        <Route 
          path="/usuarios"
          exact
          render={props => <AdminUsuarios userLog={params.userLog} {...props} />}
          />
          
        <Route 
          path="/fallas-vehiculares"
          exact
          render={props => <FallasVehiculares {...props} />}
          />
          
        <Route 
          path="/distritos"
          exact
          render={props => <Distritos {...props} />}
          />
                  
        <Redirect to="/" />
      </Switch>)
  }else{
    return(<Switch>
      <Route 
        path="/"
        exact
        render={props => <SolicitudesAuxilio {...props} />}
        />
        
      <Redirect to="/" />
    </Switch>)
  }
  
}

render(<App />, document.getElementById("root"));