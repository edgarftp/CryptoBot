

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

  

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogOut = document.getElementById('btnLogOut');

    btnLogin.addEventListener('click', e => {

        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.messege));

    });


    btnSignUp.addEventListener('click', e =>{


        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email, pass);

        promise.catch(e => console.log(e.messege));



    })

    btnLogOut.addEventListener('click', e => {

        firebase.auth().signOut();

    })

    firebase.auth().onAuthStateChanged(firebaseUser => {

        if (firebaseUser) {
            console.log(firebaseUser);
            btnLogOut.classList.remove('invisible');
        } else {
            console.log("not logged in");
            btnLogOut.classList.add('invisible');
        }

    });







    //      const auth = firebase.auth();

    //      auth.signInWithEmailAndPassword(email,pass);

    //      auth.createUserWithEmailAndPassword(email,pass);

    //      auth.onAuthStateChanged(firebaseUser => {});





    //     /**********************\
    //      * Check login status *
    //     \**********************/

    //     firebase.auth().onAuthStateChanged(function(user) {
    //         if (user) { // if already logged in
    //             window.location.href = 'cryptobot.html';
    //         }
    //     });




    //     /*******************\
    //      * init Login UI *
    //     \*******************/

    //     // FirebaseUI config.
    //     var uiConfig = {
    //         'signInSuccessUrl': false,
    //         'signInOptions': [
    //             // comment unused sign-in method
    //             firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //             firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //             firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //             // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //             firebase.auth.EmailAuthProvider.PROVIDER_ID
    //         ],
    //         // Terms of service url.
    //         'tosUrl': false,
    //     };

    //     // Initialize the FirebaseUI Widget using Firebase.
    //     var ui = new firebaseui.auth.AuthUI(firebase.auth());
    //     // The start method will wait until the DOM is loaded.
    //     ui.start('#firebaseui-auth-container', uiConfig);


    //     firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //     ////////////////////////////////////////

    // })   