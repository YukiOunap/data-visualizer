document.addEventListener("DOMContentLoaded", () => {

    const loginFormDOM = document.getElementById('loginForm')

    loginFormDOM.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(loginFormDOM);

        const usernameOrEmail = formData.get("username");
        const password = formData.get("password")
        const encodedCredentials = btoa(`${usernameOrEmail}:${password}`);

        checkLogin(encodedCredentials);

    });
});

async function checkLogin(encodedCredentials) {
    const url = 'https://01.kood.tech/api/auth/signin';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Authorization failed');
        }
        const data = await response.json();

        // save JWT to localStorage
        localStorage.setItem('jwt', data);

        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Authorization failed");
    }
}