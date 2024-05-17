

async function addNavBar() {
    await fetch('/html/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('myNavbar').innerHTML = data;
        });
    document.getElementById('logoutButton').addEventListener('click', logout);
}

function logout() {
    localStorage.clear();
    window.location.href = "/index.html";
}

export { addNavBar, logout };