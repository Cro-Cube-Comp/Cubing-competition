import { url, loadingHTML } from "../Scripts/variables.js";
import {
  addToken,
  getRole,
  isUser,
  tokenValid,
  loggedIn,
} from "../Scripts/credentials.js";
import {
  boldText,
  italicText,
  underlineText,
  hyperlinkText,
  emailToText,
  headerText,
} from "../Scripts/text.js";
const postButton = document.querySelector(".post-btn");
const postButtonPrevHTML = postButton.innerHTML;
const titleInput = document.querySelector(".title");
const descriptionInput = document.querySelector(".description");
const editPostDialog = document.querySelector(".edit-post-dialog");
const editPostTitleInput = editPostDialog.querySelector(".title");
const editPostDescriptionInput = editPostDialog.querySelector(".description");
postButton.addEventListener("click", () => {
  const title = titleInput.value;
  const description = descriptionInput.value;
  try {
    createPost(title, description);
  } catch (error) {
    console.error("Error creating post:", error);
  }
});
function addLoadingAnimationToPostBtn() {
  postButton.disabled = true;
  postButton.innerHTML = loadingHTML;
}
function removeLoadingAnimationToPostBtn() {
  postButton.disabled = false;
  postButton.innerHTML = postButtonPrevHTML;
}
async function createPost(title, description) {
  // Validate input
  if (!title || !description) {
    alert("Unesi i naslov i opis objave.");
    return;
  }
  if (typeof title !== "string" || typeof description !== "string") {
    alert("Title and description must be strings.");
    return;
  }

  // Add loading animation
  addLoadingAnimationToPostBtn();

  try {
    // Attempt to create a new post
    const response = await fetch(`${url}/posts/new`, {
      method: "POST",
      headers: addToken({ "Content-Type": "application/json" }),
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();

    // Handle response
    if (response.ok) {
      console.log("New post created:", data);
    } else {
      console.error("Error creating post:", data.message);
      alert("Error creating post: " + data.message);
    }
  } catch (error) {
    // Handle errors
    console.error("Failed to create post:", error);
    alert("Failed to create post. Please try again later.");
  } finally {
    // Reset form and remove loading animation
    descriptionInput.value = "";
    titleInput.value = "";
    removeLoadingAnimationToPostBtn();
    main();
  }
}

function createPostHtml(post) {
  const { title, description, id } = post;
  const authorUsername = post.author.username;
  const html = `<div class="post">
  <div> 
    <h2 class="post-title">${title}</h2>
  </div>
    <div>
      <p class="post-description">
      ${description}
      </p>
    </div>
    <div> 
      <p class="post-author-p">
        Objavio <span class="post-author">${authorUsername}
        </span>
      </p>
    </div>
    <div class="post-btns-container">
      <button data-id="${id}"
      class="delete-post-btn">
        <img src="../Images/delete.svg"/>
      </button>
      <button class="edit-post-btn" data-id="${id}"><img src="../Images/edit.svg"/></button>
    </div>
</div>`;
  return html;
}
async function getPosts() {
  try {
    // Returns json of posts
    const data = await fetch(`${url}/posts`);
    const posts = await data.json();
    return posts;
  } catch (error) {
    throw new Error("Failed to get posts. Please try again later.");
  }
}
async function deletePost(id) {
  const response = await fetch(`${url}/posts/delete/${id}`, {
    method: "DELETE",
    headers: addToken({
      "Content-Type": "application/json",
    }),
  });
  if (response.ok) {
    alert("Uspješno izbrisana objava.");
  } else {
    throw new Error("Failed to delete post.");
  }
}
function attachDeleteEvent(deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const prevHTML = deleteBtn.innerHTML;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = loadingHTML;
    const id = deleteBtn.dataset.id;
    try {
      await deletePost(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = prevHTML;
    main();
  });
}
function attachEditEvent(editBtn) {
  editBtn.addEventListener("click", async () => {
    const prevHTML = editBtn.innerHTML;
    editBtn.disabled = true;
    editBtn.innerHTML = loadingHTML;
    const id = editBtn.dataset.id;
    try {
      await openEditPostDialog(id);
    } catch (error) {
      console.error("Failed to open edit post dialog:", error);
    }
    editBtn.disabled = false;
    editBtn.innerHTML = prevHTML;
  });
}
async function getPost(id) {
  try {
    const posts = await getPosts();
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new Error("Objava s tim ID-om ne postoji.");
    }
    return post;
  } catch (error) {
    console.error("Failed to get post:", error);
    alert("Greška u dohvaćanju objave. Molimo pokušajte ponovno.");
  }
  return undefined;
}
async function loadPosts() {
  const posts = await getPosts();
  document.querySelector(".posts").innerHTML = "";
  posts.forEach((post) => {
    const html = createPostHtml(post);
    document.querySelector(".posts").insertAdjacentHTML("beforeend", html);
    attachDeleteEvent(
      document.querySelector(`.delete-post-btn[data-id="${post.id}"]`)
    );
    attachEditEvent(
      document.querySelector(`.edit-post-btn[data-id="${post.id}"]`)
    );
  });
}
function clearEditPostDialogInputs() {
  editPostTitleInput.value = "";
  editPostDescriptionInput.value = "";
}
async function openEditPostDialog(id = undefined) {
  if (!id) {
    throw new Error("Unesi ID objave.");
  }
  clearEditPostDialogInputs();
  editPostDialog.showModal();
  const post = await getPost(id);
  if (!post) {
    throw new Error("Objava s tim ID-om ne postoji.");
  }
  editPostTitleInput.value = post.title;
  editPostDescriptionInput.value = post.description;
  editPostDialog.addEventListener("submit", async () => {
    const title = editPostTitleInput.value;
    const description = editPostDescriptionInput.value;
    if (!title || !description) {
      alert("Unesi i novi naslov i novi opis objave.");
      editPostDialog.close();
      return;
    }
    if (!title || !description) {
      alert("Unesi i novi naslov i novi opis objave.");
      editPostDialog.close();
      return;
    }
    try {
      await editPost(id, title, description);
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Greška u uređivanju objave. Molimo pokušajte ponovno.");
    } finally {
      clearEditPostDialogInputs();
      main();
      editPostDialog.close();
    }
  });
}
async function editPost(
  id = undefined,
  newTitle = undefined,
  newDescription = undefined
) {
  if (
    !id ||
    !newTitle ||
    !newDescription ||
    typeof id !== "string" ||
    typeof newTitle !== "string" ||
    typeof newDescription !== "string"
  ) {
    throw new Error("Unesi novi naslov i novi opis objave te ID.");
  }
  try {
    const response = await fetch(`${url}/posts/edit/${id}`, {
      method: "PUT",
      headers: addToken({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });
    const data = await response.json();
    if (response.ok) {
      const newPost = data;
      console.log("New post edited:", newPost);
    }
  } catch (error) {
    console.error("Error editing post:\n", error);
    alert("Greška u uređivanju objave. Molimo pokušajte ponovno.");
  }
}
async function main() {
  if (!loggedIn()) {
    window.location.href = "../Login";
  }
  tokenValid(true);
  if (isUser(getRole(true))) {
    window.location.href = "../";
  }
  loadPosts();
}
main();
console.log(boldText("Hello", 0, 5));
console.log(italicText("Hello", 0, 5));
console.log(underlineText("Hello", 0, 5));
console.log(hyperlinkText("Hello", 0, 5, "https://google.com"));
console.log(emailToText("Hello", 0, 5, "test@test.com"));
console.log(headerText("Hello", 0, 5, 1));
