import React from 'react'

import {
    Card,
    Modal,
    Button,
    FormGroup
} from 'reactstrap'

import {
    Backdrop,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Icon,
    IconButton,
    TextField,
    InputAdornment
} from '@material-ui/core';

import NumberFormat from 'react-number-format';
function ModalEdit(props){
    
    return(
        <Modal
            className="modal-dialog-centered"
            isOpen={props.modalEdit}
            toggle={props.toggleModal}
            size="sm"
        >
            <div className="modal-header">
            <h4 className="modal-title" id="modal-title-default">
                Editar falla vehicular
            </h4>
            <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={props.toggleModal}
            >
                <span aria-hidden={true}>×</span>
            </button>
            </div>
            <div className="modal-body">
                <FormGroup>
                    <TextField defaultValue={props.fallaSeleccionada.descripcion} onChange={props.handleChange} fullWidth id="txtDescripcion" multiline label="Nombre" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                    <TextField defaultValue={props.fallaSeleccionada.causa} onChange={props.handleChange} fullWidth id="txtCausa" multiline label="Causa" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                    <TextField value={props.fallaSeleccionada.sistema} fullWidth disabled id="txtSistema" multiline label="Sistema" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                <NumberFormat InputProps={{
                        startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                      }}
                       onChange={props.handleChange}
                        fullWidth
                        defaultValue={props.fallaSeleccionada.costo}
                        id="txtCosto"
                        customInput={TextField} label="Costo" />
                </FormGroup>
            </div>
            <div className="modal-footer">
                <div className="col-sm text-center">
                    <Button onClick={()=>props.updateFalla(props.fallaSeleccionada.idFalla)} className="text-center" color="success" type="button">
                        Guardar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default class FallasVehiculares extends React.Component{
    constructor(){
        super();
        this.state={
            fallasVehiculares: [],
            falla_seleccionada: null,
            loading: false,
            page: 0,
            rowsPerPage: 10,
            modalEdit: false,
            descripcion: "",
            causa: "",
            costo: 0,
        }
    }

    loadData = () => {
        fetch(`https://rest-api-auxcar.cloudno.de/api/fallas-vehiculares`)
        .then(response=>{
            return response.json();
        })
        .then(data=>{
            this.setState({fallasVehiculares: data, loading: false});
        })
        .catch(e=>{
            console.clear();
            this.setState({loading: true});
            setTimeout(()=>this.loadData, 7000);
        });
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: +event.target.value,page: 0});
    };

    handleClickRow = (e,n) => {
        let falla = this.state.fallasVehiculares.slice().find(f=>f.idFalla==n);
        this.setState({falla_seleccionada: falla, descripcion: falla.descripcion, causa: falla.causa, costo:falla.costo}); 
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState({
            modalEdit: !this.state.modalEdit
        });
    };
    
    handleChange = (e) => {
        switch (e.target.id) {
            case "txtDescripcion":
            this.setState({descripcion: e.target.value});
            break;
            case "txtCausa":
            this.setState({causa: e.target.value});
            break;
            case "txtCosto":
            this.setState({costo: e.target.value});
            break;
        }
    };

    updateFalla = (_id) =>{
        fetch(`https://rest-api-auxcar.cloudno.de/api/fallas-vehiculares/edit`,{
            method: 'POST',
            body: `{
                "_id": ${_id},
                "descripcion": "${this.state.descripcion}",
                "causa": "${this.state.causa}",
                "costo": ${this.state.costo}
            }`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response=>{
            return response.json();
        })
        .then(JSONresponse=>{
            if(JSONresponse.status==200){
                this.setState({loading: false});
                this.toggleModal();
                this.loadData();
            }
        })
        .catch((e)=>{
            console.clear();
            this.setState({loading: true});
            setTimeout(()=>this.updateFalla(_id),7000);
        });
    }

    componentWillMount(){
        this.loadData();
    }

    render(){
        return(<>
            <Backdrop open={this.state.loading} style={{"position": "fixed", "zIndex": 5}}>
                <CircularProgress color="inherit" />
            </Backdrop>
        <div className="row py-3 align-items-center text-white  animate__animated animate__fadeInDown animate__fast">
            <div className="col">
            <h1 className="display-4 mb-0 text-white">FALLAS VEHICULARES</h1>
            </div>
        </div>
        <Card className="animate__animated animate__fadeInDown animate__fast">
            <TableContainer>
                <Table stickyHeader className="table-responsive">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                        <strong>Nombre</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Causa</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Sistema</strong>
                        </TableCell>
                        <TableCell style={{ minWidth: 80 }}>
                        <strong>Costo</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Editar</strong>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        this.state.fallasVehiculares.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((falla, i)=>{
                            return(
                                <TableRow  key={i+"_tr"} tabIndex={-1}>
                                    <TableCell>
                                        {falla.descripcion}
                                    </TableCell>
                                    <TableCell>
                                        {falla.causa}
                                    </TableCell>
                                    <TableCell>
                                        {falla.sistema}
                                    </TableCell>
                                    <TableCell>
                                        S/. {falla.costo}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => this.handleClickRow(event, falla.idFalla)} fontSize="small" aria-label="modificar" color="primary" component="span">
                                            <Icon className="fa fa-pencil-square-o" fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>          
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
            component="div"
            labelRowsPerPage="Mostrar:"
            count={this.state.fallasVehiculares.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        </Card>
        {
            this.state.falla_seleccionada ? 
            <ModalEdit fallaSeleccionada={this.state.falla_seleccionada} updateFalla={this.updateFalla} handleChange={this.handleChange} modalEdit={this.state.modalEdit} toggleModal={this.toggleModal}/>
            : ""
        }
            
        </>);
    }
}