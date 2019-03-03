const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


// // Create method here --> adding custom role like admin
exports.addAdminRole = functions.https.onCall((data, context) => {
    // here data is the value we send from frontend
    // Context gives info about logged in user
    // Now get user and add admin role
    // Check the request is only made by admin, only admin can add others
    if(context.auth.token.admin !== true) {
        return {error: 'Only Admins can add other admins'}
    }
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            message: `Success ${data.email} has been added as an admin`
        }
    }).catch(err => {
        return err;
    })
})





/// Firebase basics
// Use firebase logout if u want to use another account
// firebase login to login now
// firebase init functions  -> getting functions folder
// then select firebase project
// then do npm i for required dependencies
// Once the functions are over, deploy them to firebase
// firebase deploy --only functions