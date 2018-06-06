$(document).ready(function(){



  // Initialize Firebase

  var config = {
    apiKey: "AIzaSyDUE4pr67a80pw_BEgh8HlAY3GqI2MUHdU",
    authDomain: "database-cryptobot.firebaseapp.com",
    databaseURL: "https://database-cryptobot.firebaseio.com",
    projectId: "database-cryptobot",
    storageBucket: "database-cryptobot.appspot.com",
    messagingSenderId: "540801591647"
  };
  firebase.initializeApp(config);
  const auth = firebase.auth();


    var bigOne = document.getElementById('bigOne');
    var dbRef = firebase.database().ref().child('text');
    dbRef.on('value', snap => bigOne.innerText = snap.val());



    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogOut = document.getElementById('btnLogOut');

    btnLogin.addEventListener('click', e => {

        //e.preventDefault();

        const email = txtEmail.value;
        const pass = txtPassword.value;
        

        const promise = auth.signInWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.messege));

    });


    btnSignUp.addEventListener('click', e => {

        //e.preventDefault();


        const email = txtEmail.value;
        const pass = txtPassword.value;

        const promise = auth.createUserWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.messege));

    });

     btnLogOut.addEventListener('click', e => {

     firebase.auth().signOut();

     });

    firebase.auth().onAuthStateChanged(firebaseUser => {

        if (firebaseUser) {
            console.log(firebaseUser);
            btnLogOut.classList.remove('invisible');
            window.location.href = "cryptobot.html";
        } else {
            console.log("not logged in");
            btnLogOut.classList.add('invisible');
        }

    });

});




