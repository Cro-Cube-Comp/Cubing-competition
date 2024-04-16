const usersDiv = document.querySelector(".users");
async function showCompetition(userId, index) {
  const allUserDiv = document.querySelectorAll(".user");
  const userDiv = allUserDiv[index];
  let html = "";

  const user = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((response) => response.json());

  // Check if user data exists
  if (!user) {
    html += `<p>User not found.</p>`;
    userDiv.insertAdjacentHTML("beforeend", html);
    return;
  }
  // Loop through rounds
  for (let i = 0; i < 3; i++) {
    const round = user.rounds[i] || [];
    html += `<h3>Round ${i + 1}</h3>`;

    // Check if solves exist for the round
    if (round.solves && round.solves.length > 0) {
      html += `<ul>`;
      for (let j = 0; j < round.solves.length; j++) {
        html += `<li>Solve ${j + 1}: ${round.solves[j]}</li>`;
      }
      html += `</ul>`;
    } else {
      html += `<p>No solves for this round.</p>`;
    }

    // Add form to add solves (assuming you have elements with these IDs)
    html += `
      <form id="add-solve-${i}">
        <label for="solve-${i}">Solve:</label>
        <input type="number" id="solve-${i}" name="solve">
        <button type="button" onclick="addSolve('${userId}', ${i})">Add Solve</button>
      </form>
    `;
  }

  userDiv.insertAdjacentHTML("beforeend", html);
}

// Function to handle adding a solve
async function addSolve(userId, roundIndex) {
  const solveInput = document.getElementById(`solve-${roundIndex}`);
  console.log(solveInput);
  const solveValue = solveInput.value;

  // Check if solve value is a number
  if (isNaN(solveValue) || solveValue.trim() === "") {
    alert("Please enter a valid solve value (number).");
    return;
  }
  const solveData = {
    round: roundIndex + 1,
    solves: [parseInt(solveValue)],
  };
  const response = await fetch(`http://localhost:3000/solves/add/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify(solveData),
  });

  if (response.ok) {
    const data = await response.json();
    alert(data.message);
    // Update the competition display after successful addition
    location.reload();
  } else {
    alert("Failed to add solve. Please try again.");
  }
}

async function getUsers() {
  const body = {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try {
    const data = await fetch("http://localhost:3000/users/all", body);
    if (data.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      alert("Login again.");
      location.href = "../Login/login.html";
    }
    const result = await data.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(id) {
  try {
    const body = {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const data = await fetch(`http://localhost:3000/users/${id}`, body);
    const result = await data.json();
    if (data.ok) {
      main();
    } else {
      alert("Failed to delete user.");
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}
async function assignAdmin(id, username) {
  const body = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  try {
    const data = await fetch(`http://localhost:3000/assign-admin/${id}`, body);
    const result = await data.json();

    if (data.ok) {
      alert(`Successfully made ${username} admin.`);
      main();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

async function main() {
  if (localStorage.getItem("role") === "user") {
    alert("Admins only!");
    location.href = "../home.html";
  }
  if (!localStorage.getItem("token")) {
    alert("Login again.");
    location.href = "../Login/login.html";
  }

  let html = "";
  let users = await getUsers();
  usersDiv.innerHTML = "";
  users.forEach((user, index) => {
    const username = user.username;
    const id = user.id;
    const role = user.role;
    html += `<div class="user">`;
    html += `<p class="username">${username} (${id})</p>`;
    html += `<p class="role">${role}</p>`;
    // Add a delete button for each user
    html += `<button onclick="deleteUser('${id}')">Delete</button>`;
    html += `<button onclick="assignAdmin('${id}', '${username}')">Assign admin</button>`;
    html += `<button onclick="showCompetition('${id}', ${index})">Competition</button>`;
    html += `</div>`; // end user div
  });
  usersDiv.innerHTML = html;
}

function getTime() {
  // Get the current date and time in GMT+1
  const now = new Date();
  const cetTime = new Date(now.getTime());

  // Extract hours and minutes
  const hours = cetTime.getHours().toString().padStart(2, "0"); // Pad hours with leading zero
  const minutes = cetTime.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading zero
  //const seconds = cetTime.getSeconds().toString().padStart(2, "0"); // Pad minutes with leading zero

  // Format the time string (24-hour format)
  const formattedTime = `${hours}:${minutes}`;

  // Update the content of the HTML element with the formatted time string
  // You will need to replace this with your specific method to update the HTML element
  document.getElementById("currentTime").innerText = formattedTime;
}

getTime();
main();

// Call the function every 10 seconds to update the time automatically
setInterval(getTime, 1000 * 10);