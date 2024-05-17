import { get } from "./http.mjs";
import { addNavBar } from "./topNavigationBar.mjs";


async function getAuctionListings() {
  const response = await get("auction/listings?sortOrder=desc&sort=created", false);
  return response;
}


async function setCredits() {
  const credits = await localStorage.getItem("credits");
  console.log(credits);
  document.getElementById("credits").textContent += credits;
}

window.onload = async function () {

  await addNavBar();
  setCredits();

}

async function setAuctionListings() {
  var auctionListings = await getAuctionListings();
  

  
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
        <div class="badge bg-dark text-white position-absolute" style="bottom: 0.5rem; right: 0.5rem">${listing._count.bids} bids</div>
        <img class="card-img-top" src="${image}" alt="..." />
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

document.getElementById("newListingButton").addEventListener("click", async (event) => {
  console.log("new listing button clicked");
});

setAuctionListings();

