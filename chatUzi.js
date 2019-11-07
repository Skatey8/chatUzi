setTimeout(writeUser, 2000);
setTimeout(showUser, 1000);

let out = "";
let array = [];

const postRef = firebase.database().ref('posts/').limitToLast(25);
postRef.on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        array.push(
            {
                name: childSnapshot.val().name,
                photo: childSnapshot.val().photo,
                text: childSnapshot.val().text,
                timeStamp: childSnapshot.val().timeStamp,
                date: childSnapshot.val().date
            }
        );
    });

    array.sort(function (a, b) {
        return b.timeStamp - a.timeStamp
    });

    array.forEach(function (post) {
        out +=
            "<div class='postContainer'>" +
            "<div class='postColLeft'>" +
            "<img src='" + post.photo + "' height='42' width='42'>" +
            "</div>" +
            "<div class='postColRight'>" +
            "<div class='postUserInfo'>" +
            "<div>" + post.name + "</div>" +
            "<div>" + post.date + "</div>" +
            "</div>" +
            "<div class='postText'>" + post.text + "</div>" +
            "</div>" +
            "</div>"
    });
    snackbar("New message");
    document.getElementById("posts").innerHTML = out;
    document.getElementById("posts").scrollTop = 0;
    out = "";
    array = [];
});


function writeUser() {
    const database = firebase.database();
    const user = firebase.auth().currentUser;
    if (user) {
        database.ref('users/' + user.uid).set({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL
        }, function (error) {
            if (error) {
                console.log("The write failed...", error)
            } else {
                console.log("User data saved successfully!")
            }
        });
    }
}

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("Sign-out successful.");
    }).catch(function (error) {
        console.log(error);
    });
}

function showUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        document.getElementById("userPic").innerHTML = "<img src='" + user.photoURL + "' height='48' width='48'>";
    }
}


function post() {
    const database = firebase.database();
    const user = firebase.auth().currentUser;
    const timeStamp = Math.floor(Date.now());

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy;

    const text = document.getElementById("input").value;

    if (text !== '') {
        if (user) {
            database.ref('posts/' + '/' + timeStamp).set({
                name: user.displayName,
                photo: user.photoURL,
                text: text,
                timeStamp: timeStamp,
                date: today
            }, function (error) {
                if (error) {
                    console.log("The write failed...", error)
                } else {
                    console.log("Post saved successfully!")
                }
            });
        }
    }
    document.getElementById("input").value = '';
    document.getElementById("posts").scrollTop = 0;
}

function enter(event) {
    const x = event.which || event.keyCode;
    if (x === 13) {
        post();
    }
}

function snackbar(string) {
    const element = document.getElementById("snackbar");
    element.className = "show";
    document.getElementById("snackbar").innerHTML = string;
    setTimeout(function () {
        element.className = element.className.replace("show", "");
    }, 2000);
}

function redirectUnknownUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //do nothing
        } else {
            window.location = 'index.html';
        }
    });
}
