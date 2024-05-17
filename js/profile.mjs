import { get, put, post } from "./http.mjs";
import { addNavBar } from "./topNavigationBar.mjs";
import { getProfile, updateProfile } from "./profileModule.mjs";





window.onload = async function () {
  addNavBar();
}

async function setProfileCard(profile) {
  document.getElementById("profileName").textContent = profile.data.name;
  document.getElementById("profileEmail").textContent = profile.data.email;
  document.getElementById("profileAvatar").src = profile.data.avatar.url;
  document.getElementById("credits").textContent += profile.data.credits;
  document.getElementById("totalCreditProfile").textContent += profile.data.credits;
  document.getElementById("bidWins").textContent += profile.data._count.wins;
  document.getElementById("bidListings").textContent += profile.data._count.listings;
}



async function loadProfile() {
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const avatar = document.getElementById("avatar").value;
      const name = await localStorage.getItem("name");
      await updateProfile(name, avatar);
      $("#myModal").modal("hide");

      // Refresh the page
      location.reload();
    });
  const name = localStorage.getItem("name");
  const profile = await getProfile(name);
  setProfileCard(profile);
}

loadProfile();
export { getProfile }