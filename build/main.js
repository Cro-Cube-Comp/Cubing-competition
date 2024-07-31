import { url } from "./Scripts/variables.js";
import {
  sessionValid,
  isAdmin,
  getUsername,
  getRole,
  logOut,
  loggedIn,
} from "./Scripts/credentials.js";
const cardsDiv = document.querySelector(".cards");
async function getPosts() {
  // Returns json of posts
  const data = await fetch(`${url}/posts`);
  const posts = await data.json();
  return posts;
}
function createCard(
  title = undefined,
  description = undefined,
  authorUsername = undefined
) {
  if (!title || !description) {
    throw new Error("Title and description are required.");
  }
  return `
  <div class="card">
        <div class="card-inside-container">
          <div class="post-title-container">
            <h2 class="post-title">${title}</h2>
          </div>
          <div class="post-description-container">
            <p>
              ${description}
            </p>
          </div>
          ${
            authorUsername
              ? `<div class="post-author-container">
        <p class="post-author-p">Objavio <span class="post-author">${authorUsername}</span>
        </p>
      </div>`
              : ""
          }
        </div>
      </div>
  `;
}
function addDashboardCard() {
  let html = "";
  html += createCard(
    "Radna ploča",
    `<p> Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p>`
  );
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
}
function addCreatePostCard() {
  const html = createCard(
    "Objava",
    `<p>
      Ti si admin! Oni mogu objaviti bilo što!
      Klikni <a href="./posts">ovdje</a> da objaviš nešto.
    </p>`
  );
  cardsDiv.insertAdjacentHTML("beforeend", html);
}
function generateLogOutCard(username = getUsername()) {
  if (!username) return;
  let html = createCard(
    "Odjavi se",
    `<p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p>`
  );
  return html;
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
function createPostHtml(post) {
  const { title, description } = post;
  const authorUsername = post.author.username;
  const html = createCard(
    title,
    `<p class="post-description">${description}</p>`,
    authorUsername
  );
  return html;
}
async function checkIfLoggedInAndSessionValid() {
  if (loggedIn() && !(await sessionValid())) {
    logOut();
    window.location.href = "./Login";
  }
}
function addCompDashboardCard() {
  const html = createCard(
    "Natjecanja",
    `<p>Ti si admin! Možeš kreirati i uređivati natjecanje. Klikni <a href="./competitions-dashboard">ovdje</a>.</p>`
  );
  cardsDiv.insertAdjacentHTML("beforeend", html);
}
async function main() {
  checkIfLoggedInAndSessionValid();
  const posts = await getPosts();
  posts.forEach((post) => {
    const html = createPostHtml(post);
    cardsDiv.insertAdjacentHTML("beforeend", html);
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
if (username) {
  const html = generateLogOutCard(username);

  cardsDiv.insertAdjacentHTML("beforeEnd", html);
  const logOutSpan = document.querySelector(".logout-span");
  logOutSpan.addEventListener("click", async () => {
    logOut(true);
  });
}
const accountCircle = document.querySelector(".account-circle");

if (username) {
  accountCircle.addEventListener("click", async () => {
    logOut(true);
  });
  const root = document.querySelector(":root");
  root.style.setProperty("--logged-in", "pointer");
}
main();
