// Pass data from firestore which is in auth.js
// Get UL tag
const guides = document.querySelector('.guides');
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const accountDetails = document.querySelector('.account-details');
const adminDetails = document.querySelectorAll('.admin');

const showGuidesOnUI = (data) => {
    if(data && data.length > 0){
        let html = '';
        data.forEach(doc => {
            const guide = doc.data();
            const li = `
            <li>
                <div class="collapsible-header grey lighten-4">${guide.title}</div>
                <div class="collapsible-body white">${guide.content}</div>
            </li>
            `;
            html += li;
        });
        guides.innerHTML = html;
    } else {
        guides.innerHTML = '<h5>Login to see game guides</h5>';
    }
};

const setupUI = (user) => {
    if(user) {
        // If useris admin then show create guide and admin form as well
        if(user.admin) {
            adminDetails.forEach(link => link.style.display = 'block');
        }
        // Update user information here
        // Also get bio users collection in firestore
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
                <div>Hey ${user.email}, Welcome</div>
                <div>My Bio - ${doc.data().bio}</div>
                <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
            `
            accountDetails.innerHTML = html;
        });
        // Toggle links here
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // Hide user information on logout
        accountDetails.innerHTML = '';
        adminDetails.forEach(link => link.style.display = 'none');
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}





// Show Modals using materialize
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });