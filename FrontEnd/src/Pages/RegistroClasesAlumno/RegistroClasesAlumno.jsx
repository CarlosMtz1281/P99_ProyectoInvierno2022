import Box from '@mui/material/Box'
import React, { useState, useEffect, useContext } from 'react'
import Clase from '../../Components/Clase/Clase'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Button, Link } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import { AlertTitle } from '@mui/material'
import { Card, CardContent, Typography, TextField, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Modal from '@mui/material/Modal'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getStudents } from '../../api/students'
import { getClasses } from '../../api/classes'
import { userContext } from './../../App.jsx'
import { createClassStudent, getClassStudent } from '../../api/classStudent'
import { createWaitList, getWaitList } from '../../api/waitList'
import { findTerm } from '../../api/term'
import ConfirmationDialog from '../../Components/Dialog/ConfirmationDialog'
import ClaseModal from '../../Components/Clase/ClaseModal'
import MiRegistro from '../../Components/Registro/MiRegistro'

function RegistroClasesAlumnos({changeContent}) {
    const [items, setItems] = useState([]);
    const [students, setStudents] = useState(null);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [error, setError] = useState('none');
    const [clases, setClases] = useState(null);
    const [claseRegistrada, setClaseRegistrada] = useState([]); // esto se obtendria de la base de datos
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [openMoreInfo, setOpenMoreInfo] = useState(false);
    const [currentClase, setCurrentClase] = useState(); 
    const [selectAlertOpen, setSelectAlertOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [filteredClasses, setFilteredClasses] = useState(null);
    
    const userValues = useContext(userContext)

    useEffect(() => {
        const getUserStudents = () =>{
             getStudents().then(
                 (data) => {
                     const students = data.filter(student => student.idUsuario === userValues._id);
                     setStudents(students);
                     //console.log(students)
             });
         }
         getUserStudents();
     }, []);

     useEffect(() => {
        const getStudentClasses = () =>{
            getClasses().then(
                (data) => {
                    setClases(data);
                    setFilteredClasses(data);
                });
            }
        getStudentClasses();
        console.log(clases)
     }, []);

    // Funcion para calcular edad 
    const calculate_age = (dateString) => {
        var birthday = +new Date(dateString);
        // The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000, which is the length of a year
        const magic_number = 31557600000;
        return ~~((Date.now() - birthday) / (magic_number));
    }

    const nivelDict = {
        '1' : 'Desde cero',
        '2' : 'Con bases',
        '3' : 'Intermedio',
        '4' : 'Avanzado'
    }

    const getNivel = (params) => {
        return  nivelDict[params.row.nivel]
    }

    const getHorario = (params) => {
        return `${params.row.lunes ? `Lun: ${params.row.lunes}` : ''}
                ${params.row.martes ? `Mar: ${params.row.martes}` : ''}
                ${params.row.miercoles ? `Mierc: ${params.row.miercoles}` : ''}
                ${params.row.jueves ? `Juev: ${params.row.jueves}` : ''}
                ${params.row.viernes ? `Vier: ${params.row.viernes}` : ''}
                ${params.row.sabado ? `Sab: ${params.row.sabado}` : ''}`
    }

    const getCupoActual = (params) => {
        return `${Number(params.row.cupo_maximo) - Number(params.row.cupo_actual)}`
    }

    const columns = [
        {
            field: 'clavePeriodo',
            headerName: 'Periodo',
            width: 110,
            editable: false,

        },
        { 
            field: 'clave',
            headerName: 'Clave',
            width: 100 
        },
        {
            field: 'nombre_curso',
            headerName: 'Curso',
            width: 120,
            editable: false,
        },
        {
            field: 'nivel',
            headerName: 'Nivel',
            width: 100,
            editable: false,
            valueGetter: getNivel,
        },
        {
            field: 'area',
            headerName: 'Area',
            width: 110,
            editable: false
        },
        {
            field: 'modalidad',
            headerName: 'Modalidad',
            width: 110,
            editable: false
        },
        {
            field: 'horario',
            headerName: 'Horario',
            width: 150,
            editable: false,
            valueGetter: getHorario,
        },
        {
            field: 'cupo_disponible',
            headerName: 'Lugares disponibles',
            width: 120,
            editable: 'false',
            valueGetter: getCupoActual,
        },
        {
            field: "actions",
            headerName: "Incripción",
            type: "actions",
            width: 115,
            renderCell: (params) => (
                Number(params.row.cupo_actual) < Number(params.row.cupo_maximo) ?
                <Button size='small' onClick={() => handleOpenDialog(params.row)} variant="outlined"
                    disabled={params.row.status === "Inscrito" ? true : false}>
                    Inscribir
                </Button>  :
                <Button size='small' onClick={() => handleOpenDialog(params.row)} variant="outlined"
                    disabled={params.row.status === "ListaEspera" ? true : false}>
                    Lista Espera
                </Button> 
            ),

        }

    ];

    const handleMoreInfo = (clase) => {
        setCurrentClase(clase);
        setOpenMoreInfo(!openMoreInfo);
    };
    
    const filterClasses = (student) => {
        const age = calculate_age(student.fecha_de_nacimiento);
        let waitList = [];   
        let myClasses = [];
        const filter = clases.filter(clase => Number(clase.edad_minima) < age && age < Number(clase.edad_maxima));
        filter.map((aClass) => {
            aClass.status = '';
        })
        getWaitList().then((data) => {
            waitList = data.filter(lista => lista.idAlumno === student._id);
        })
        .then(() => {
            waitList.map((inWaitList) =>{
                for (let i = 0; i < filter.length; i++) {
                    if (inWaitList.idClase === filter[i]._id) {
                        filter[i].status = 'ListaEspera'
                    }
                }
            })
        })
        getClassStudent().then((data) => {
            myClasses = data.data.filter(clase =>  clase.idAlumno === student._id);
        })
        .then(() => {
            myClasses.map((myClass) => {
                for (let i = 0; i < filter.length; i++) {
                    if (myClass.idClase === filter[i]._id) {
                        filter[i].status = 'Inscrito';
                    }
                }
            })
            setFilteredClasses(filter);
        })
    }

    const handleChange = (e) => {
        setCurrentStudent(e.target.value);
        filterClasses(e.target.value);
    }

    const handleListaEspera = (clase) =>{
        if (currentStudent == null) {
            setSelectAlertOpen(true);
            return
        }     
        let lista = [];   
        getWaitList().then((data) => {
            lista = data.filter(lista => lista.idAlumno === currentStudent._id);
        }).then(() => {
            createWaitList(new URLSearchParams({
                'idAlumno': currentStudent._id,
                'idClase': clase._id,
                'lugar_de_espera': (lista.length + 1).toString(),
                'status': 'Espera'
            }));
            clase.status = 'ListaEspera'
            handleCloseDialog();
        })
    }

    const handleClaseRegistrada = (clase) => {
        if (currentStudent == null) {
            setSelectAlertOpen(true);
            return
        }  
        // Hacer validación de numero de clases disponibles por inscribir
        if (claseRegistrada[0]) {
            setError('block')
        } else {
            let periodo = []
            findTerm(new URLSearchParams({ 'clave' : clase.clavePeriodo}))
            .then((data) => {
                periodo = data
            })
            .then(() => {
                createClassStudent(new URLSearchParams({
                    'idClase' : clase._id,
                    'idAlumno' : currentStudent._id,
                    'idPeriodo' : periodo[0]._id
                })).then((data) => {
                    //console.log(data);
                    setClaseRegistrada([clase._id])
                    clase.status = 'Inscrito'
                    handleCloseDialog();
                })
            })
        }
    }
     
    const handleOpenDialog = (clase) => {
        setClaseRegistrada(clase);
        setOpenConfirmationDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenConfirmationDialog(false);
    };


    if (!students || !clases) {
        return(
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'center'}}>
                <CircularProgress />
            </Box>
        )
    }
    if (students.length === 0 && students !== null){
        return(
            <Box sx={{ height: '100vh', display: 'flex',
                alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                <Typography variant='h3' component='div' textAlign='center'>
                    No tienes alumnos registrados, ve a  
                     <Link
                    component="button"
                    onClick={() => changeContent('Profile')}
                    variant='h3'
                    sx={{mx: 2}}
                    >
                        <i> Perfil </i>
                    </Link> 
                     para agregar alumnos.
                </Typography>
            </Box>
        )
    }
    return (
        <>
            <Box sx={{m: 2}}>
                <FormControl fullWidth>
                    <InputLabel>Estudiantes</InputLabel>
                    <Select
                        value={currentStudent || ''}
                        label="Estudiantes"
                        onChange={handleChange}
                    >
                        {students.map((student) => (
                            <MenuItem
                                key={student._id}
                                value={student}
                            >
                                {student.nombre} {student.apellido_paterno} {student.apellido_materno}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: error, bgcolor: 'rgba(50, 50, 50, 0.60)', zIndex: '1000', width: { xs: '100vw', sm: '86vw' }, position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
                <Alert sx={{
                    position: 'absolute', top: '50vh', left: '50%', transform: 'translate(-50%,-50%)', zIndex: '1000', width: '50%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
                }} severity="error">
                    <AlertTitle> Error</AlertTitle>
                    Solo puedes Tener <strong>una</strong> clase Registrada
                    <br />
                    <Button onClick={() => setError("none")} sx={{ color: 'error.dark' }}>
                        Cancelar
                    </Button>
                    <Button onClick={() => { setClaseRegistrada([]); setError('none') }} sx={{ color: 'error.dark' }}>
                        Anular Registro
                    </Button>
                </Alert >
            </Box>
            <Box sx={{ textAlign: 'center', width: '100%', paddingX: '20px', height: '100vh', paddingBottom: '10px', overflowY: 'scroll', display: { xs: 'block', sm: 'none' } }}>
                {
                    filteredClasses.length !== 0 ?    
                    filteredClasses.map(e => (
                            <Clase handleOpenDialog={handleOpenDialog} handleMoreInfo={handleMoreInfo} key={e._id} clase={e} />
                        ))
                    :
                        <Box sx={{ height: '100vh', display: 'flex',
                            alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                            <Typography variant='h3' component='div' textAlign='center'>
                                No hay clases disponibles por el momento.
                            </Typography>
                        </Box>
                }
            </Box >
            <Box sx={{ width: '100%', display: {xs: 'none', sm: 'flex'}, height: '100vh', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ flexDirection: 'column' }}>
                    <Card
                        sx={{
                            textAlign: "left",
                            ml: "1",
                            my: 2,
                            border: "2px solid  rgb(165, 165, 180)",
                            borderRadius: "8px",
                            width: { lg: '30%', sm: '40%' },
                            
                            minHeight: '293px',
                            minWidth: '340px',
                            overflowY: 'scroll'
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ textAlign: "center", fontFamily: 'arial' }}
                            >
                                Busqueda
                            </Typography>
                            <TextField
                                style={{ paddingBottom: "15px", fontFamily: 'arial', width: '25ch' }}
                                label="Curso"
                                onChange={e => { setItems([{ columnField: 'nombre_curso', operatorValue: 'contains', value: e.target.value }]) }}></TextField>
                            <TextField
                                style={{ paddingBottom: "15px", width: "25ch", fontFamily: 'arial' }}
                                label="Nivel"
                                id="filled-select-currency"
                                onChange={e => { setItems([{ columnField: 'nivel', operatorValue: 'contains', value: e.target.value }]) }}
                                select
                            >
                                {["Principiante", "Intermedio", "Avanzado"].map(e => (
                                    <MenuItem value={e} key={e}>

                                        {e}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                style={{ paddingBottom: "15px", width: "25ch", fontFamily: 'arial' }}
                                label="Periodo"
                                id="filled-select-currency"
                                onChange={e => { setItems([{ columnField: 'clavePeriodo', operatorValue: 'contains', value: e.target.value }]) }}
                            >
                            </TextField>
                            <TextField
                                style={{ paddingBottom: "15px", width: "25ch", fontFamily: 'arial' }}
                                label="Cupo Maximo"
                                id="filled-select-currency"
                                onChange={e => { setItems([{ columnField: 'cupo_maximo', operatorValue: 'contains', value: e.target.value }]) }}
                            >
                            </TextField>
                        </CardContent>
                    </Card>
                    <MiRegistro />
                </Box>
                <Box
                    sx={{
                        width: { lg: '60%', sm: '90%' },
                        height: { lg: '95%', sm: '50%' },
                        maxHeight: '100vh', minWidth: '548px',
                        '& .theme--ListaEspera': {
                        bgcolor: 'lightyellow'
                        },
                        '& .theme--Inscrito': {
                        bgcolor: 'lightgreen'
                        }
                    }}
                >
                    <DataGrid 
                        rows={filteredClasses} columns={columns} 
                        disableSelectionOnClick={true}
                        getRowId={(row) => row._id}
                        getRowHeight={() => 'auto'}
                        filterModel={{
                            items: items
                        }}
                        getRowClassName={(params) => `theme--${params.row.status}`}

                    />
                </Box>          
                <Modal
                    open={openMoreInfo}
                    onClose={() => setOpenMoreInfo(!openMoreInfo)}
                    sx={{overflowY: 'scroll'}}
                >
                    <>                
                        <ClaseModal clase={currentClase} />
                    </>
                </Modal>
            </Box>
            <ConfirmationDialog clase={claseRegistrada} handleClose={handleCloseDialog} open={openConfirmationDialog} handleClaseRegistrada={handleClaseRegistrada} handleListaEspera={handleListaEspera}/> 
            <Snackbar open={selectAlertOpen} autoHideDuration={8000} onClose={() => setSelectAlertOpen(false)}>
                <Alert severity='info'>
                    Selecciona un alumno para inscribir clases o entrar a la lista de espera
                </Alert>
            </Snackbar>
        </>
    )
}

export default RegistroClasesAlumnos
