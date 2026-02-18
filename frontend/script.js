const USER_BASE_URL = "http://localhost:3000/user";
const EXPENSE_BASE_URL = "http://localhost:3000/expenses";
const BASE_URL = "http://localhost:3000";

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currentPageElement = document.getElementById("current-page");
const totalPageElement = document.getElementById("total-pages");

let currentPage = 1;
let lastPage = 1;


// signup form
const handleSignUpForm = (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const message = document.getElementById("message");

  axios
    .post(`${USER_BASE_URL}/signup`, {
      name,
      email,
      password,
    })
    .then((res) => {
      message.textContent = res.data;
      message.style.color = "green";
    })
    .catch((err) => {
      message.textContent = err.response.data;
      message.style.color = "red";
      console.log(err.message);
    });
};


// login form
const handleLoginForm = (event) => {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  axios
    .post(`${USER_BASE_URL}/login`, {
      email,
      password,
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      if (res.data.redirect) {
        window.location.href = "index.html";
      }
    })
    .catch((err) => {
      message.textContent = err.response.data;
      message.style.color = "red";
    });
};


// logout functionality
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/frontend/login.html";
};


// forgot form
const handleForgotForm = async (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const token = localStorage.getItem("token");
  const message = document.getElementById("message");

  try {
    const res = await axios.post(
      `${BASE_URL}/password/forgotpassword`,
      {
        email,
      },
      {
        headers: { Authorization: token },
      },
    );

    message.textContent = "Reset Email Sent";
    console.log(res.data);
  } catch (error) {
    message.textContent = "Error occuring reset mail";
    console.log(error);
  }
};


// add expense form
const handleExpenseForm = async (event) => {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const token = localStorage.getItem("token");

  await axios.post(
    `${EXPENSE_BASE_URL}/addexpense`,
    { amount, description, category },
    { headers: { Authorization: token } },
  );

  // jump to last page
  loadPage(lastPage);
};


// loads paginated expense data
const loadPage = async (page) => {
  if (page < 1) page = 1;

  const token = localStorage.getItem("token");

  const res = await axios.get(`${EXPENSE_BASE_URL}/?page=${page}`, {
    headers: { Authorization: token },
  });

  currentPage = res.data.pagination.currentPage;
  lastPage = res.data.pagination.lastPage;

  showExpenses(res.data.expenses);
  showPagination(res.data.pagination);
};


// delete expense logic
const deleteExpense = async (id) => {
  const token = localStorage.getItem("token");

  await axios.delete(`${EXPENSE_BASE_URL}/delete/${id}`, {
    headers: { Authorization: token },
  });

  // reload current page
  loadPage(currentPage);
};


// shows the expenses in table
const showExpenses = (expenses) => {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  if (expenses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center">
          No expense found
        </td>
      </tr>
    `;
    return;
  }

  expenses.forEach(({ id, amount, description, category }) => {
    addExpenseToUi(id, amount, description, category, tbody);
  });
};


// adds the expense in the table
const addExpenseToUi = (id, amount, description, category, tbody) => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${amount}</td>
    <td>${description}</td>
    <td>${category}</td>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-expense-btn";

  deleteBtn.addEventListener("click", async () => {
    await deleteExpense(id);
  });

  const td = document.createElement("td");
  td.appendChild(deleteBtn);
  tr.appendChild(td);

  tbody.appendChild(tr);
};


// show pagination btns
const showPagination = (pagination) => {
  const {
    currentPage,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
    lastPage,
  } = pagination;

  const container = document.querySelector(".pagination");
  container.innerHTML = "";

  if (hasPrevPage) {
    const btn = document.createElement("button");
    btn.textContent = "Prev";
    btn.onclick = () => loadPage(prevPage);
    container.appendChild(btn);
  }

  const currentBtn = document.createElement("button");
  currentBtn.textContent = currentPage;
  currentBtn.classList.add("active");
  container.appendChild(currentBtn);

  if (hasNextPage) {
    const btn = document.createElement("button");
    btn.textContent = "Next";
    btn.onclick = () => loadPage(nextPage);
    container.appendChild(btn);
  }
};


// loads the leaderboard data
const showLeaderBoard = () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";

  const token = localStorage.getItem("token");
  axios
    .get(`${BASE_URL}/premium/leaderBoard`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      const users = res.data;

      users.forEach((user) => {
        const { name, totalExpenses } = user;
        addUserToLeaderBoard(leaderboardList, name, totalExpenses);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};


// adds users to the leaderboard
const addUserToLeaderBoard = (leaderboardList, name, totalExpenses) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.src = "images/icons/user-svgrepo-com.svg";

  li.innerHTML = `
  <span class="leaderborad-user-info"><img src="images/icons/user-svgrepo-com.svg" width="20" height="20"/>${name}</span>
  <span>₹${totalExpenses}</span>
  `;

  leaderboardList.appendChild(li);
};


// downloads the latest expenses
const downloadExpenses = async (event) => {
  event.preventDefault();
  const downloadedExpenseList = document.getElementById(
    "downloaded-expense-table",
  );
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/premium/downloadExpense`, {
      headers: { Authorization: token },
    });

    const { objectURL } = response.data;

    downloadedExpenseList.innerHTML = `
    <tr>
        <th>Sr. No.</th>
        <th>URL</th>
    </tr>
    `;

    idCounter = 1;
    await fetchDownloadedExpenses();

    const a = document.createElement("a");
    a.href = objectURL;
    a.click();

    a.remove();
  } catch (error) {
    console.error(error);
  }
};


// loads already downloaded expenses
const fetchDownloadedExpenses = async () => {
  const token = localStorage.getItem("token");

  try {
    const downloadedExpenseList = document.getElementById(
      "downloaded-expense-table",
    );
    const response = await axios.get(`${BASE_URL}/premium/downloadedExpenses`, {
      headers: { Authorization: token },
    });

    const { urls } = response.data;

    if (!urls.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = "2";
      td.textContent = "No Downloaded Expenses Available";
      td.style.textAlign = "center";
      tr.appendChild(td);
      downloadedExpenseList.appendChild(tr);
    } else {
      urls.forEach((url) => {
        addDownloadedExpenseToUi(downloadedExpenseList, url.url);
      });
    }
  } catch (error) {
    console.log(error);
  }
};


// add expenses to the table
let idCounter = 1;
const addDownloadedExpenseToUi = (downloadedExpenseList, objectURL) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${idCounter}</td><td>${objectURL}</td>`;
  idCounter++;

  downloadedExpenseList.appendChild(tr);
};


// enables premium features for premium users
const enablePremiumUserFeatures = () => {
  const leaderboardSection = document.getElementById("leaderboard-section");
  const premiumMessage = document.getElementById("premium-user-message");
  const downloadExpenseBtn = document.getElementById("download-expense-btn");
  const premiumLink = document.getElementById("buy-premium-link");
  const downloadExpenseContainer = document.getElementById(
    "downloaded-expenses-table-container",
  );

  premiumLink.remove();
  leaderboardSection.style.display = "initial";
  downloadExpenseBtn.style.display = "flex";
  downloadExpenseContainer.style.display = "block";
  downloadExpenseContainer.style.padding = "2rem";
  premiumMessage.textContent = "YOU ARE A PREMIUM USER";
  premiumMessage.style.color = "yellow";

  showLeaderBoard();
};
