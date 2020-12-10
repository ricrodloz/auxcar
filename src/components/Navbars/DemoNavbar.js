import React from "react";
import { Link  } from "react-router-dom";
import Headroom from "headroom.js";
// JavaScript plugin that hides or shows a component based on your scroll

import {
  Navbar,
  NavbarBrand,
  Container,
} from "reactstrap";

import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core';

function Mantenimientos(props){
  return (<>
    <ListSubheader component="div" id="nested-list-subheader">
      Mantenimientos
    </ListSubheader>
    <ListItem button onClick={props.handleDrawerOpen} component={Link} to='/usuarios'>
      <ListItemIcon  style={{"minWidth": 40}}><i className="fa fa-users"></i></ListItemIcon>
      <ListItemText  primary="Usuarios" />
    </ListItem>
    <ListItem button onClick={props.handleDrawerOpen} component={Link} to='/fallas-vehiculares'>
      <ListItemIcon style={{"minWidth": 40}}><i className="fa fa-list-alt"></i></ListItemIcon>
      <ListItemText primary="Fallas vehiculares" />
    </ListItem>
    <ListItem button onClick={props.handleDrawerOpen} component={Link} to='/distritos'>
      <ListItemIcon style={{"minWidth": 40}}><i className="fa fa-location-arrow"></i></ListItemIcon>
      <ListItemText primary="Distritos" />
    </ListItem>
  </>);
}

class DemoNavbar extends React.Component {
  constructor(){
    super();
    this.state={
      open: false,
      collapseClasses: "",
      collapseOpen: false
    }
  }

  handleDrawerOpen = () => {
    this.setState({open: !this.state.open});
  };

  logOut = () => {
    this.handleDrawerOpen();
    this.props.logOut();
  }

  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }
  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out"
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: ""
    });
  };

  render() {

    return (
      <>
        <header className="header-global ">
          <Navbar
            className="position-fixed navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
            style={{"zIndex": 1}}
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                <img
                  alt="..."
                  src={require("assets/img/brand/logo-white.png")}
                />
              </NavbarBrand>
              {
                this.props.username ? 
                <IconButton onClick={this.handleDrawerOpen} edge="end" color="inherit" aria-label="menu" component="span">
                  <span className="navbar-toggler-icon" />
                </IconButton>
                :
                <IconButton edge="end" color="inherit" aria-label="iniciar_sesion" component="span">
                  <Link to="/inicio-sesion">
                  <span className="nav-link-inner--text text-white">
                    <i className="fa fa-sign-in fa-lg"></i>
                  </span>
                  </Link>
                </IconButton>
              }                  
              </Container>
          </Navbar>
        </header>
      <Drawer
        variant="temporary"
        anchor="right"
        open={this.state.open}
        onClose={this.handleDrawerOpen}
        
        style={{"position": "relative"}}
      >
        <br />
        <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
        <ListItem>
          <ListItemText primary="Bienvenido," secondary={this.props.username} />
        </ListItem>
        <br />
        <Divider />
        <List>
          <ListSubheader component="div" id="nested-list-subheader">
            Atender
          </ListSubheader>
        <ListItem button onClick={this.handleDrawerOpen} component={Link} to='/'>
          <ListItemIcon  style={{"minWidth": 40}}><i className="fa fa-bell"></i></ListItemIcon>
          <ListItemText primary="Solicitudes de auxilio" />
        </ListItem>
        {
          this.props.rol && this.props.rol.toLowerCase()=="administrador" ?  
          <Mantenimientos handleDrawerOpen={this.handleDrawerOpen} />
          :
          ""      
        }
        </List>
        <List style={{
          "position": "absolute",
          "bottom": "10px"}}>
          <ListItem button onClick={this.logOut}>
            <ListItemIcon style={{"minWidth": 40}}><i className="fa fa-sign-out fa-lg"></i></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
        </div>
        
        
      </Drawer>
      </>
    );
  }
}

export default DemoNavbar;