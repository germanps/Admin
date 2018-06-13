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



//3. Eliminar Platos



function enviaDatos(e){
   console.log('entra');
   let nombre = document.getElementById('nombre').value;
   let desc = document.getElementById('descripcion').value;
   let precio = document.getElementById('precio').value;
   let imagen = document.getElementById('direccionImagen');
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