        // firebase config
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyB_gHsrrFKG_qgTUzD6w7Ybuqbfw0ayH8I",
            authDomain: "cryptobot-firebase.firebaseapp.com",
            databaseURL: "https://cryptobot-firebase.firebaseio.com",
            projectId: "cryptobot-firebase",
            storageBucket: "cryptobot-firebase.appspot.com",
            messagingSenderId: "447326953953"
          };
          firebase.initializeApp(config);

        /////////////////////////////////////


        /**********************\
         * Check login status *
        \**********************/

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) { // if already logged in
                window.location.href = 'profile.html';
            }
        });

      


        /*******************\
         * init Login UI *
        \*******************/

        // FirebaseUI config.
        var uiConfig = {
            'signInSuccessUrl': false,
            'signInOptions': [
                // comment unused sign-in method
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            'tosUrl': false,
        };

        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);


        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
        ////////////////////////////////////////