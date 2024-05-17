

async function addNavBar() {
    await fetch('/html/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('myNavbar').innerHTML = data;
        });
    document.getElementById('logoutButton').addEventListener('click', logout);
}

async function setCredits() {
    const credits = await localStorage.getItem("credits");
    console.log(credits);
    document.getElementById("credits").textContent += credits;
  }

function logout() {
    localStorage.clear();
    window.location.href = "/index.html";
}

export { addNavBar, logout, setCredits }