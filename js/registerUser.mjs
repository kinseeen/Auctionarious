import { get, put, post } from "./http.mjs";

async function registerUser(name, email, password, avatarUrl) {
 
  if (!email.endsWith("stud.noroff.no")) {
    return "The email must be of type stud.noroff.no";
  }

  const user = {
    name,
    email,
    password,
    avatar : {
      url: avatarUrl,
    

    },
  };

  console.log(user);
return await post("auth/register", user, false);


}

document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Registering user...");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const avatarUrl = document.getElementById("avatar").value;
    const result = await registerUser(name, email, password, avatarUrl =='' ? "https://via.placeholder.com/300" : avatarUrl);
    if (typeof result === "string") {
      document.getElementById("emailError").textContent = result;
    } 
    
    else if (result.errors) {
      document.getElementById("registrationError").textContent = result.errors[0].message;
    } else {
      window.location.href = "/index.html";
    }
    

    

  });
