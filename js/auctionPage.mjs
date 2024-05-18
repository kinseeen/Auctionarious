import { get, post } from "./http.mjs";
import { addNavBar } from "./topNavigationBar.mjs";


async function getAuctionListings() {
  const response = await get("auction/listings?sortOrder=desc&sort=created", false);
  return response;
}

function hasValidToken() {
  const token = localStorage.getItem("token");
  
  return token !== null;

}

async function setCredits() {
  const credits = await localStorage.getItem("credits");
  console.log(credits);
  document.getElementById("credits").textContent += credits;
}

function showToasts(message, offset = 0) {
  // Create the toast div
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.top = offset + 'px';


  // Add the toast to the top of the body
  document.body.insertBefore(toast, document.body.firstChild);



  // After 3 seconds, remove the toast
  setTimeout(function () {

    document.body.removeChild(toast);
  }, 3000);
}


async function createAuctionListing(title, description, tags, mediaList, endsAt) {



  const response = await post("auction/listings", {
    title: title,
    description: description,
    tags: tags,
    media: mediaList,
    endsAt: endsAt
  });
  if (response.statusCode >= 400) {
    for (var i = 0; i < response.errors.length; i++) {
      var error = response.errors[i];
      showToasts(error.message, 100 * i);
    }



  } else {
    location.reload();
  }

}


window.onload = async function () {

  await addNavBar();
  await loadActionListings();
  
  setCredits();

}

document.getElementById("listingSearchButton").addEventListener("click", async function () {
  var searchValue = document.getElementById("listingSearch").value;
  if (searchValue !== "") {
  searchListings(searchValue);
  } else {
    loadActionListings();
  
  }
});

async function searchListings(searcdValue) {
  const getAuctionListings = await get("auction/listings/search?sortOrder=desc&sort=created&q=" + searcdValue, false);
  reloadActuionListings(getAuctionListings);
  


}

async function loadActionListings() {
  
  if (!hasValidToken()) {
    document.getElementById("credits").style.visibility = "hidden";

    document.getElementById("newListingButton").style.visibility = 'hidden';
    document.getElementById("profileButton").style.visibility = "hidden";
    document.getElementById("logoutButton").textContent = "Back to login";
    document.getElementById("logoutButton").onclick = function () {
      window.location.href = "/index.html";
    }
  }
  var auctionListings = await getAuctionListings();
  reloadActuionListings(auctionListings);



  

}

function reloadActuionListings(auctionListings) {
  document.getElementById("auctionListings").innerHTML = "";
  for (var i = 0; i < auctionListings.data.length; i++) {
    var listing = auctionListings.data[i]
    var image = listing.media.length < 1 ? "https://via.placeholder.com/300" : listing.media[0].url;
    var description = listing.description;
    var descriptionMaxLength = 100;
    var isNew = new Date(listing.created).getTime() > new Date().getTime() - 1000 * 60 * 60 * 6;
    var newListingBanner = '<div class="badge bg-success text-white position-absolute" style="top: 0.5rem; left: 0.5rem">NEW</div>'
    if (description.length > descriptionMaxLength) {
      description = description.substring(0, descriptionMaxLength) + "...";
    }
    document.getElementById("auctionListings").innerHTML += `
    <div class="col mb-5">
    <div class="card h-100">
        <!-- Product image-->
        ${isNew ? newListingBanner : ""}
        ${hasValidToken() ? '<div class="badge bg-dark text-white position-absolute" style="bottom: 0.5rem; right: 0.5rem">' + listing._count.bids + ' bids</div>' : ""} 
        <img class="card-img-top" src="${image}" alt="..." style="max-height: 250px; width: 100%; object-fit: cover;"/>
        <!-- Product details-->
        <div class="card-body p-4">
            <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">${listing.title}</h5>
                <!-- Product price-->
               ${description}
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="btn btn-outline-dark mt-auto" id="purchaseButton" href="/html/auctionItem.html?id=${listing.id}">View item</a>
            </div>
        </div>
    </div>
    </div>`;
  }
  
}


var mediaList = [];

document.getElementById("createNewListing").addEventListener("click", async (event) => {
  event.preventDefault();
  var title = document.getElementById("newListingTitle").value;
  var description = document.getElementById("newListingDescription").value;
  var tags = document.getElementById("newListingTags").value.split(",");
  mediaList = [];

  var mediaPairs = document.getElementsByClassName('mediaPair');
  for (var i = 0; i < mediaPairs.length; i++) {
    console.log(`newListingMediaUrl${i + 1}`)
    var mediaUrl = document.getElementById(`newListingMediaUrl${i + 1}`).value;
    var mediaAlt = document.getElementById(`newListingMediaAlt${i + 1}`).value;
    mediaList.push({ url: mediaUrl, alt: mediaAlt });
  }
  var endsAt = document.getElementById("newListingEndsAt").value;
  await createAuctionListing(title, description, tags, mediaList, endsAt);

});

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



