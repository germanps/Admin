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

// 0. Autentificación
var ingresar = function(){
    var email = document.getElementById('correo').value;
    var password = document.getElementById('pass').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then( () => {
        console.log('Acceso correcto');
        window.location = "admin_add.html";
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error en el acceso' + errorCode + errorMessage);
    });
}

// 0.1 Observador del estado del usuario (auth)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log('Si estás autorizado');
    } else {
        // No user is signed in.
        //window.location = "index.html";
        console.log('No estas autorizado');
        if(window.location.pathname != "/index.html"){
            window.location = "index.html";
        }
    }
});

// 0.2 salir de sesión
var eliminarSesion = function(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('Sesion terminada');
      }).catch(function(error) {
        // An error happened.
        console.log('Error en terminar sesion:' + error);
      });
}

// 1. Crear Platos
var database = firebase.database();
var ingresarPlato = function(pNombre, pDescripcion, pPrecio, pcantidad, pdireccion, pimagenlocal){
   database.ref('alimentos').push({
      nombre: pNombre,
      descripcion: pDescripcion,
      precio: pPrecio,
      cantidad: pcantidad,
      direccion: pdireccion,
      nombreImagen: pimagenlocal
   }).then(function(){
       alert('Se agregó el item "desde la promise"');
       window.location = "admin_add.html";
   }).catch(function(){
       alert('Error al agregar el item "desde el catch de la promesa"');
   });
}


// 2. Leer Platos
var imprimirPlatos = function(){
    
    var query = database.ref('alimentos');
    console.log(query);
   
    query.on('value', function(snapshot){
        console.log(snapshot.val());
        var listadoPlatos = `<ul class="platos-lista">`
        snapshot.forEach(plato => {
            let platoKey = plato.key;
           listadoPlatos += `<li class="platos-lista-item" key="${platoKey}">
                                <div class="lista-item-wrapper">                         
                                    <p class="title">${plato.val().nombre}</p>
                                    <div class="image">
                                        <img title="${plato.val().nombreImagen}" src="${plato.val().direccion}" alt="imagen del plato">
                                    </div>
                                    <div class="datos-adicionales">
                                        <p class="descripcion">${plato.val().descripcion}</p>
                                        <p class="precio">Precio: ${plato.val().precio}</p>
                                        <p class="cantidad">Cantidad: ${plato.val().cantidad}</p>
                                    </div>
                                    <button id="${plato.key}" onclick="eliminarPlatos(this.id, this.parentNode)">Eliminar</button>
                                </div>
                            </li> `
        });
        listadoPlatos += `</ul>`
        const containerPlatos = document.querySelector('.platos-wrapper');
        containerPlatos.innerHTML = listadoPlatos;
    })
}



//3. Eliminar Platos
var eliminarPlatos = function(id,item){
    let rutaImagen = item.querySelector('.image img').getAttribute("title");
    console.log(rutaImagen);
    let imgRef = storageRef.child("platos/" + rutaImagen);
    console.log(imgRef);

    imgRef.delete()
        .then( () => {
            console.log("imagen borrada!")
        })
        .catch( (error) => {
            console.log("imagen NO borrada! : " + error)
        })
    database.ref('alimentos/' + id).remove()
        .then( () => {
            alert('Plato eliminado');
            console.log('Plato eliminado');
        })
        .catch( (error) => {
            console.log('Error: No se puedo borrar el item');
        })
}


//4. Funciones
function enviaDatos(event){
    event.preventDefault();
   let nombre = document.getElementById('nombre').value;
   let desc = document.getElementById('descripcion').value;
   let precio = document.getElementById('precio').value;
   let cantidad = document.getElementById('cantidad').value;
   let imagen = document.getElementById('direccionImagen').value;
   let imagenLocal = document.getElementById('nombreImagen').value;
   let submit = document.querySelector('[type="submit"]');

    ingresarPlato(nombre, desc, precio, cantidad, imagen, imagenLocal);

   return false;
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
   }

}

function subirImagen(){
    console.log('subiendo...');
    let archivo = document.querySelector('input[type="file"]').files[0];
    console.log(archivo.name);
    if (archivo) {
        //subir al storage
        var subirImagen = storageRef.child('platos/' + archivo.name).put(archivo);
        subirImagen.on('state_changed', function(snapshot){
           //indica los cambios en la carga del archivo
  
        }, function(error){
           //en caso de que haya errores
           console.log('error en la carga de la imagen: ' + error)
        }, function(){
           //carga exitosa(obtener la dirección de la imagen y nombre de la imagen)
           subirImagen.snapshot.ref.getDownloadURL()
              .then(function(downloadURL){
                 console.log(downloadURL);
                 document.getElementById('direccionImagen').value = downloadURL;
                 document.getElementById('nombreImagen').value = archivo.name;
              })
        })
     } 
}
