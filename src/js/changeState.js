
(function(){
    const changeStateButton = document.querySelectorAll('.change-state')

    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    changeStateButton.forEach(button => {
        button.addEventListener('click',changeStateJob)
    });

    async function changeStateJob(event){
        
        const {jobId:id}=event.target.dataset;        

        const url = `/jobs/${id}`
        
        try {
            const response = await fetch(url,{
                method:'PUT',
                headers:{
                    'CSRF-Token':token
                }
            })
            
            const {result} = await response.json()
            if(result){
                if(event.target.classList.contains('bg-yellow-100'))
                {
                    event.target.classList.add('bg-green-100','text-green-800')
                    event.target.classList.remove('bg-yellow-100','text-yellow-800')
                    event.target.textContent='Published'

                }else{
                    event.target.classList.remove('bg-green-100','text-green-800')
                    event.target.classList.add('bg-yellow-100','text-yellow-800')
                    event.target.textContent='Not published'
                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }
})()