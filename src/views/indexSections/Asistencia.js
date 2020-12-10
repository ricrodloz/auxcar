import React from "react";

// reactstrap components
import {
Row
} from "reactstrap";

// core components
import Encuesta from "../partials/Encuesta.js";
import ResultadoEncuesta from "../partials/ResultadoEncuesta.js";
import datos from '../../data/datos.json';

class Asistencia extends React.Component {
    constructor(){
        super();
        this.state = {
            preguntas:[],
            categorias: [],
            seleccionados: [0],
            identificados: [],
            rbValor: true,
            animar: false,
            historial: [{
                preguntas:[],
                seleccionados: [0],
                identificados: [],
                rbValor: true
            }]
        }
    }

    formatearData=async()=>{
        await this.setState({
            preguntas:[],
            categorias: [],
            seleccionados: [0],
            identificados: [],
            rbValor: true,
            animar: false,
            historial: [{
                preguntas:[],
                seleccionados: [0],
                identificados: [],
                rbValor: true
            }]
        });
        this.cargarPreguntas();
    }

    cargarPreguntas=()=>{
        var seleccionados = this.state.seleccionados.slice();
        var identificados = this.state.identificados.slice();
        var preguntas_mostrar= seleccionados[0]!=0 ? this.state.preguntas.slice().filter(p=>p.id!=seleccionados[0] && p.predecesor!=0) : [];
        let preguntas_hijas = [];

        seleccionados.map(seleccionado=>{
            let respuesta = datos.filter(pregunta=>
                pregunta.predecesor==seleccionado && this.state.rbValor
            );
            preguntas_hijas = preguntas_hijas.concat(respuesta);

            if(respuesta.length==0 ){
                let pregunta = datos.find(pregunta=>pregunta.id==seleccionado);
                if(this.state.rbValor && pregunta.valor_si!=undefined) identificados.push(pregunta.valor_si);
                if(!this.state.rbValor && pregunta.valor_no) identificados.push(pregunta.valor_no);
            }
        });
        preguntas_mostrar = preguntas_hijas.concat(preguntas_mostrar);
        
        if(preguntas_mostrar.length==0){
            this.setState({animar:true});
            window.scrollTo(0, 0);
            setTimeout(()=>{
                this.setState({identificados: identificados, preguntas: preguntas_mostrar, seleccionados: []});
            }, 500);
        }else{
            this.setState({identificados: identificados, preguntas: preguntas_mostrar, seleccionados: []});
        }
    }

    handleChecked=(e)=>{
        var seleccionados = this.state.seleccionados.slice();
        if(e.target.checked){
            seleccionados.push(parseInt(e.target.value))
        }else{
            seleccionados=seleccionados.filter(val=>val!=e.target.value);
        }
        this.setState({seleccionados: seleccionados.sort(), categorias: seleccionados.sort()});
    }

    handleRadioButton=(e)=>{
        var seleccionados = [parseInt(e.target.name)];
        var rbValor = false;
        if(e.target.value=="si"){
            rbValor = true;
        }else{
            rbValor=false;
        }
        this.setState({seleccionados: seleccionados, rbValor: rbValor});
    }

    handleNext=()=>{
        if(this.state.seleccionados.length>0){          
            let historial = this.state.historial.slice();
            historial.push(this.getEstadoApp());
            this.setState({historial: historial});
            this.cargarPreguntas();
        }
    }
    
    getEstadoApp=()=>{
        var estadoapp = {
            preguntas: this.state.preguntas.slice(),
            seleccionados: this.state.seleccionados.slice(),
            identificados: this.state.identificados.slice(),
            categorias: this.state.categorias.slice(),
            rbValor: this.state.rbValor
        };
        return estadoapp;
    }

    handleBack=()=>{
        var historial = this.state.historial.slice();
        this.setState({
            preguntas:historial[historial.length-1].preguntas,
            seleccionados:historial[historial.length-1].seleccionados,
            identificados:historial[historial.length-1].identificados,
            rbValor:historial[historial.length-1].rbValor,
            categorias: historial[historial.length-1].categorias,
            historial: historial.slice(0,historial.length-1)
        });
    }

    comprobarIndeterminadas=()=>{
        let valores_cat = [
            {cat:1,min:1,max:12},
            {cat:2,min:13,max:17},
            {cat:3,min:18,max:35},
            {cat:4,min:36,max:38}
        ];
        let identificados = this.state.identificados.slice();
        if(identificados.length>0){
            let coincide = [];
            let nuevos = [];
            valores_cat = valores_cat.filter(vc=>this.state.categorias.includes(vc.cat));
            valores_cat.map(vc=>{
                coincide = identificados.filter(i=>i>=vc.min && i<=vc.max);
                if(coincide.length==0) nuevos.push(999);
            });
            identificados = identificados.concat(nuevos);
        }
        this.setState({animar:true});
        window.scrollTo(0, 0);
        setTimeout(()=>{
            this.setState({identificados: [...new Set(identificados)], preguntas: [], seleccionados: []});
        }, 500);
    }

    componentDidMount() {
        if(this.props.location.asistenciaPrecio!=undefined){
            window.scrollTo(0, 0);
            this.cargarPreguntas();
        }else{
            this.props.history.push('/');
        }
    }

  render() {
    return (
      <>
        <Row className="align-items-center justify-content-center mt-5">
        {
            this.state.preguntas.length > 0 ? 
            <Encuesta rbValor={this.state.rbValor} terminar={this.comprobarIndeterminadas} seleccionados={this.state.seleccionados} estado={this.state.identificados.length} animar={this.state.animar} handleBack={this.handleBack} handleNext={this.handleNext} preguntas={this.state.preguntas} onCheckbox={this.handleChecked} onRadioButton={this.handleRadioButton}  />
            :
            <ResultadoEncuesta 
                formatearData={this.formatearData}
                estado={this.state.identificados.length}
                fallas_identificadas={this.state.identificados}
                asistenciaPrecio={this.props.location.asistenciaPrecio}
                asistenciaDistrito={this.props.location.asistenciaDistrito}
                codDistrito={this.props.location.codDistrito}
            />
        }
        </Row>
      </>
    );
  }
}

export default Asistencia;
