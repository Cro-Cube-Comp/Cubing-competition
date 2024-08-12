import { url } from "./Scripts/variables.js";
import {
  tokenValid,
  isAdmin,
  getUsername,
  getRole,
  logOut,
  loggedIn,
  addToken,
} from "./Scripts/credentials.js";
const cardsDiv = document.querySelector(".cards");
async function getPosts() {
  // Returns json of posts
  const data = await fetch(`${url}/posts`);
  const posts = await data.json();
  return posts;
}
function createCardElement(
  title = undefined,
  description = undefined,
  authorUsername = undefined
) {
  if (!title || !description) {
    throw new Error("Title and description are required.");
  }
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  const cardInsideContainer = document.createElement("div");
  cardInsideContainer.classList.add("card-inside-container");
  cardElement.appendChild(cardInsideContainer);
  const postTitleContainer = document.createElement("div");
  postTitleContainer.classList.add("post-title-container");
  const postTitle = document.createElement("h2");
  postTitle.classList.add("post-title");
  postTitle.textContent = title;
  postTitleContainer.appendChild(postTitle);
  cardInsideContainer.appendChild(postTitleContainer);
  const postDescriptionContainer = document.createElement("div");
  postDescriptionContainer.classList.add("post-description-container");
  const postDescription = document.createElement("p");
  postDescription.classList.add("post-description");
  postDescription.innerHTML = description;
  postDescriptionContainer.appendChild(postDescription);
  cardInsideContainer.appendChild(postDescriptionContainer);
  if (authorUsername) {
    const postAuthorContainer = document.createElement("div");
    postAuthorContainer.classList.add("post-author-container");
    const postAuthorP = document.createElement("p");
    postAuthorP.classList.add("post-author-p");
    const postAuthor = document.createElement("span");
    postAuthor.classList.add("post-author");
    postAuthor.textContent = authorUsername;
    postAuthorP.appendChild(postAuthor);
    postAuthorContainer.appendChild(postAuthorP);
    cardInsideContainer.appendChild(postAuthorContainer);
  }
  return cardElement;
}
function addDashboardCard() {
  const dashboardCard = createCardElement(
    "Radna ploča",
    `<p> Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p>`
  );
  cardsDiv.appendChild(dashboardCard);
}
function addCreatePostCard() {
  const createPostCard = createCardElement(
    "Objava",
    `<p>Ti si admin! Oni mogu objaviti bilo što! Klikni <a href="./posts">ovdje</a> da objaviš nešto.</p>`
  );
  cardsDiv.appendChild(createPostCard);
}
function generateLogOutCard(username = getUsername()) {
  if (!username) return;
  // Generate and insert log out card
  const logOutCard = createCardElement(
    "Odjavi se",
    `<p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p>`
  );
  cardsDiv.appendChild(logOutCard);
  // Add event listener to log out span
  const logOutSpan = document.querySelector(".logout-span");
  logOutSpan.addEventListener("click", async () => {
    logOut(true);
  });
}

document.querySelector(".share").addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Dođi na natjecanje!",
      text: `Zagreb međuškolsko 2024 (neslužbeno) u slaganje Rubikove kocke

      Bit će 3.5. u dvorani Oš. Pavleka Miškine
      14-16:30
      
      Smiju se natjecati samo OSNOVNOŠKOLCI.
      
      Natjecateljsko ograničenje je 50, ako ga se prijeđe bit ćete stavljeni na listu čekanja.
      
      Želite li se prijaviti (ime, prezime, škola, razred ) ili imate pitanja pošaljite na cro.cube.club@gmail.com
      `,
      url: "https://cutt.ly/CroComp",
    });
    console.log("Successfully shared");
  } else {
    alert(
      "Ovaj uređaj ne može dijeliti. Preporučuje se najnovija verzija Google Chrome-a."
    );
  }
});
function createPostCardElement(post) {
  const { title, description } = post;
  const authorUsername = post.author.username;
  const postCard = createCardElement(
    title,
    `<p class="post-description">${description}</p>`,
    authorUsername
  );
  return postCard;
}
async function checkIfLoggedInAndTokenValid() {
  if (loggedIn() && !(await tokenValid())) {
    logOut();
    window.location.href = "./Login";
  }
}
function addCompDashboardCard() {
  const compDashboardCard = createCardElement(
    "Natjecanja",
    `<p>Ti si admin! Možeš kreirati i uređivati natjecanje. Klikni <a href="./competitions-dashboard">ovdje</a>.</p>`
  );
  cardsDiv.appendChild(compDashboardCard);
}
async function main() {
  checkIfLoggedInAndTokenValid();
  const posts = await getPosts();
  posts.forEach((post) => {
    const postCardElement = createPostCardElement(post);
    cardsDiv.appendChild(postCardElement);
  });
}
const logInElement = document.querySelector(".js-log-in");
const username = getUsername();
const role = getRole();
if (role && isAdmin(role)) {
  addDashboardCard();
  addCreatePostCard();
  addCompDashboardCard();
}
if (username) {
  logInElement.innerHTML = username;
}
const accountCircle = document.querySelector(".account-circle");

if (username) {
  accountCircle.addEventListener("click", async () => {
    logOut(true);
  });
  const root = document.querySelector(":root");
  root.style.setProperty("--logged-in", "pointer");
}
if (loggedIn()) generateLogOutCard();
main();
