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
import { markdownToHtml } from "../Scripts/markdown.js";
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
function createPostDeleteBtnDivElement(id) {
  const postDeleteButtonDivElement = document.createElement("div");
  postDeleteButtonDivElement.classList.add("post-delete-btn-container");
  const postDeleteButtonElement = document.createElement("button");
  postDeleteButtonDivElement.appendChild(postDeleteButtonElement);
  postDeleteButtonElement.classList.add("delete-post-btn");
  // Create deleteee img for post delete button
  const deletePostImg = document.createElement("img");
  deletePostImg.src = "../Images/delete.svg";
  postDeleteButtonElement.appendChild(deletePostImg);
  postDeleteButtonElement.addEventListener("click", async () => {
    const prevHTML = postDeleteButtonElement.innerHTML;
    postDeleteButtonElement.disabled = true;
    postDeleteButtonElement.innerHTML = loadingHTML;
    try {
      await deletePost(id);
      main();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Greška u brisanju objave. Molimo pokušajte ponovno.");
    }
    postDeleteButtonElement.disabled = false;
    postDeleteButtonElement.innerHTML = prevHTML;
  });
  return postDeleteButtonDivElement;
}
function createPostEditBtnDivElement(id) {
  const postEditButtonDivElement = document.createElement("div");
  postEditButtonDivElement.classList.add("post-edit-btn-container");
  const postEditButtonElement = document.createElement("button");
  postEditButtonDivElement.appendChild(postEditButtonElement);
  postEditButtonElement.classList.add("edit-post-btn");
  // Create edit img for post edit button
  const editPostImg = document.createElement("img");
  editPostImg.src = "../Images/edit.svg";
  postEditButtonElement.appendChild(editPostImg);
  postEditButtonElement.addEventListener("click", async () => {
    const prevHTML = postEditButtonElement.innerHTML;
    postEditButtonElement.disabled = true;
    postEditButtonElement.innerHTML = loadingHTML;
    try {
      await openEditPostDialog(id);
    } catch (error) {
      console.error("Failed to open edit post dialog:", error);
      alert(
        "Greška u otvaranju dijaloga za uređivanje objave. Molimo pokušajte ponovno."
      );
    } finally {
      postEditButtonElement.disabled = false;
      postEditButtonElement.innerHTML = prevHTML;
      main();
    }
  });
  return postEditButtonDivElement;
}
function createPostAuthorDivElement(authorUsername) {
  const postAuthorDivElement = document.createElement("div");
  postAuthorDivElement.classList.add("post-author-container");
  const postAuthorElement = document.createElement("p");
  postAuthorElement.classList.add("post-author");
  postAuthorElement.textContent = `Objavio ${authorUsername}`;
  postAuthorDivElement.appendChild(postAuthorElement);
  return postAuthorDivElement;
}
function createPostDescriptionDivElement(description) {
  const postDescriptionDivElement = document.createElement("div");
  postDescriptionDivElement.classList.add("post-description-container");
  const postDescriptionElement = document.createElement("p");
  postDescriptionDivElement.appendChild(postDescriptionElement);
  postDescriptionElement.classList.add("post-description");
  postDescriptionElement.textContent = description;
  return postDescriptionDivElement;
}
function createPostTitleDivElement(title) {
  const postTitleDivElement = document.createElement("div");
  postTitleDivElement.classList.add("post-title-container");
  const postTitleElement = document.createElement("h2");
  postTitleDivElement.appendChild(postTitleElement);
  postTitleElement.classList.add("post-title");
  postTitleElement.textContent = title;
  return postTitleDivElement;
}
function createPostElement(post) {
  const { title, description, id } = post;
  const authorUsername = post.author.username;
  // Post element
  const postElement = document.createElement("div");
  postElement.classList.add("post");
  // Post title element
  const postTitleDivElement = createPostTitleDivElement(title);
  postElement.appendChild(postTitleDivElement);
  // Post description element
  const postDescriptionDivElement =
    createPostDescriptionDivElement(description);
  // Append post description div element to post element
  postElement.appendChild(postDescriptionDivElement);
  // Post author element
  const postAuthorDivElement = createPostAuthorDivElement(authorUsername);
  // Append post author div element to post element
  postElement.appendChild(postAuthorDivElement);
  const postButtonsContainerDivElement = document.createElement("div");
  postButtonsContainerDivElement.classList.add("post-btns-container");
  const postDeleteButtonDivElement = createPostDeleteBtnDivElement(id);
  // Append post delete button div element to post buttons container div element
  postButtonsContainerDivElement.appendChild(postDeleteButtonDivElement);
  const postEditButtonDivElement = createPostEditBtnDivElement(id);
  // Append post edit button div element to post buttons container div element
  postButtonsContainerDivElement.appendChild(postEditButtonDivElement);
  // Append post buttons container div element to post element
  postElement.appendChild(postButtonsContainerDivElement);
  return postElement;
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
  const postsDiv = document.querySelector(".posts");
  const posts = await getPosts();
  postsDiv.innerHTML = "";
  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsDiv.appendChild(postElement);
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
function boldSelectedTextFromInput(input = undefined) {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const oldInputValue = input.value;
  const newInputValue = boldText(oldInputValue, start, end);
  input.value = newInputValue;

  // Calculate the difference in length
  const lengthDifference = newInputValue.length - oldInputValue.length - 2; // 2 is the length of ** (ending of bolded text)

  // Adjust the selection range
  input.focus();
  input.setSelectionRange(start + lengthDifference, end + lengthDifference);
}
function italizeSelectedTextFromInput(input = undefined) {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const oldInputValue = input.value;
  const newInputValue = italicText(oldInputValue, start, end);
  input.value = newInputValue;

  // Calculate the difference in length
  const lengthDifference = newInputValue.length - oldInputValue.length - 1; // 1 is the length of _

  // Adjust the selection range
  input.focus();
  input.setSelectionRange(start + lengthDifference, end + lengthDifference);
}
function underlineSelectedTextFromInput(input = undefined) {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const oldInputValue = input.value;
  const newInputValue = underlineText(oldInputValue, start, end);
  input.value = newInputValue;

  // Calculate the difference in length
  const lengthDifference = newInputValue.length - oldInputValue.length - 1; // 1 is the length of -

  // Adjust the selection range
  input.focus();
  input.setSelectionRange(start + lengthDifference, end + lengthDifference);
}
function hyperlinkSelectedTextFromInput(input = undefined, url = "URL") {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selectedWord = input.value.substring(start, end);
  const oldInputValue = input.value;
  const newInputValue = hyperlinkText(oldInputValue, start, end, url);
  input.value = newInputValue;

  // Calculate the new selection range for the "URL" part
  const linkStart = start + 1 + selectedWord.length + 1 + 1;
  const linkEnd = linkStart + url.length;
  // Set the new selection range
  input.focus();
  input.setSelectionRange(linkStart, linkEnd);
}

function emailToSelectedTextFromInput(input = undefined, email = "email") {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selectedWord = input.value.substring(start, end);
  const oldInputValue = input.value;
  const newInputValue = emailToText(oldInputValue, start, end, email);
  input.value = newInputValue;

  // Calculate the new selection range for the email part
  const mailStart = start + 1 + selectedWord.length + 1 + 1 + "mailto:".length;
  const mailEnd = mailStart + email.length;
  // Set the new selection range
  input.focus();
  input.setSelectionRange(mailStart, mailEnd);
}
function headerSelectedTextFromInput(input = undefined, level = 1) {
  if (!input) {
    throw new Error("Param input missing.");
  }
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const oldInputValue = input.value;
  const newInputValue = headerText(oldInputValue, start, end, level);
  input.value = newInputValue;

  // Select the line that was headered
  const lines = oldInputValue.split("\n");
  let currentStart = 0;
  lines.forEach((line, index) => {
    const lineStart = currentStart;
    const lineEnd = lineStart + line.length;
    currentStart += line.length + 1;
    if (!(lineStart <= start && lineEnd >= end)) {
      return;
    }
    if (newInputValue.split("\n")[index][0] !== "#") {
      input.focus();
      input.setSelectionRange(start - level - 1, end - level - 1);

      return;
    }

    if (lineStart <= start && lineEnd >= end) {
      // Wait for the next animation frame to select the text
      requestAnimationFrame(() => {
        input.focus();
        input.setSelectionRange(lineStart + level + 1, end + level + 1);
      });
    }
  });
}
function addEventListenersToStyleTextButtons() {
  const descriptionInput = document.querySelector(".description");
  const boldButton = document.querySelector(".bold-btn");
  boldButton.addEventListener("click", () => {
    boldSelectedTextFromInput(descriptionInput);
  });
  const italicButton = document.querySelector(".italic-btn");
  italicButton.addEventListener("click", () => {
    italizeSelectedTextFromInput(descriptionInput);
  });
  const underlineButton = document.querySelector(".underline-btn");
  underlineButton.addEventListener("click", () => {
    underlineSelectedTextFromInput(descriptionInput);
  });
  const hyperlinkButton = document.querySelector(".hyperlink-btn");
  hyperlinkButton.addEventListener("click", () => {
    hyperlinkSelectedTextFromInput(descriptionInput);
  });
  const emailButton = document.querySelector(".mail-btn");
  emailButton.addEventListener("click", () => {
    emailToSelectedTextFromInput(descriptionInput);
  });
  // Add event listeners to all header buttons
  for (let i = 3; i <= 5; i++) {
    const headerButton = document.querySelector(`.header${i}`);
    headerButton.addEventListener("click", () => {
      headerSelectedTextFromInput(descriptionInput, i);
    });
  }
  function waitForPreview() {
    requestAnimationFrame(updatePreview);
  }
  waitForPreview();
  titleInput.addEventListener("keyup", waitForPreview);
  descriptionInput.addEventListener("keyup", waitForPreview);
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
    postAuthor.textContent = `Objavio ${authorUsername}`;
    postAuthorP.appendChild(postAuthor);
    postAuthorContainer.appendChild(postAuthorP);
    cardInsideContainer.appendChild(postAuthorContainer);
  }
  return cardElement;
}
function updatePreview() {
  const previewElement = document.querySelector(".preview");
  if (!previewElement) {
    return;
  }
  const title = titleInput.value;
  const description = markdownToHtml(descriptionInput.value);
  const authorUsername = localStorage.getItem("username");
  if (!title || !description) {
    return;
  }
  previewElement.innerHTML = "";
  previewElement.appendChild(
    createCardElement(title, description, authorUsername || undefined)
  );
}
async function main() {
  addEventListenersToStyleTextButtons();
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
