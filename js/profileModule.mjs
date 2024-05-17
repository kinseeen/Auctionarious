import { get, put, post } from "./http.mjs";


async function getProfile(name) {
    const response = await get("auction/profiles/" + name);


    // store credits in local storage
    console.log(response.data.credits)
    localStorage.setItem("credits", response.data.credits);

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
  

export { getProfile, updateProfile }