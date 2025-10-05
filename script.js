let laptops = [];
let filteredLaptops = [];
let index = 0;
const BATCH_SIZE = 20;
let isFetching = false;

const container = document.getElementById("laptops");
const loader = document.getElementById("shop-loader");
const loadingText = document.getElementById("loading");
const message = document.getElementById("message");
const sortSelect = document.getElementById("sort");
sortSelect.value = "null";

async function fetchLaptops() {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbz3CqgfsrFfFxVihZppxcsJmefslpRNC_6L43cm-SZZ37idj98GEz8wwI7eokO-Ka4e/exec"
    );
    laptops = await response.json();
    filteredLaptops = [...laptops]; 
    console.log("Fetched laptops:", laptops.length);
     console.log("Filtered laptops:", filteredLaptops);

    loader.style.display = "none";
    loadingText.style.display = "none";
    container.style.display = "grid";

    index = 0;
    renderBatch();
    setupInfiniteScroll();
  } catch (err) {
    console.error("Error fetching laptops:", err);
    message.style.display = "block";
  }
}


function renderBatch() {
  if (isFetching) return;
  isFetching = true;

  const slice = filteredLaptops.slice(index, index + BATCH_SIZE);
  if (slice.length === 0) {
    isFetching = false;
    return;
  }

  const fragment = document.createDocumentFragment();

  slice.forEach(laptop => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${laptop.image}" alt="${laptop.name}" loading="lazy">
      <h3>${laptop.name}</h3>
      <p>${laptop.description}</p>
      <div class="price"><span class="new">₹${laptop.price}</span></div>
      <p class="emi">Easy EMI Available</p>
      <button onclick="window.open('https://wa.me/+919917930664', '_blank')">
        <i class="fa-brands fa-whatsapp"></i> Apply for EMI
      </button>
    `;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  index += BATCH_SIZE;
  isFetching = false;
}


function setupInfiniteScroll() {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
          if (index < filteredLaptops.length) {
            renderBatch();
          }
        }
        ticking = false;
      });
    }
  });
}


function applySortAndFilter(option) {
  filteredLaptops = [...laptops];

  // Apply your sorting/filtering logic
  switch(option) {
    case "lowtohigh":
      filteredLaptops.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "hightolow":
      filteredLaptops.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "intel":
      filteredLaptops = filteredLaptops.filter(l => (l.name + " " + l.description).toLowerCase().includes("intel"));
      break;
    case "ryzen":
      filteredLaptops = filteredLaptops.filter(l => (l.name + " " + l.description).toLowerCase().includes("ryzen"));
      break;
    case "windows":
      filteredLaptops = filteredLaptops.filter(l => (l.name + " " + l.description).toLowerCase().includes("win"));
      break;
    case "linux":
      filteredLaptops = filteredLaptops.filter(l => (l.name + " " + l.description).toLowerCase().includes("linux"));
      break;
    case "mac":
      filteredLaptops = filteredLaptops.filter(l => (l.name + " " + l.description).toLowerCase().includes("mac"));
      break;
    case "osothers":
      filteredLaptops = filteredLaptops.filter(l => {
        const text = (l.name + " " + l.description).toLowerCase();
        return !text.includes("win") && !text.includes("linux") && !text.includes("mac");
      });
      break;
    case "pothers":
      filteredLaptops = filteredLaptops.filter(l => {
        const text = (l.name + " " + l.description).toLowerCase();
        return !text.includes("intel") && !text.includes("ryzen");
      });
      break;
    default:
      break;
  }

  index = 0;
  container.innerHTML = "";

  // ✅ Handle "no laptops found" case
  if (filteredLaptops.length === 0) {
    message.style.display = "block";      // show a message
    container.style.display = "none";     // optionally hide grid
  } else {
    message.style.display = "none";       // hide message
    container.style.display = "grid";     // show grid
    renderBatch();
  }
}

// Listen for changes
sortSelect.addEventListener("change", (e) => {
  applySortAndFilter(e.target.value);
});

// Initial fetch
fetchLaptops();
