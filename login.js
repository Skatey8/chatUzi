var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return true;
        },
        uiShown: function() {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'default',
    signInSuccessUrl: 'chatUzi.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

function redirectRememberedAccount() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location='chatUzi.html';
        } else {
            //do nothing
        }
    });
}
