let $ = string => document.getElementById(string);
let $$ = string => document.querySelector(string);

const tableAvailabilityBody = $$(".tableAvailabilityBody");
const avalabalLiterature = $$(".avalabalLiterature");
const savedSelected = $$(".savedSelected");
const inputName = $$(".inputName");
const close = $$(".close");


var unAvailableBooks = [];
var AvailableBooks = [];
var Bookss = [];


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDEkO7nF1qzGlpEFtcqsdaWCF8zGJyqa_g",
    authDomain: "tajawal-library.firebaseapp.com",
    databaseURL: "https://tajawal-library.firebaseio.com",
    projectId: "tajawal-library",
    storageBucket: "tajawal-library.appspot.com",
    messagingSenderId: "665834219738"
  };
  firebase.initializeApp(config);



// =======================================================>  finish

// (function getAllData(){
//   window.Bookss=[];
//   window.AvailableBooks = [];
//   window.unAvailableBooks = [];

//   firebase.database().ref("availableBooks").on('value', (snap)=>{
//    let avaData = snap.val();
//    for(let prop in avaData ){
//     let key = prop 
//     let data=avaData[prop];
//       data.id = key;
//       AvailableBooks.push(data)
//       // Bookss.push(data)
//       sorting(AvailableBooks)

//     }
//     display();
//   });

//   firebase.database().ref("unavailableBooks").on('value', (snap)=>{
//    let UnAvaData = snap.val();
//    for(let prop in UnAvaData){
//     let key = prop 
//     let data=UnAvaData[prop]
//     data.id = key
//     unAvailableBooks.push(data)
//     // console.log(unAvailableBooks)
//    }
//    display();
//   })

// })()

// this Method For Borrow Book =====================================================> finish
function saveSelectedBorrow() {
  let option = avalabalLiterature.value;
  let nameOfTaken = inputName.value;
  if(nameOfTaken !=="" ){
    let book = AvailableBooks.filter((element, indx) => {
      let temp = false;
      if (option === element.id) {
        element.howTakeIt = nameOfTaken;
        element.time = (new Date).getTime();
        removeFromAvailableBooks(element.id,indx)
        return (temp = true);
      }
      return temp;
    });
    addBookToUnAvaBooks(book[0])
    inputName.value = " ";
    jQuery('#exampleModal') .modal('hide')
  }else{
    alerts("Plase Add Your Name",1700)
  }
  display()
}

// this Method For Render Books into Select Input =====================================================> finish
function selectBookOptions() {
  display()
  result = "";
  AvailableBooks.forEach(element => {
    result += `
      <option class="btnSelectBy" value="${element.id}">${element.name}</option>`
  });
  avalabalLiterature.innerHTML = result;
}


// this Method For Render Data in table =====================================================>
function display() {

  AvailableBooks = [];
  unAvailableBooks =[];

  const tableBody = $$(".tableBody");

  firebase.database().ref("availableBooks").on('value', (snap)=>{
    let avaData = snap.val()
   
      for(let prop in avaData ){
       let key = prop 
       let data=avaData[prop];
         data.id = key;
         AvailableBooks.push(data)
         // Bookss.push(data)
         sorting(AvailableBooks)
       }

       result = "";
       AvailableBooks.forEach((element, indx) => {
           result += `<tr>
             <td>${indx+1}</td>
             <td>${element.name}</td>
             <td><img class="coverBook" src="${element.img}"></td>
             <td>${element.auther}</td>
             <td class="available">${element.howTakeIt}</td>
             <td><button class="deleteBook btn btn-danger" onclick="deleteBook('${element.id}',${indx})"><i class="fas fa-times-circle"></i></button></td>
             </tr>`;
       });
    
      console.log("done")
      tableBody.innerHTML = result;
      })

   


  
  firebase.database().ref("unavailableBooks").on('value', (snap)=>{
    let UnAvaData = snap.val();
    for(let prop in UnAvaData){
     let key = prop 
     let data=UnAvaData[prop]
     data.id = key
     unAvailableBooks.push(data)
     // console.log(unAvailableBooks)
    }
       if (unAvailableBooks != null && unAvailableBooks!= "undefined") {
         let result2=""
       
         unAvailableBooks.forEach((element, indx) => {
           result2 += `<tr>
             <td>${indx+1}</td>
             <td>${element.name}</td>
             <td>${new Date(element.time).toDateString()}</td>
             <td class="notAvailable">${element.howTakeIt}</td>
             <td><button class="backBook btn btn-danger" onclick="returnBook('${element.id}',${indx})"><i class="fas fa-times-circle"></i></button></td>
             </tr>`;
         });

         tableAvailabilityBody.innerHTML = result2;
        }
  })

}

