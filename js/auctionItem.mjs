import { addNavBar, setCredits } from './topNavigationBar.mjs';
import { get, post, put } from './http.mjs';
import { getProfile } from './profileModule.mjs';


window.onload = async function () {
    await addNavBar();
    if (!hasValidToken()) {
        document.getElementById("credits").style.visibility = "hidden";
        document.getElementById("bidInput").style.visibility = "hidden";
        document.getElementById("bidButton").style.visibility = "hidden";
        document.getElementById("listOfBids").style.visibility = "hidden";
        document.getElementById("profileButton").style.visibility = "hidden";
        document.getElementById("logoutButton").textContent = "Back to login";
        document.getElementById("logoutButton").onclick = function () {
          window.location.href = "/index.html";
        }
      }
    setCredits();
}

function isMyListing(name) {
    return localStorage.getItem("name") === name;

}

function hasValidToken() {
    const token = localStorage.getItem("token");

    return token !== null;

}



function listBids(bids, listingHasEnded = false) {
    bids = bids.reverse();
    console.log(bids);
    if (bids.length < 1) {
        document.getElementById("listOfBids").innerHTML = `
        <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">No bids yet</h5>
                    </div>
                    
                </a>
            </div>
        `
        return;
    }

    const highestBidderBanner = listingHasEnded ? 'Winner' : 'Highest Bidder';
    for (let i = 0; i < bids.length; i++) {
        console.log(bids[i]);

        document.getElementById("listOfBids").innerHTML += `
        <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <img src="${bids[i].bidder.avatar.url}" alt="Avatar" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;">
                    <div>
                        <h5 class="mb-1">${bids[i].bidder.name}</h5>
                        <p class="mb-1">Amount: ${bids[i].amount}</p>
                    </div>
                </div>
                ${i === 0 ? '<span style="color: #81c784; font-weight: bold;">' + highestBidderBanner + '</span>' : ''}
            </div>
        </a>
    </div>
    `

    }
}


async function getAuctionItem(id, showBids = true, showSeller = true) {
    const response = await get("auction/listings/" + id + "?_bids=" + showBids + "&_seller=" + showSeller, false);
    const title = response.data.title;
    const description = response.data.description;
    const mainImage = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media[0].url;
    const allImages = response.data.media.length < 1 ? "https://via.placeholder.com/300" : response.data.media;
    const myListing = isMyListing(response.data.seller.name);

    if (!myListing) {
        document.getElementById("editListingButton").style.display = "none";
    }
    const listOfTags = response.data.tags;
    if (listOfTags.length < 1) {
        document.getElementById("tags").innerHTML = ` `
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
    const listingHasEnded = response.data.endsAt < new Date().toISOString()
    listBids(response.data.bids, listingHasEnded);
    console.log(response.data.endsAt);
    console.log(new Date().toISOString());
    if (listingHasEnded) {
        // add element to indicate that the listing has ended
        document.getElementById("bidButton").disabled = true;
        document.getElementById("bidInput").disabled = true;
        const banner = document.createElement('div');
        banner.textContent = 'This listing has ended';
        banner.style.backgroundColor = '#e57373';
        banner.style.color = 'white';
        banner.style.padding = '10px';
        banner.style.textAlign = 'center';
        document.body.prepend(banner);

    }
    document.getElementById("newListingTitle").value = title
    document.getElementById("newListingDescription").value = description
    document.getElementById("newListingTags").value = listOfTags.join(", ");
    document.getElementById("newListingEndsAt").value = new Date(response.data.endsAt).toISOString().slice(0, 16);
    for (let i = 0; i < allImages.length; i++) {
        var mediaContainer = document.getElementById('mediaContainer');
        var newPair = document.createElement('div');
        newPair.className = 'mediaPair';

        newPair.innerHTML = `
  
        <div class="form-group row input-pair">
  <div class="col-sm-10">
    <div class="row">
      <label for="mediaUrl${i + 1}" class="col-sm-2 col-form-label">Url${i + 1}:</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="newListingMediaUrl${i + 1}">
      </div>
    </div>
    <div class="row">
      <label for="mediaAlt${i + 1}" class="col-sm-2 col-form-label">Alt${i + 1}:</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="newListingMediaAlt${i + 1}">
      </div>
    </div>
  </div>
  <div class="col-sm-2 d-flex align-items-center justify-content-center">
    <button class="btn btn-danger remove-button" type="button">-</button>
  </div>
</div>
  
  `
        mediaContainer.appendChild(newPair);
        document.getElementById(`newListingMediaUrl${i + 1}`).value = allImages[i].url;
        document.getElementById(`newListingMediaAlt${i + 1}`).value = allImages[i].alt;




    }

    document.querySelectorAll('.remove-button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Remove the pair of inputs

            event.target.closest('.mediaPair').remove();
            document.querySelectorAll('.input-pair').forEach(function (pair, index) {

                pair.querySelector('label[for^="mediaUrl"]').textContent = 'Url' + (index + 1) + ':';
                pair.querySelector('label[for^="mediaUrl"]').id = 'mediaUrl' + (index + 1);
                pair.querySelector('input[id^="newListingMediaUrl"]').id = 'newListingMediaUrl' + (index + 1);
                pair.querySelector('label[for^="mediaAlt"]').textContent = 'Alt' + (index + 1) + ':';
                pair.querySelector('label[for^="mediaAlt"]').id = 'mediaAlt' + (index + 1);
                pair.querySelector('input[id^="newListingMediaAlt"]').id = 'newListingMediaAlt' + (index + 1);
            });
        });
    });


}

