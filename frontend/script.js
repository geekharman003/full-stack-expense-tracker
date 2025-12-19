const BASE_URL = "http://localhost:3000/user";

const handleFormSubmit = (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  axios
    .post(`${BASE_URL}/signup`, {
      name,
      email,
      password,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
