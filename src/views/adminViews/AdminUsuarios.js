import React, { useState, useEffect } from 'react'

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
    InputAdornment,
    Fab,
    MenuItem
} from '@material-ui/core';

function AlertConfirmacion(props){
    return(<>
        <Modal 
            isOpen={props.modalConfirmation}
            toggle={props.toggleModal} className="modal-dialog-centered modal-primary"
              size="sm"
              contentClassName="bg-primary">
        <div className="modal-body text-white">
            <div className="py-3 text-center">
                    <i className="fa fa-exclamation-triangle fa-3x" />
                    <p className="heading mt-5">{
                        props.userLog != props.deleteId ?
                        "¿Seguro de eliminar?":
                        "No puede eliminar su usuario"
                    } </p>  
            </div>
        </div>
        <div className="modal-footer">
            <div className="col text-center">
            <Button
                className={props.userLog != props.deleteId ? "text-white float-left" : "text-white text-center"}
                color="link"
                type="button"
                onClick={props.toggleModal}
                >
                Cerrar
            </Button>
            {
                props.userLog != props.deleteId ?
                <Button
                className="text-white float-right"
                color="link"
                type="button"
                onClick={props.deleteUser}
                >
                Eliminar
                </Button>:
                ""
            }
            
            </div>
        </div>
        </Modal>
    </>);
}

