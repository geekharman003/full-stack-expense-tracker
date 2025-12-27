const USER_BASE_URL = "http://localhost:3000/user";
const EXPENSE_BASE_URL = "http://localhost:3000/expenses";
const BASE_URL = "http://localhost:3000";

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

const handleExpenseForm = (event) => {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const token = localStorage.getItem("token");

  axios
    .post(
      `${EXPENSE_BASE_URL}/addexpense`,
      {
        amount,
        description,
      },
      { headers: { Authorization: token } }
    )
    .then((res) => {
      const { id, amount, description, category } = res.data;
      console.log(category)
      createLi(id, amount, description, category);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createLi = (id, amount, description, category) => {
  const ul = document.getElementById("expense-list");
  const li = document.createElement("li");
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    deleteExpense(id, li);
  });
  li.textContent = `${amount}-${description}-${category}`;
  li.appendChild(deleteBtn);

  ul.appendChild(li);
};

const deleteExpense = (id, li) => {
  const token = localStorage.getItem("token");
  axios
    .delete(`${EXPENSE_BASE_URL}/delete/${id}`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      if (res.data.success) {
        li.remove();
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const showLeaderBoard = () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";
  axios
    .get(`${BASE_URL}/premium/leaderBoard`)
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

const addUserToLeaderBoard = (leaderboardList, name, totalExpenses) => {
  const li = document.createElement("li");
  li.textContent = `Name-${name},Total Expenses-${totalExpenses}`;

  leaderboardList.appendChild(li);
};
