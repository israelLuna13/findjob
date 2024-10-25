(function(){
    if (localStorage.getItem('jobCreated') === 'true') {

const notification = document.querySelector('.notificacion')
const alert = document.createElement('DIV')
alert.classList.add('text-center','w-full','p-3','text-white','my-5','alert'
    ,'uppercase','font-bold','text-sm')

const alertaPrevia = document.querySelector('.alert')
alertaPrevia?.remove()

alert.classList.add('bg-green-500')
alert.textContent='Job Created'
notification.parentElement.insertBefore(alert,notification)
setTimeout(()=>{
    alert.remove()
},2000)
//localStorage.removeItem('jobCreated');

    }
}())