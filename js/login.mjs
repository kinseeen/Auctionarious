import { get, put, post } from "./http.mjs";

async function loginUser(email, password) {
  const response = await post("auth/login", {
    email: email,
    password: password,
  });

  localStorage.setItem("token", response.data.accessToken);
  console.log(response.data.accessToken);
  window.location.href = "html/profile.html";
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("typeEmailX-2").value;
    const password = document.getElementById("typePasswordX-2").value;
    await loginUser(email, password);
  });
