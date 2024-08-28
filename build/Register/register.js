import { url, loadingHTML } from "../Scripts/variables.js";
import {
  getRole,
  isUser,
  getToken,
  addToken,
  tokenValid,
} from "../Scripts/credentials.js";
import { registerUser } from "../Scripts/user.js";
const group1Checkbox = document.querySelector(".group-1");
const submitBtn = document.querySelector(".submit-btn");
const messageElement = document.getElementById("message");
const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");
const registerForm = document.getElementById("registerForm");
function clearInput(input) {
  input.value = "";
}

function maskMiddle(str) {
  if (str.length <= 2) {
    return str;
  }

  const length = str.length;
  const firstPartLength = Math.ceil(length * 0.2);
  const lastPartLength = Math.floor(length * 0.2);
  const middlePartLength = length - firstPartLength - lastPartLength;

  const firstPart = str.substring(0, firstPartLength);
  const lastPart = str.substring(length - lastPartLength);

  return firstPart + "*".repeat(middlePartLength) + lastPart;
}

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = usernameElement.value;
  const password = passwordElement.value;
  const group = isChecked(group1Checkbox) ? 1 : 2;
  const credentialsCheckResult = credentialsCheck(username, password, group);
  messageElement.textContent = "";
  if (credentialsCheckResult) {
    messageElement.textContent = credentialsCheckResult.message;
    return;
  }

  // Disable the button to prevent multiple clicks
  submitBtn.disabled = true;

  submitBtn.innerHTML = loadingHTML;

  getToken(true); // Make sure that token exists, if not bring to login page
  try {
    const userRegistration = await registerUser(username, password, group);
    if (!userRegistration.success) {
      throw "Greška prilikom registracije korisnika.";
    }
    // Success message
    messageElement.textContent = `Korisnik ${
      userRegistration.user.username
    } je uspešno registriran sa lozinkom ${maskMiddle(
      userRegistration.user.password
    )}.`;
  } catch (error) {
    messageElement.textContent =
      error.message || error || "Greška prilikom registracije korisnika.";
  } finally {
    submitBtn.disabled = false; // Re-enable the button
    submitBtn.textContent = "Registriraj";
    clearInput(usernameElement);
    clearInput(passwordElement);
  }
});

function isChecked(checkbox) {
  return checkbox.checked;
}
function credentialsCheck(username, password, group) {
  if (!username || !password) {
    return { message: "Korisničko ime i lozinka su obavezni." };
  }
  if (username.length <= 4) {
    return { message: "Korisničko ime mora biti duže od 4 znaka." };
  }
  if (password.length <= 7) {
    return { message: "Lozinka mora biti duža od 7 znaka." };
  }
  if (username === password) {
    return { message: "Korisničko ime i lozinka ne smiju biti isti." };
  }
  if (group !== 1 && group !== 2) {
    return { message: "Grupa mora biti 1. ili 2." };
  }
  return null;
}
tokenValid(true);
if (isUser(getRole(true))) {
  window.location.href = "../";
}
