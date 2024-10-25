import path from 'path'
export default{
    mode:'development',
    entry:{
        mapa:'./src/js/mapa.js',
        showMap:'./src/js/showMap.js',
        mapHome:'./src/js/mapHome.js',
        addResume:'./src/js/addResume.js',
        changeState:'./src/js/changeState.js',
        notification:'./src/js/notification.js',
        delete:'./src/js/delete.js',


    },
    output:{
        filename:'[name].js',
        path:path.resolve('public/js')

}
}