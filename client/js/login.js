// const button = document.querySelector(".btn");

// button.addEventListener("click", (e) => {
//     e.preventDefault();
//     let email = document.getElementById("email").value;
//     let loginCode = document.getElementById("loginCode").value;
//     const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

//     if (!email || !loginCode) return alert("Please fill up both fields before proceeding!");
//     if (!validEmailRegex.test(email)) return alert("Please provide a valid email address!");


//     axios({
//         method: 'post',
//         url: '/api/user/login',
//         data: {
//             email,
//             loginCode
//         }
//     }).then(response => {
//         console.log(response);
//         const token = response.data.token;
//         localStorage.setItem('token', token);
    
//         // Include token in subsequent requests
//         axios({
//             method: 'get', 
//             url: '/admin',
//             headers: {
//                 Authorization: `Bearer ${token}` // Attach the token here
//             }
//         }).then(adminResponse => {
//             // Handle successful response for admin route
//             console.log(adminResponse);
//             console.log(response.data.data.user.role)
//             if (response.data.data.user.role === "admin") {
//                         window.location.href = '/admin'; // Redirect to admin page
//                     } else {
//                         window.location.href = '/vote'; // Redirect to vote page
//                     }
//         }).catch(adminError => {
//             // Handle error for admin route
//             console.log(adminError);
//             if (adminError.response.status === 401) {
//                 alert("Unauthorized access to admin page!");
//             } else {
//                 alert("Error accessing admin page!");
//             }
//         });
    
//     }).catch(error => {
//         if (error.response.status === 404) {
//             alert("User with the specified email not registered!");
//         } else if (error.response.status === 401) {
//             alert("Incorrect Login Code!");
//         } else if (error.response.status === 500) {
//             alert("Unexpected error occurred! Check console for more details!");
//         }
//         console.log(error);
//     });
    
  
// });

const button = document.querySelector(".btn");

button.addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let loginCode = document.getElementById("loginCode").value;
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email || !loginCode) return alert("Please fill up both fields before proceeding!");
    if (!validEmailRegex.test(email)) return alert("Please provide a valid email address!");

    axios({
        method: 'post',
        url: '/api/user/login',
        data: {
            email,
            loginCode
        }
    }).then(response => {
        console.log("Login response:", response);
        const token = response.data.token;
        const userRole = response.data.data.user.role; // Assuming the role is part of the login response

        localStorage.setItem('token', token);

        // Redirect based on the user role
        if (userRole === "admin") {
            window.location.href = '/admin'; // Redirect to admin page
        } else {
            window.location.href = '/vote'; // Redirect to vote page
        }
    }).catch(error => {
        if (error.response && error.response.status === 404) {
            alert("User with the specified email not registered!");
        } else if (error.response && error.response.status === 401) {
            alert("Incorrect Login Code!");
        } else if (error.response && error.response.status === 500) {
            alert("Unexpected error occurred! Check console for more details!");
        }
        console.log("Login error:", error);
    });
});
