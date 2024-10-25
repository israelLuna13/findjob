(function(){

    const btnDelete = document.querySelectorAll('.delete-job');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    btnDelete.forEach(button =>{
        button.addEventListener('click',alerta)
    })

    async function alerta(event){
        
           // Personaliza tu mensaje de confirmación
           const message = "¿Estás seguro de que quieres eliminar este trabajo? Esta acción no se puede deshacer.";
        
           // Usar confirm para mostrar el mensaje
           const userConfirmed = confirm(message);
           if(userConfirmed){
            const {jobId:id}=event.target.dataset;    
            const url = `/jobs/delete/${id}`
            try {
                const response = await fetch(url,{
                    method:'POST',
                    headers:{
                        'CSRF-Token':token
                    }
                })
                {
                    response.ok ?window.location.href = '/my-jobs': console.error('Error al eliminar el trabajo:', response.statusText);
                }
    
            } catch (error) {
                console.log(error);
                        
            }
           }    

    }

})()