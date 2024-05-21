const url = "https://cubing-competition.onrender.com";
const logInElement = document.querySelector(".js-log-in");
const username = getUsername();
const cardsDiv = document.querySelector(".cards");
String.prototype.isUser = function () {
  return this.toUpperCase() === "USER";
};
String.prototype.isAdmin = function () {
  return this.toUpperCase() === "ADMIN";
};
String.prototype.addToken = function (token = getToken()) {
  return `${this}${this.includes("?") ? "&" : "?"}token=${token}`;
};
Object.prototype.addToken = function (token = getToken()) {
  let object = this;
  object.Authorization = token;
  return object;
};
function loggedIn() {
  return Boolean(getToken()) && Boolean(getRole()) && Boolean(getId());
}
function getUsername() {
  const username = localStorage.getItem("username");
  return username;
}
function getRole() {
  const role = localStorage.getItem("role");
  return role;
}
function getId() {
  const id = localStorage.getItem("id");
  return id;
}
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}
function createNewPostDialog() {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `
    <form id="postForm">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" required><br>
      <label for="description">Description:</label><br>
      <textarea id="description" name="description" required></textarea><br><br>
      <button type="submit">Submit</button>
    </form>
  `;

  dialog.addEventListener("close", () => {
    dialog.remove();
  });

  document.body.appendChild(dialog);
  dialog.showModal();

  const postForm = document.getElementById("postForm");
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");

    const title = titleElement.value;
    const description = descriptionElement.value;

    try {
      const response = await fetch(`${url}/posts/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }.addToken(),
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log("New post created:", newPost);
        dialog.close();
      } else {
        const errorData = await response.json();
        console.error("Error creating post:", errorData.message);
        alert("Error creating post: " + errorData.message);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again later.");
    }
  });
}
async function getPosts() {
  // Returns json of posts
  const data = await fetch(`${url}/posts`);
  const posts = await data.json();
  return posts;
}
if (username) {
  logInElement.innerHTML = username;
}
const role = getRole();
function addDashboardCard() {
  let html = "";
  html += `
  <div class="card">
   <div class="container">
      <h2>Radna ploča</h2>
      <p>Ti si admin. Oni imaju pristup <a href="./dashboard">radnoj ploči!</a></p>
</div>
</div>
  `;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
}
function addCreatePostCard() {
  const html = `
  <div class="card">
  <div class="container">
    <h2>Objava</h2>
    <p>
      Ti si admin! Oni mogu objaviti bilo što!
      Klikni <span onclick="createNewPostDialog()" class="post">ovdje</span> da objaviš nešto.
    </p>
  </div>
</div>
  `;
  cardsDiv.insertAdjacentHTML("beforeend", html);
}
if (typeof role === "string" && role.isAdmin()) {
  addDashboardCard();
  addCreatePostCard();
}

function logOut(refresh = false) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  if (refresh) {
    window.location.reload();
  }
}
if (username) {
  let html = "";
  html += `
  <div class="card">
  <div class="container">
      <h2>Odjavi se</h2>
      <p>Ako se želiš odjaviti iz korisničkog računa "${username}" klikni <span class="logout-span">ovdje</span>.</p></div></div>`;
  cardsDiv.insertAdjacentHTML("beforeEnd", html);
  let logOutSpan = document.querySelector(".logout-span");
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
      
      Natjecateljsko ograničenje je 50, ako ga se pređe bit ćete stavljeni na listu čekanja.
      
      Želite li se prijaviti (ime, prezime, škola, razred ) ili imate pitanja pošaljite na cro.cube.club@gmail.com
      `,
      url: "https://bit.ly/CroComp",
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
  const html = `<div class="card">
  <div class="container">
    <h2 class="post-title">${title}</h2>
    <p class="post-description">
      ${description}
    </p>
    Objavio <span class="post-author">"${authorUsername}"</span>
  </div>
</div>`;
  return html;
}
async function main() {
  tokenValid(true);
  const posts = await getPosts();
  posts.forEach((post) => {
    const html = createPostHtml(post);
    cardsDiv.insertAdjacentHTML("beforeend", html);
  });
}
main();
async function tokenValid(action = false) {
  // action, if true it will logout user if token is not valid
  if (!loggedIn()) return true;
  console.log("Provjera vrijednosti tokena...");
  const data = await fetch(`${url}/token`.addToken());
  console.log(data.ok ? "Token is valid." : "Token is invalid.");
  if (action && !data.ok) {
    console.log("Odjavljivanje...");
    logOut();
    alert("Prijavi se ponovno");
    window.location.href = "./Login";
  }
  return data.ok;
}
