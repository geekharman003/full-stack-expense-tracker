const addUser = (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("name,email and password are required");
    }

    res.status(201).send("user created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { addUser };
