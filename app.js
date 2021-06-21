require('colors');
const { guardadDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
// const { mostrarMenu, pausa } = require('./helpers/mensajes');
const Tareas = require('./models/tareas');


const main = async () => {

    let opt= '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    //Cargar las tareas
    if (tareasDB) {
        //Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    

    do {

        //Imprimir el menu
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                    //Crear opcion
                    const desc = await leerInput('Descripcióm:');
                    tareas.crearTarea(desc);               
                break;
            
            case '2':
                //Listado de tares
                tareas.listadoCompleto();
                
                break;

            case '3':
                //listado de tareas completadas
                tareas.listarPendientesCompletadas(true);
                
                break;
            
            case '4':
                //listado de tareas pendientes
                tareas.listarPendientesCompletadas(false);
                
                break;

            case '5':
                //completado pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                
                break;

            case '6':
                //borrar tareas
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id !== '0'){
                    //preguntar si esta seguro
                    const ok = await confirmar('¿Está seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }
                
                break;
        }

        guardadDB(tareas.listadoArr);

        await pausa();
     

    } while (opt !== '0');

}

main();