document.getElementById('addMediaPair').addEventListener('click', function () {
    var mediaContainer = document.getElementById('mediaContainer');
    var newPair = document.createElement('div');
    newPair.className = 'mediaPair';
    var pairNumber = document.getElementsByClassName('mediaPair').length + 1;
    newPair.innerHTML = `
    
    <div class="form-group row input-pair">
    <div class="col-sm-10">
      <div class="row">
        <label for="mediaUrl${pairNumber}" class="col-sm-2 col-form-label">Url${pairNumber}:</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="newListingMediaUrl${pairNumber}">
        </div>
      </div>
      <div class="row">
        <label for="mediaAlt${pairNumber}" class="col-sm-2 col-form-label">Alt${pairNumber}:</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="newListingMediaAlt${pairNumber}">
        </div>
      </div>
    </div>
    <div class="col-sm-2 d-flex align-items-center justify-content-center">
      <button class="btn btn-danger remove-button" type="button">-</button>
    </div>
  </div>
    
    `

    mediaContainer.appendChild(newPair);
    document.querySelectorAll('.remove-button').forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Remove the pair of inputs

            event.target.closest('.mediaPair').remove();
            document.querySelectorAll('.input-pair').forEach(function (pair, index) {

                pair.querySelector('label[for^="mediaUrl"]').textContent = 'Url' + (index + 1) + ':';
                pair.querySelector('label[for^="mediaUrl"]').id = 'mediaUrl' + (index + 1);
                pair.querySelector('input[id^="newListingMediaUrl"]').id = 'newListingMediaUrl' + (index + 1);
                pair.querySelector('label[for^="mediaAlt"]').textContent = 'Alt' + (index + 1) + ':';
                pair.querySelector('label[for^="mediaAlt"]').id = 'mediaAlt' + (index + 1);
                pair.querySelector('input[id^="newListingMediaAlt"]').id = 'newListingMediaAlt' + (index + 1);
            });
        });
    });
});

async function updateListing() {
    const title = document.getElementById("newListingTitle").value;
    const description = document.getElementById("newListingDescription").value;
    const tags = document.getElementById("newListingTags").value.split(",");
    const mediaList = [];
    const mediaPairs = document.getElementsByClassName('mediaPair');
    for (let i = 0; i < mediaPairs.length; i++) {
        const mediaUrl = document.getElementById(`newListingMediaUrl${i + 1}`).value;
        const mediaAlt = document.getElementById(`newListingMediaAlt${i + 1}`).value;
        mediaList.push({ url: mediaUrl, alt: mediaAlt });
    }
    const endsAt = document.getElementById("newListingEndsAt").value;
    const data = {
        title: title,
        description: description,
        tags: tags,
        media: mediaList,
        endsAt: endsAt
    }
    console.log(data);
    return await put("auction/listings/" + id, data);
}


document.getElementById("updateListingButton").addEventListener("click", async function () {
    const response = await updateListing();

    location.reload();

});

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



