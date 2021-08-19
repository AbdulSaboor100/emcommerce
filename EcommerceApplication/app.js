 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBestuOMbqo2cKIFzj5Ode9E8Xy5EhfiAU",
    authDomain: "vipp-817e7.firebaseapp.com",
    projectId: "vipp-817e7",
    storageBucket: "vipp-817e7.appspot.com",
    messagingSenderId: "638028005308",
    appId: "1:638028005308:web:a062563bfb17c4e2f535b9",
    measurementId: "G-QHB4VXCEQH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  ///////////////////////////////


let db = firebase.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

let userName = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');

function register(){
    auth.createUserWithEmailAndPassword(email.value,password.value)
        .then(async(UserCredientials)=>{
            let dataObj = {
                email : UserCredientials.user.email,
                username : userName.value,
                UID : UserCredientials.user.uid
            }
            await saveDataToFirestore(dataObj)
            if(UserCredientials.user){
                email.value = '';
                password.value = '';
                userName.value = '';
            }
        })
        .catch((error)=>{
            console.log(error.message)
        })
}


function login(){
    auth.signInWithEmailAndPassword(email.value,password.value)
        .then((UserCredientials)=>{
            
        })
        .catch((error)=>{
            console.log(error.message)
        })
}

async function saveDataToFirestore(dataObjEl){
    let currentUser = auth.currentUser;
    await db.collection('foneyUsers').doc(currentUser.uid).set(dataObjEl)
}

let removeRegister = document.getElementById("removeRegister");
let removeLogin = document.getElementById('removeLogin');
auth.onAuthStateChanged((user) => {
    let pageLocArr = window.location.href.split('/');
    let pageName = pageLocArr[pageLocArr.length - 1];
    let authenticatedPages = ['index.html','home.html','cart.html'];
    console.log(user)
    if (user && authenticatedPages.indexOf(pageName) === -1) {
        

            window.location = '../index.html';

    
    }

    if(user){
        removeLogin.style.display = 'none'
        console.log('f')
        removeRegister.style.display = 'none'

    }else{
        removeLogin.style.display = 'block'
        console.log('f')
        removeRegister.style.display = 'block'
    }
    if(user.email === 'admin@admin.com'){
        window.location = 'components/home.html'
    }
                                                                                     
});



async function logOut(){

    await auth.signOut()

}

async function logOutAdmin(){
    await auth.signOut()

}

// let fileInput = document.getElementById('fileInput');
// let i = 0;
 
// function fileUploadToStorage(){
//     let currentUser = auth.currentUser;
//     let filePath = fileInput.files[0];
//     let imageStorage ;
    
//     imageStorage = storage.ref().child(`images/${i}`)
//     i++
//     imageStorage.put(filePath)
//         .then(function(){
         
//         })


        
        
// }
// function fetchImages(){
//     let currentUser = auth.currentUser;
//     let filePath = fileInput.files[0];
//     let imageStorage;
//      imageStorage = storage.ref().child(`images/${i}`)
//      i ++
//     imageStorage.getDownloadURL()
//     .then(function(URL){
//         console.log(URL)
//     })
// }


// fetchImages()




async function addToCart(btnEl){
    let currentUser = auth.currentUser;
    let Item = document.getElementById(btnEl.parentNode.id)

   await db.collection('foneyUsers').doc(currentUser.uid).collection('cart').add({
        itemname : Item.children[1].innerHTML,
        itemprice : Number(Item.children[2].innerHTML)
    })
}


let cardItemAdd = document.getElementById('cardItemAdd');
let totalPrice = 0;
let total = document.getElementById('total');
let lengthOfCart = document.getElementById('lengthOfCart');
let dataArray = [];

async function cartData(){

    setTimeout(async function(){
        let currentUser = auth.currentUser;
        
        let data =  await db.collection('foneyUsers').doc(currentUser.uid).collection('cart').get()
        data.forEach(async function(dataLoad){
            // console.log(dataLoad.data().itemprice)
          totalPrice += dataLoad.data().itemprice;
          dataArray.push(dataLoad.data())
          lengthOfCart.innerHTML = dataArray.length;
          total.innerHTML = `Rs ${totalPrice}`;
            let p = document.createElement('p');
            let a = document.createElement('a');
            let deleteBTN = document.createElement('button');
            let span = document.createElement('span');
            let createTextNodeDeleteBtn = document.createTextNode('Delete')
            let createTextNodeA = document.createTextNode(dataLoad.data().itemname)
            let createTextNodeSpan = document.createTextNode(`Rs ${dataLoad.data().itemprice}`)
            
            deleteBTN.appendChild(createTextNodeDeleteBtn);
            p.id = dataLoad.id;
            a.id =  'productname'
            span.className = 'price';
            span.id = 'productprice';
            deleteBTN.className = 'btn-primary';
            deleteBTN.setAttribute('onclick',`deleteBTNFunc(this)`)
            a.appendChild(createTextNodeA);
            span.appendChild(createTextNodeSpan)    
            p.appendChild(deleteBTN)
            p.appendChild(a)
            p.appendChild(span)
            cardItemAdd.appendChild(p)
            
                
       
        })
      
    },2000)


}

let updateTotalPrice = 0;
let updateDataArray = [];

async function deleteBTNFunc(Element){
    let currentUser = auth.currentUser;
    let parentID = document.getElementById(Element.parentNode.id);
    db.collection('foneyUsers').doc(currentUser.uid).collection('cart').doc(parentID.id).delete()
        .then(async function(){
        parentID.remove()
        console.log('succesFull')
        let data =  await db.collection('foneyUsers').doc(currentUser.uid).collection('cart').get()
        data.forEach(function(dataLoad){
            let updateData = dataLoad.data();
            updateTotalPrice += updateData.itemprice 
            console.log(updateData)
            total.innerHTML = updateTotalPrice;
            updateDataArray.push(updateData);
            setTimeout(() => {
                updateTotalPrice = 0 ;
                updateDataArray = [];
            }, 1000);
            console.log(updateDataArray)
            lengthOfCart.innerHTML = updateDataArray.length;
        })
    
    })

}


async function checkOut(){
    let fname = document.getElementById('fname');
    let Cemail  = document.getElementById('cemail');
    let adr  = document.getElementById('adr');
    let city  = document.getElementById('city');
    let phoneNumber  = document.getElementById('phoneNumber');
    let state = document.getElementById('state');
    let productname = document.getElementById('productname');
    let productprice = document.getElementById('productprice');


    
    let currentUser = auth.currentUser;

    await db.collection('foneyUsers').doc(currentUser.uid).collection('orders').add({
        fullname : fname.value,
        email : Cemail.value,
        address : adr.value,
        city : city.value,
        phoneNumber : phoneNumber.value,
        state : state.value,
        productname : productname.innerHTML,
        productprice : productprice.innerHTML,
        total : total.innerHTML
    })
    
    // await db.collection('foneyUsers').doc(currentUser.uid).collection('cart').delete()
 
   window.location = 'thankyou.html';    

}

