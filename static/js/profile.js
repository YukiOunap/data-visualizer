import { fetchData } from "./fetchData.js";
import { drawXPbyTimeGraph, drawXPbyProjectGraph } from "./graph.js"

const jwt = localStorage.getItem('jwt');

document.addEventListener("DOMContentLoaded", async () => {

    if (!jwt) {
        console.error('No JWT token found');
        return;
    }

    displayUserData();

    displayXP();

    displayCompletedProjects();

    document.getElementById('filter_list').addEventListener('change', function () {
        var selectedValue = this.value;

        if (selectedValue === 'XPbyTime') {
            drawXPbyTimeGraph(jwt);
        } else if (selectedValue === 'XPbyProject') {
            drawXPbyProjectGraph(jwt);
        }
    });
    drawXPbyTimeGraph(jwt);

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('jwt');
        sessionStorage.removeItem('jwt');
        window.location.href = 'login.html';
    });

})

async function displayUserData() {

    const query = `
        {
            user {
                id
                login
                profile
                attrs
                createdAt
                campus
            }
        }`;
    const userData = await fetchData(jwt, query);

    if (userData && userData.user) {
        const profileDiv = document.getElementById('profile');
        const user = userData.user[0];

        profileDiv.innerHTML = `
            <h1>Welcome, ${user.login}</h1>
            <p>ID: ${user.id}</p>
            <p>Campus: ${user.campus}</p>
            <p>Email: ${user.attrs.email ? user.attrs.email : 'No email available'}</p>`;
    } else {
        console.error('User data not found');
    }
}

async function displayXP() {

    const query = `
        {
            transaction(
                where: {
                type: { _eq: "xp" }
                _and: [
                    { path: { _like: "/johvi/div-01/%" } }
                    { path: { _nlike: "/johvi/div-01/piscine-%" } }
                ]
                }
            ) {
                amount
            }
        }`;

    const XP = await fetchData(jwt, query);

    if (XP && XP.transaction) {
        const amounts = XP.transaction;
        const totalAmount = amounts.reduce((sum, item) => {
            return sum + item.amount;
        }, 0);
        console.log("XP", totalAmount);

        const XPdiv = document.getElementById('XP');
        XPdiv.innerHTML = `XP Amount: ${totalAmount}`;
    } else {
        console.error('XP data not found');
    }
}

async function displayCompletedProjects() {

    const query = `
        {
            result(where: { type: { _eq: "user_audit" } })  {
                id
                object{
                    name
                }
            }
        }`;


    const data = await fetchData(jwt, query);

    if (data && data.result) {
        const projects = data.result;
        const projectDiv = document.getElementById('projects');
        const projectTemplate = (projectName) => `
            <li class="project">${projectName}</li>`;

        projects.forEach(project => {
            const projectHTML = projectTemplate(project.object.name);
            projectDiv.insertAdjacentHTML('beforeend', projectHTML);
        });
    } else {
        console.error('Projects data not found');
    }
}