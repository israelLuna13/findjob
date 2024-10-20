import {Dropzone} from 'dropzone'
//obtenemos el token que esta en la etiqueta meta y se lo pasamos a dropzone
const token =document.querySelector('meta[name="csrf-token"]').getAttribute("content")
//configuramos dropzone
Dropzone.options.imagen = {
    dictDefaultMessage: 'Upload your resume',
    acceptedFiles: '.pdf,.png,.jpg,.jpeg',  // Acepta PDF y también imágenes
    maxFilesize: 5,  // Tamaño máximo del archivo en MB
    maxFiles: 1,  // Solo permite subir un archivo
    parallelUploads: 1,
    autoProcessQueue: true,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token  // Incluye el token CSRF
    }
}