function ModalAddEdit(props){
    const [showPassword, setShowPassword] = useState(true);
    const handleShowPassword = () => {
        setShowPassword(state => !state );
    }
    useEffect(()=>setShowPassword(state => !state ),[]);
    return(
        <Modal
            className="modal-dialog-centered"
            isOpen={props.modalAddEdit}
            toggle={props.toggleModal}
            size="sm"
        >
            <div className="modal-header">
            <h4 className="modal-title" id="modal-title-default">
                {
                    props.usuarioSeleccionado != undefined ?
                    "Editar usuario" :
                    "Nuevo usuario" 
                }
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
            <form>
                <FormGroup>
                    <TextField defaultValue={
                        props.usuarioSeleccionado != undefined ?
                        props.usuarioSeleccionado.user :
                        ""
                    }
                    onChange={props.handleChange} fullWidth id="txtUser" label="Usuario" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                <TextField onChange={props.handleChange} fullWidth InputProps={{
                      endAdornment: <InputAdornment position="end">
                        <IconButton
                        onClick={handleShowPassword} component="span">
                        <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                        </IconButton>
                      </InputAdornment>,
                    }}
                        id="txtClave" 
                        type={showPassword ? "text" : "password"}
                        autoComplete="off" label="Nueva clave"/>
                </FormGroup>
                <FormGroup>
                    <TextField onChange={props.handleChange} defaultValue={
                        props.usuarioSeleccionado != undefined ?
                        props.usuarioSeleccionado.nombre :
                        ""
                    } fullWidth id="txtNombre" label="Nombre" autoComplete="off"/>
                </FormGroup>
                <FormGroup>
                    <TextField
                        defaultValue={
                            props.usuarioSeleccionado != undefined ?
                            props.usuarioSeleccionado.rol :
                            "Administrador"
                        }
                        select
                        label="Rol"
                        autoComplete="off"
                        onChange={props.handleChange}
                        fullWidth
                        id="txtRol"
                        >
                        <MenuItem value="Administrador">
                        Administrador
                        </MenuItem>
                        <MenuItem value="Usuario">
                        Usuario
                        </MenuItem>
                        </TextField>
                </FormGroup>
            </form>
            </div>
            <div className="modal-footer">
                <div className="col-sm text-center">
                    <Button onClick={
                        props.usuarioSeleccionado != undefined ? 
                        ()=>props.updateUser(props.usuarioSeleccionado.idUsuario) : 
                        ()=>props.addUser()
                    } className="text-center" color="success" type="button">
                        Guardar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default class AdminUsuarios extends React.Component{
    constructor(){
        super();
        this.state={
            usuarios: [],
            usuario_seleccionado: null,
            loading: false,
            page: 0,
            rowsPerPage: 10,
            action: "add",
            user:"",
            userRol: null, 
            newClave:"", 
            nombre:"", 
            rol:"Administrador",
            deleteId: null
        }
    }

    loadData = () => {
        fetch(`https://rest-api-auxcar.cloudno.de/api/usuario`,{method: 'POST'})
        .then(response=>{
            return response.json();
        })
        .then(data=>{
            this.setState({usuarios: data, loading: false,userRol: data.find(d=>d.idUsuario==this.props.userLog).rol});

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

    handleAddEdit = (e,n) => {
        if(n){
            let usuario = this.state.usuarios.slice().find(u=>u.idUsuario==n);
            this.setState({action: "edit",usuario_seleccionado: usuario, user: usuario.user, newClave:"",nombre:usuario.nombre, rol:usuario.rol}); 
        }else{
            this.setState({usuario_seleccionado: null, action: "add", newClave:"",user:"", nombre:"", rol:""});
        }
        this.toggleModal("modalAddEdit");
    }

    handleDelete = (e,n) => {
        this.setState({deleteId: n});
        this.toggleModal("modalConfirmation");
    } 

    toggleModal = state => {
        this.setState({
            [state]: !this.state[state]
        });
    };
    
    handleChange = (e) => {
        console.log(e.target.id);
        console.log(e.target.value);
        switch (e.target.id) {
            case "txtUser":
            this.setState({user: e.target.value});
            break;
            case "txtClave":
            this.setState({newClave: e.target.value});
            break;
            case "txtNombre":
            this.setState({nombre: e.target.value});
            break;
            default:
            this.setState({rol: e.target.value});
            break;
        }
    };

    updateUser = (_id) =>{
        let body = `{
            "_id": ${_id},
            "user": "${this.state.user}",
            "nombre": "${this.state.nombre}",
            "rol": "${this.state.rol}"
        }`;

        if(this.state.newClave){
            body = `{
                "_id": ${_id},
                "user": "${this.state.user}",
                "clave": "${this.state.newClave}",
                "nombre": "${this.state.nombre}",
                "rol": "${this.state.rol}"
            }`;
        }

        fetch(`https://rest-api-auxcar.cloudno.de/api/usuario/edit`,{
            method: 'POST',
            body: body,
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
                this.toggleModal("modalAddEdit");
                this.loadData();
            }
        })
        .catch((e)=>{
            console.clear();
            this.setState({loading: true});
            setTimeout(()=>this.updateUser(_id),7000);
        });
    }

    addUser = () =>{
        console.log(this.state.rol);
        fetch(`https://rest-api-auxcar.cloudno.de/api/usuario/add`,{
            method: 'POST',
            body: `{
                "user": "${this.state.user}",
                "clave": "${this.state.newClave}",
                "nombre": "${this.state.nombre}",
                "rol": "${this.state.rol}"
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
                this.toggleModal("modalAddEdit");
                this.loadData();
            }
        })
        .catch((e)=>{
            console.clear();
            this.setState({loading: true});
            setTimeout(()=>this.addUser(),7000);
        });
    }

    deleteUser = () =>{
        fetch(`https://rest-api-auxcar.cloudno.de/api/usuario/delete`,{
            method: 'POST',
            body: `{
                "_id": ${this.state.deleteId}
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
                this.toggleModal("modalConfirmation");
                this.loadData();
                //puede ser solo removechild
            }
        })
        .catch((e)=>{
            console.clear();
            this.setState({loading: true});
            setTimeout(()=>this.deleteUser(),7000);
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
                <h1 className="display-4 mb-0 text-white">USUARIOS</h1>
            </div>
            <div className="col">
                <Fab size="medium" className="float-right" id="_addUser" onClick={this.handleAddEdit} 
                color="primary" aria-label="add" component="span"> 
                    <i className="fa fa-plus"></i>
                </Fab>
            </div>
        </div>
        <Card className="animate__animated animate__fadeInDown animate__fast">
            <TableContainer>
                <Table stickyHeader className="table-responsive">
                    <TableHead>
                    <TableRow>
                        <TableCell>
                        <strong>Usuario</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Nombre</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Rol</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Acciones</strong>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        this.state.usuarios.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((usuario, i)=>{
                            return(
                                <TableRow  key={i+"_tr"} tabIndex={-1}>
                                    <TableCell>
                                        {usuario.user}
                                    </TableCell>
                                    <TableCell>
                                        {usuario.nombre}
                                    </TableCell>
                                    <TableCell>
                                        {usuario.rol}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => this.handleAddEdit(event, usuario.idUsuario)} fontSize="small" aria-label="editar" color="primary" component="span">
                                            <Icon className="fa fa-pencil-square-o" fontSize="small" />
                                        </IconButton>
                                        {
                                            this.state.userRol == "Administrador" ?
                                                <IconButton onClick={(event) => this.handleDelete(event, usuario.idUsuario)} fontSize="small" aria-label="delete" color="primary" component="span">
                                                    <Icon className="fa fa-trash-o" fontSize="small" />
                                                </IconButton> :
                                                ""
                                        }
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
            count={this.state.usuarios.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        </Card>
            <AlertConfirmacion deleteId={this.state.deleteId} userLog={this.props.userLog} deleteUser={this.deleteUser} modalConfirmation={this.state.modalConfirmation} toggleModal={()=>this.toggleModal(this.toggleModal("modalConfirmation"))}/>
            <ModalAddEdit usuarioSeleccionado={this.state.usuario_seleccionado} updateUser={this.updateUser} addUser={this.addUser} handleChange={this.handleChange} modalAddEdit={this.state.modalAddEdit} toggleModal={()=>this.toggleModal(this.toggleModal("modalAddEdit"))}/>
        </>);
    }
}