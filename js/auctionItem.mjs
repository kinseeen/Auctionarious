import { addNavBar } from './topNavigationBar.mjs';
import { get } from './http.mjs';


window.onload = async function () {
    addNavBar();
}


async function getAuctionItem(id) {
    const response = await get("auction/listings/" + id, false);
    console.log(response);
    const title = response.data.title;
    const description = response.data.description;
    const mainImage = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media[0].url;
    const allImages = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media;
    console.log(allImages);

    for (let i = 0; i < allImages.length; i++) {
        document.getElementById("miniImages").innerHTML += `
        <div class="border mx-1 rounded-2 item-thumb" style="cursor: pointer;"
    onclick="event.preventDefault(); document.getElementById('mainImage').children[0].children[0].src='${allImages[i].url}';">
    <img style="object-fit: cover; width: 60px; height: 60px;" class="rounded-2"
        src="${allImages[i].url}" />
</div>
        `
    }

    document.getElementById("mainImage").innerHTML = `
    <div data-fslightbox="mygalley" class="rounded-4" data-type="image"
    style="cursor: pointer;">
    <img style="max-width: 100%; max-height: 100vh; margin: auto;" class="rounded-4 fit"
        src="${mainImage}" />
</div>
    `
    document.getElementById("textContent").innerHTML = `
    <div class="ps-lg-3">
                        <h4 class="title text-dark">
                            ${title}
                        </h4>
                    </div>
                    <p>
                        ${description}
                    </p>
                    <hr />
                    
                    <div class="col-md-4 col-6 mb-3">
                        <label class="mb-2 d-block"> Bid Now </label>
                        <div class="input-group mb-3" style="width: 170px;">
                            <input type="text" class="form-control text-center border border-secondary" placeholder="14"
                                aria-label="Example text with button addon" aria-describedby="button-addon1" />
                            <button class="btn btn-primary" type="button"> Bid Now </button>
                        </div>
                    </div>`;

}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
getAuctionItem(id);



