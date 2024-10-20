(function(){
    const lat = 25.52389;
    const lng = -103.41898;
  // L.map('mapa'): Crea un mapa utilizando la biblioteca Leaflet. Se asume que hay un elemento HTML con el id mapa donde se va a renderizar el mapa.
    // .setView([lat, lng], 16): Establece la vista del mapa en las coordenadas especificadas (lat, lng) con un nivel de zoom de 16.


    const map = L.map('map-home').setView([lat,lng],16);

    let markers = new L.FeatureGroup().addTo(map)

    let jobs=[]

    //filters

    //save the id that user choose in the select 
    const filter = {
        category:'',
        price:'',
        skill:''
    }

    const categorySelect = document.querySelector('#categorys')
    const pricesySelect = document.querySelector('#prices')
    const skillSelect = document.querySelector('#skills')

//when change one solect , we add the id in the filter
    categorySelect.addEventListener('change',e=>{
        filter.category = +e.target.value
        filterJobs()
    })

    pricesySelect.addEventListener('change',e=>{
        filter.price = +e.target.value
        filterJobs()
    })

    skillSelect.addEventListener('change',e=>{
        filter.skill = +e.target.value
        filterJobs()
    })
  
       // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'): Crea una capa de tiles utilizando los mapas de OpenStreetMap. La URL de los tiles contiene {s}, {z}, {x}, y {y}, que son placeholders para el subdominio del servidor, el nivel de zoom, y las coordenadas del tile.
    // { attribution: ... }: Proporciona la atribución requerida por OpenStreetMap, que es un enlace al sitio web y a los derechos de autor.
    // .addTo(mapa): Añade esta capa de tiles al mapa creado anteriormente (mapa).
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // we get the data with all jobs
    const getJobs = async()=>{
        try {
            const url = '/api/jobs'
            const response = await fetch(url)
            jobs = await response.json()
            showJobs(jobs)
        } catch (error) {
            console.log(error);
        }
    }

    const showJobs = jobs =>{

        //clear markers previus
        markers.clearLayers()
        //we show the pins on the map
        jobs.forEach(job => {
            //add pins
            const marker = new L.marker([job?.lat,job?.lng],{
                autoPan:true,//center view
            })
            .addTo(map)
            .bindPopup(`
                        <p class="text-blue-600 font-bold">${job.category.name}</p>
                        <p class="text-blue-600 font-bold">${job.company}</p>
                        <h1 class="text-xl font-extrabold uppercase my-5">${job?.title}</h1>
                        <p class="text-gray-600 font-bold">${job.skill.name}</p>
                        <p class="text-gray-600 font-bold">${job.price.name}</p>
                        <a href="/job/${job.id}" class="bg-blue-600 block p-2 text-center font-bold uppercase">Look job</a>
                `)//display information when we click on a pin
            //add pins on map
            markers.addLayer(marker)
        });
    }

    const filterJobs=()=>{
        const result = jobs.filter(filterCategory).filter(filterPrice).filter(filterSkill)
        showJobs(result)
    }

    const filterCategory =(job)=>{
        return filter.category ? job.categoryId === filter.category:job
    }
    const filterPrice =(job)=>{
        return filter.price ? job.priceId === filter.price:job
    }
    const filterSkill =(job)=>{
        return filter.skill ? job.skillId === filter.skill:job
    }
    getJobs()

})()