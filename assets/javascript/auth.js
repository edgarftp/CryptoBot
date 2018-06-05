

  // Initialize Firebase


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





