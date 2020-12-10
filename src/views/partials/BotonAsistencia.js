import React from "react";
import {Link} from 'react-router-dom';
// reactstrap components
import {
    Button
} from "reactstrap";


function ReloadButton(props){
  return (
      <Button
          className="text-white"
          color="link"
          type="button"
          onClick={props.formatearData}
          >
          Volver a diagnosticar
      </Button>
  );
}

function ReportButton(props){
    return (
        <Button
            className="text-white"
            color="link"
            type="button"
            
            to={
              {
                pathname: "/reporte-diagnostico",
                fallas_identificadas: props.fallas_identificadas,
                asistenciaPrecio: props.asistenciaPrecio,
                asistenciaDistrito: props.asistenciaDistrito,
                codDistrito: props.codDistrito
              }
            }
            tag={Link}
            >
            Ir al reporte
        </Button>
      );
}

class BotonAsistencia extends React.Component {
    
  render() {
    if(this.props.tipo === 0) {
        return(<ReloadButton formatearData={this.props.formatearData}/>);
    }else{
        return(<ReportButton 
          fallas_identificadas={this.props.fallas_identificadas} 
          asistenciaDistrito={this.props.asistenciaDistrito} 
          asistenciaPrecio={this.props.asistenciaPrecio}
          codDistrito={this.props.codDistrito}/>);
    }
  }
}

export default BotonAsistencia;