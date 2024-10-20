//we identify if user is in session is the user that created the job
const isEmployer = (userId,jobUserId)=>{

    return userId === jobUserId
}

const formatearFecha=fecha =>{
    //la fecha que se guarda en la bd la convertimos en string y tomamos los primeros 10 caracteres ****-**-**
    //en formato ISO 8601 ("YYYY-MM-DD")
    const nuevaFecha= new Date(fecha).toISOString().slice(0,10)
    //configuracion para formatear la fecha
    const opciones = {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }
    //regresamos la fecha con un formato en espanol
    return new Date(nuevaFecha).toLocaleDateString('es-ES',opciones)
}

export{
    isEmployer,
    formatearFecha
}