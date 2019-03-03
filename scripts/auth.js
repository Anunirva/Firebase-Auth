// Authentication Logic

// *******************Signup************************
// Get signup form
const signupForm = document.querySelector('#signup-form');
// add event listener, we need it on submit
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // get values from the form
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const bio = signupForm['signup-bio'].value;
    // createuserwithemailandpassword  async method takes credentials and create user
    // in database
    auth.createUserWithEmailAndPassword(email, password).then(data => {
        // On Signup, add details of users bio in firestores diff collection
        // For that create one collection names 'users'
        // this users collection will have a document whose id will be set by us 
        // not automatically assigned
        // will create one doc with custom id
        return db.collection('users').doc(data.user.uid).set({
            bio: bio
        })
    }).then(data => {
        // Once submit close the modal and reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();        
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
        signupForm.querySelector('.error').innerHTML = error.message;
    })
});


// ***************************Signout*******************
const signOut = document.querySelector('#logout');
signOut.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});


// ********************** SignIn****************
// Get signinform
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(data => { 
        // Close Modal and reset Form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();        
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(error => {
        loginForm.querySelector('.error').innerHTML = error.message;
    })
});



// Listen for auth state changes ie. user logged in or not
auth.onAuthStateChanged(user => {
    if(user) {
        // Show guides in html only if user is logged in
        // Get Data from firestore
        //   ---> Collection name 'guides'
        // do all DOM related stuff in index.js so pass data to method in index.js
        // db.collection().get().then  -> fetched data , 
        // to fetch realtime data use onSnapshot
        // db.collection('guides').get().then(data => {
        //     showGuidesOnUI(data.docs);
        //     setupUI(user);
        // });
        // **** check if the user is admin or not from the toke
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });
        db.collection('guides').onSnapshot(data => {
            showGuidesOnUI(data.docs);
        }, err => console.log(err.message));
    } else {
        console.log("User SignedOut");
        // If not logged in send empty
        showGuidesOnUI([]);
        setupUI();
    }
});



// Craete Guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(data => {
        console.log("Added Guide", data);
        // Close modal and reset form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(error => {
        console.log(error);
    })
});


// ******************* Making user as Admin *********************
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = adminForm['admin-email'].value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email: email}).then(result => {
        console.log(result);
        // Reset form once successfull
        adminForm.reset();
    })
})



























// Create user
// async function createUser(email,password) {
//    try {
//     const data = await auth.createUserWithEmailAndPassword(email, password);
//     return data;
//    } catch(error) {
//     console.log('error:', error);
//    } 
// }