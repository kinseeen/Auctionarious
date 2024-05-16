import { get, put, post } from "./http.mjs";

async function getProfile(name) {
  const response = await get("auction/profiles/" + name);
  console.log(response);
  return response;
}

async function updateProfile(name, avatarUrl) {
  const response = await put("auction/profiles/" + name, {
    avatar: {
      url: avatarUrl,
      alt: "",
    },
  });
  console.log(response);
}

async function setProfileCard(profile) {
  document.getElementById("profileName").textContent = profile.data.name;
  document.getElementById("profileEmail").textContent = profile.data.email;
  document.getElementById("profileAvatar").src = profile.data.avatar.url;
  document.getElementById("credits").textContent += profile.data.credits;
  document.getElementById("totalCreditProfile").textContent += profile.data.credits;
}

document
  .getElementById("profileForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const avatar = document.getElementById("avatar").value;
    await updateProfile("kine", avatar);
    $("#myModal").modal("hide");

    // Refresh the page
    location.reload();
  });

const profile = await getProfile("kine");
setProfileCard(profile);
