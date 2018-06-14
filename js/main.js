// Initialize Firebase
var config = {
   apiKey: "AIzaSyBAr5IJAxIyWfCft3jtbcN1pFE2XPK7mXo",
   authDomain: "administracion-5a08d.firebaseapp.com",
   databaseURL: "https://administracion-5a08d.firebaseio.com",
   projectId: "administracion-5a08d",
   storageBucket: "administracion-5a08d.appspot.com",
   messagingSenderId: "774203834275"
};
firebase.initializeApp(config);


// 1. Crear Platos
var database = firebase.database();
var ingresarPlato = function(pNombre, pDescripcion, pPrecio, pdireccion){
   database.ref('alimentos').push({
      nombre: pNombre,
      descripcion: pDescripcion,
      precio: pPrecio,
      cantidad: 0,
      direccion: pdireccion
   })
}


// 2. Leer Platos
var imprimirPlatos = function(){
    var query = database.ref('alimentos');
    query.on('value', function(snapshot){
        //console.log(snapshot.val());
        var listadoPlatos = `<ul class="platos-lista">`
        snapshot.forEach(plato => {
            let image = plato.val().direccion;
            if (image == undefined) {
                image = "#";
            }
           listadoPlatos += `<li class="platos-lista-item">                         
                                <h4 class="title">${plato.val().nombre}</h4>
                                <div class="image">
                                    <img src="${image}">
                                </div>
                                <div class="datos-adicionales">
                                    <p class="descripcion">${plato.val().descripcion}</p>
                                    <p class="precio">${plato.val().precio}</p>
                                    <p class="cantidad">${plato.val().cantidad}</p>
                                </div>
                            </li> `
           //console.log(plato.key);
           //console.log(plato.val());
        });
        listadoPlatos += `</ul>`
        const containerPlatos = document.querySelector('.platos-wrapper');
        containerPlatos.innerHTML = listadoPlatos;
    })
}



//3. Eliminar Platos




//4. Funciones
function enviaDatos(e){
   console.log('entra');
   let nombre = document.getElementById('nombre').value;
   let desc = document.getElementById('descripcion').value;
   let precio = document.getElementById('precio').value;
   let imagen = document.getElementById('direccionImagen').value;
   let submit = document.querySelector('[type="submit"]');

   ingresarPlato(nombre, desc, precio, imagen);
}



// Vidualizar Imagen
var storage = firebase.storage();
var storageRef = storage.ref();


function visualizarImagen(){
   let preview = document.getElementById('imgPlato');
   let archivo = document.querySelector('input[type="file"]').files[0];
   var lector = new FileReader();

   lector.onloadend = function(){
      preview.src = lector.result;
      preview.style.display = 'block';
   }
   if (archivo) {
      lector.readAsDataURL(archivo);
      //subir al storage
      var subirImagen = storageRef.child('platos/' + archivo.name).put(archivo);
      subirImagen.on('state_changed', function(snapshot){
         //indica los cambios en la carga del archivo

      }, function(error){
         //en caso de que haya errores
         console.log('error en la carga de la imagen: ' + error)
      }, function(){
         //carga exitosa(obtener la dirección de la imagen
         subirImagen.snapshot.ref.getDownloadURL()
            .then(function(downloadURL){
               console.log(downloadURL);
               document.getElementById('direccionImagen').value = downloadURL;
            })
         //console.log(subirImagen.snapshot.downloadURL);
      })
   }else{
      preview.src = "";
   }
}
