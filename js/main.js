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
var ingresarPlato = function(pNombre, pDescripcion, pPrecio){
   database.ref('alimentos').push({
      nombre: pNombre,
      descripcion: pDescripcion,
      precio: pPrecio,
      cantidad: 0
   })
}


// 2. Leer Platos



//3. Eliminar Platos



function enviaDatos(e){
   console.log('entra');
   var nombre = document.getElementById('nombre').value;
   var desc = document.getElementById('descripcion').value;
   var precio = document.getElementById('precio').value;
   var submit = document.querySelector('[type="submit"]');
   ingresarPlato(nombre, desc, precio);
}