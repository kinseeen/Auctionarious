import { addNavBar, setCredits } from './topNavigationBar.mjs';
import { get, post } from './http.mjs';
import { getProfile } from './profileModule.mjs';


window.onload = async function () {
    await addNavBar();
    setCredits();
}


async function getAuctionItem(id) {
    const response = await get("auction/listings/" + id, false);
    console.log(response);
    const title = response.data.title;
    const description = response.data.description;
    const mainImage = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media[0].url;
    const allImages = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media;

    const listOfTags = response.data.tags;
    if (listOfTags.length < 1) {
        document.getElementById("tags").innerHTML = `
       
        `
    } else {
        for (let i = 0; i < listOfTags.length; i++) {
            console.log(listOfTags[i]);
            document.getElementById("tags").innerHTML += `
        <span class="badge badge-secondary">${listOfTags[i]}</span>
        `
        }
    }
    if (response.data.media.length >= 1) {

        for (let i = 0; i < allImages.length; i++) {
            document.getElementById("miniImages").innerHTML += `
        <div class="border mx-1 rounded-2 item-thumb" style="cursor: pointer;"
    onclick="event.preventDefault(); document.getElementById('mainImage').children[0].children[0].src='${allImages[i].url}';">
    <img style="object-fit: cover; width: 60px; height: 60px;" class="rounded-2"
        src="${allImages[i].url}" />
</div>
        `
        }
    }

    document.getElementById("mainImage").innerHTML = `
    <div data-fslightbox="mygalley" class="rounded-4" data-type="image"
    style="cursor: pointer;">
    <img style="max-width: 100%; max-height: 100vh; margin: auto;" class="rounded-4 fit"
        src="${mainImage}" />
</div>
    `
    document.getElementById("titleText").textContent = title;
    document.getElementById("descriptionText").textContent = description;


}



const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
getAuctionItem(id);

document.getElementById("bidButton").addEventListener("click", async function () {
    const bid = document.getElementById("bidInput").value;
    const response = await post("auction/listings/" + id + "/bids", {
        amount: parseInt(bid, 10)
    });
    if (response.errors) {
        // Set the alert message in the modal
        document.querySelector('.modal-body').textContent = response.errors[0].message;
        // Show the modal
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
        myModal.show();
    } else {
        await getProfile(localStorage.getItem("name"));
        location.reload();

        
    }
    //location.reload();
});

