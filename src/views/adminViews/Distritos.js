import React from 'react'

import {
    Card,
    Modal,
    Button,
    FormGroup,
    Badge
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
    InputAdornment,
    MenuItem
} from '@material-ui/core';

import NumberFormat from 'react-number-format';
function ModalEdit(props){
    var provincia = "";
    switch (parseInt(props.distritoSeleccionado.provincia)) {
        case 1:
            provincia = "Ferreñafe"
            break;
        case 2:
            provincia = "Lambayeque"
            break;
        case 3:
            provincia = "Chiclayo"
            break;
    }
    return(
        <Modal
            className="modal-dialog-centered"
            isOpen={props.modalEdit}
            toggle={props.toggleModal}
            size="sm"
        >
            <div className="modal-header">
            <h4 className="modal-title" id="modal-title-default">
                Editar distrito
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
                    <TextField value={provincia} disabled fullWidth id="txtProvincia" label="Provincia" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                    <TextField value={props.distritoSeleccionado.label} disabled fullWidth id="txtDistrito" multiline label="Distrito" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                <NumberFormat InputProps={{
                        startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                      }}
                       onChange={props.handleChange}
                        fullWidth
                        defaultValue={props.distritoSeleccionado.costo}
                        id="txtCosto"
                        customInput={TextField} label="Costo" />
                </FormGroup>
                <FormGroup>
                    <TextField
                        defaultValue={props.distritoSeleccionado.estado}
                        select
                        label="Estado"
                        autoComplete="off"
                        onChange={props.handleChange}
                        fullWidth
                        id="txtEstado"
                        >
                        <MenuItem value="1">
                        Habilitado
                        </MenuItem>
                        <MenuItem value="0">
                        Desabilitado
                        </MenuItem>
                        </TextField>
                </FormGroup>
            </div>
            <div className="modal-footer">
                <div className="col-sm text-center">
                    <Button onClick={()=>props.updateDistrito(props.distritoSeleccionado.value)} className="text-center" color="success" type="button">
                        Guardar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default class Distritos extends React.Component{
    constructor(){
        super();
        this.state={
            distritos: [],
            distrito_seleccionado: null,
            loading: false,
            page: 0,
            rowsPerPage: 10,
            modalEdit: false,
            costo: 0,
            estado: null
        }
    }

    loadData = () => {
        fetch(`https://rest-api-auxcar.cloudno.de/api/distrito/all`)
        .then(response=>{
            return response.json();
        })
        .then(data=>{
            this.setState({distritos: data, loading: false});
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
        let distrito = this.state.distritos.slice().find(d=>d.value==n);
        this.setState({distrito_seleccionado: distrito, costo:distrito.costo, estado:distrito.estado}); 
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState({
            modalEdit: !this.state.modalEdit
        });
    };
    
    handleChange = (e) => {
        switch (e.target.id) {
            case "txtCosto":
            this.setState({costo: e.target.value});
            break;
            default:
            this.setState({estado: e.target.value});
            break;
        }
    };

    updateDistrito = (_id) =>{
        console.log(_id);
        console.log(this.state.costo);
        fetch(`https://rest-api-auxcar.cloudno.de/api/distrito/edit`,{
            method: 'POST',
            body: `{
                "_id": ${_id},
                "costo": ${this.state.costo},
                "estado": ${this.state.estado}
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
            setTimeout(()=>this.updateDistrito(_id),7000);
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
            <h1 className="display-4 mb-0 text-white">DISTRITOS</h1>
            </div>
        </div>
        <Card className="animate__animated animate__fadeInDown animate__fast">
            <TableContainer>
                <Table stickyHeader className="table-responsive">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                        <strong>Provincia</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Distrito</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Costo</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Estado</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Editar</strong>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        this.state.distritos.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((distrito, i)=>{
                            var provincia = "";
                            switch (parseInt(distrito.provincia)) {
                                case 1:
                                    provincia = "Ferreñafe"
                                    break;
                                case 2:
                                    provincia = "Lambayeque"
                                    break;
                                case 3:
                                    provincia = "Chiclayo"
                                    break;
                            }
                            return(
                                
                                <TableRow  key={i+"_tr"} tabIndex={-1}>
                                    <TableCell>
                                        {provincia}
                                    </TableCell>
                                    <TableCell>
                                        {distrito.label}
                                    </TableCell>
                                    <TableCell>
                                        S/. {distrito.costo}
                                    </TableCell>
                                    <TableCell>
                                    <Badge className="text-uppercase" color={distrito.estado == 1 ? "success" : "danger"} pill>
                                        {distrito.estado == 1 ? "Habilitado" : "Desabilitado"}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => this.handleClickRow(event, distrito.value)} fontSize="small" aria-label="modificar" color="primary" component="span">
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
            count={this.state.distritos.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        </Card>
        {
            this.state.distrito_seleccionado ? 
            <ModalEdit distritoSeleccionado={this.state.distrito_seleccionado} updateDistrito={this.updateDistrito} handleChange={this.handleChange} modalEdit={this.state.modalEdit} toggleModal={this.toggleModal}/>
            : ""
        }
            
        </>);
    }
}