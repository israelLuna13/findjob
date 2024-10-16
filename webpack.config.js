import path from 'path'
export default{
    mode:'development',
    entry:{
        mapa:'./src/js/mapa.js',
        showMap:'./src/js/showMap.js'

    },
    output:{
        filename:'[name].js',
        path:path.resolve('public/js')

}
}