// this method for Delete book =====================================================>  finish
function deleteBook(id ,indx){
  console.log(id,indx)
  firebase.database().ref("availableBooks/"+id).remove()
  .then(()=>{
    console.log("success")
    AvailableBooks.splice(indx,1)
  })
  .catch((error)=>console.log("error",error.message))  
  display();
}

// this method for Delete book =====================================================> 
function addBookToLibrary(){
  const inputNameBook = $$('.inputNameBook').value;
  const inputAutherBook = $$('.inputAutherBook').value;
  const inputGroupFile01 = $('inputGroupFile01');
  const successAlert = $$('.successAlert');

  if(inputNameBook.value !== "" && inputAutherBook.value!== "" ){
    let  newBook= {name:inputNameBook , auther:inputAutherBook ,howTakeIt:"Available",img:"coverBook.png"}
    addBookToAvaBooks(newBook)
    successAlert.setAttribute("style"," display: block;");
    setTimeout(()=>successAlert.setAttribute("style"," display: None;"),1500)
  }
display()
}



// this Method For Remove From UnAvailableBooks on firebase =====================================================> finish
function removeFromUnAvailableBooks(id ,indx){
  console.log(id,indx)
  firebase.database().ref("unavailableBooks/"+id).remove()
  .then(()=>{
    console.log("success")
    unAvailableBooks.splice(indx,1)
  })
  .catch((error)=>console.log("error",error.message))
}

// this Method For ADD To UnAvailableBooks on firebase =====================================================> finish
function addBookToUnAvaBooks(data){
    console.log(data)
    firebase.database().ref("unavailableBooks").push().set(data)
    .then(()=>{
      console.log("success")
    })
    .catch((error)=>console.log("error",error.message))
}

// this Method For Remove From AvailableBooks on firebase =====================================================> finish
function removeFromAvailableBooks(id ,indx){
  console.log(id,indx)
  firebase.database().ref("availableBooks/"+id).remove()
  .then(()=>{
    console.log("success")
    AvailableBooks.splice(indx,1)
  })
  .catch((error)=>console.log("error",error.message))
}

// this Method For ADD To AvailableBooks on firebase =====================================================> finish
function addBookToAvaBooks(data){
  firebase.database().ref("availableBooks").push().set(data)
  .then(()=>{
    console.log("success")
  })
  .catch((error)=>console.log("error",error.message))
}





// this Method For Return Books to Availability =====================================================> finish
function returnBook(id,indx) {
console.log(id ,indx)  
unAvailableBooks.forEach(element=>{
  if(element.id === id){
    console.log(element.id , id)
    element.howTakeIt = "Available";
    addBookToAvaBooks(element)
    }
  })
  removeFromUnAvailableBooks(id ,indx)
  display()
}

// this Method For Sort Books By Name =====================================================> finish
function sorting(arr){
  arr.sort((a,b)=>{
    var item1 = a.name
    var item2 = b.name
    return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
  })
}

//this method for General Alert Made By Megooo ===========================================> finish
function alerts(alrtMsgs , time){
  const alrt = document.querySelector(".alerts");
  const alrtMsg = document.querySelector(".alrtMsg")
  console.log(alrt);
  alrt.style.opacity = "1";
  alrt.style.transform= "translateY(300px)"
  alrtMsg.textContent = alrtMsgs; 
  setTimeout(function(){ alrt.style.opacity = "0"; }, time); 
}


display()
//this method for general Alert Made By Megooo ===========================================>

savedSelected.addEventListener("click", saveSelectedBorrow);
avalabalLiterature.addEventListener("click", selectBookOptions)

