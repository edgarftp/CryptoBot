
    const auth = firebase.auth();

    const btnLogOut = document.getElementById('btnLogOut');

    btnLogOut.addEventListener('click', e => {
       
        e.preventDefault();

        firebase.auth().signOut();

    });

