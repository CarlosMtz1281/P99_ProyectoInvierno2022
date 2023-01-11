import React from 'react'
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import InputLabel from '@mui/material/InputLabel';
import { Typography } from '@mui/material';
//Este componente se va agregar en version telefono todavia lo ando haciendo
function Card(props) {
  return (
    <div>
        <Card
        sx={{
          maxWidth: 255,
          position: "absolute",
          textAlign: "left",
          marginLeft: "5px",
          marginTop: "120px",
          border: "2px solid  rgb(165, 165, 180)",
          borderRadius: "8px",
        }}
      >
    <CardContent>
    <Typography
      gutterBottom
      variant="h5"
      component="div"
      sx={{ textAlign: "center",fontFamily: 'arial' }}
    >
      {props.id}-{props.coursename}
    </Typography>
    <br/>
    <InputLabel  sx={{ fontFamily: 'arial' }}>Nivel:</InputLabel>
    <Typography sx={{ fontFamily: 'arial' }} >
        {props.level}
    </Typography>
        <br/>
        <InputLabel sx={{ fontFamily: 'arial' }}>Nivel:</InputLabel>
    <Typography sx={{ fontFamily: 'arial' }}>
        {props.teacher}
    </Typography>
        <br/>
        <InputLabel sx={{ fontFamily: 'arial' }}>Frecuencia:</InputLabel>
    <Typography sx={{ fontFamily: 'arial' }}>
        {props.weeklyfrequency}
    </Typography >
        <br/>
        <InputLabel sx={{ fontFamily: 'arial' }}>Capacidad:</InputLabel>
    <Typography sx={{ fontFamily: 'arial' }}>
        {props.maximumcapacity}
    </Typography>
        <br/>
  </CardContent>
  <CardActions>
    <Button color="primary" >Eliminar</Button>
    <Button color="error">Editar</Button>
  </CardActions>
  </Card>
  </div>

  )
}

export default Card