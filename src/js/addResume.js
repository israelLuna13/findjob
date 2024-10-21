import {Dropzone} from 'dropzone'
//obtenemos el token que esta en la etiqueta meta y se lo pasamos a dropzone
const token =document.querySelector('meta[name="csrf-token"]').getAttribute("content")
//configuramos dropzone
Dropzone.options.resume = {
    dictDefaultMessage: 'Upload your resume',
    acceptedFiles: '.pdf,.png,.jpg,.jpeg',  // Acepta PDF y también imágenes
    maxFilesize: 5,  // Tamaño máximo del archivo en MB
    maxFiles: 1,  // Solo permite subir un archivo
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Delete file',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token  // Incluye el token CSRF
    },
    paramName:'resume',
    // we no use the upload default the dropzone and we have that do it manual
    init:function(){
        const dropzone = this
        const btnUpload = document.querySelector("#upload")
        btnUpload.addEventListener('click',function(){
            dropzone.processQueue()
        })

        //when end the process of file
        dropzone.on('queuecomplete',function(){
            if(dropzone.getActiveFiles().length == 0){
                //redirect
                window.location.href='/my-jobs'
            }
        })
    }
}
