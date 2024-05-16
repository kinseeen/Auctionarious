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
}

async function 

const profile = await getProfile("kine");
setProfileCard(profile);