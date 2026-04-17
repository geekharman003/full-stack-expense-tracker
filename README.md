# 💰 Simple Spend
Simple Spend is a lightweight and user-friendly expense tracking application designed to help individuals manage their daily finances with ease. The project focuses on simplicity, efficiency, and clarity—making it easy to record, monitor, and analyze spending habits without unnecessary complexity.

---

## 🚀 ✨ Features
* 💸 Easy Expense Tracking \
 Quickly add, edit, and delete expenses with a simple and intuitive interface.

* 📊 Expense Overview \
Get a clear view of your spending patterns to better understand where your money goes.

* 🗂️ Automatic category generation \
product category automatically gets created.

* 👑 Premium Features \
Premium Users will enjoy features like learderboard and expense downloading.

* 🌐 Download as CSV \
Download all your expenses in a CSV file.

* 🛡️ Secure Payments \
Securely do the payments using cashfree.

* 🔒 Authentication/Authorization \
Secured login and prevent users from unauthorized access.

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* Axios

### Backend

* Node.js
* Express.js
* MySQL (Database)
* JWT Authentication
* Payment Gateway (Cashfree)
* Google Gemini
* AWS S3
---

## 📁 Project Structure

```
simple-spend/
│
├── backend/        # Express server, APIs, database logic
├── frontend/       # HTML, CSS, JavaScript
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/geekharman003/simple-spend.git
cd simple-spend
```

### 2. Install dependencies

```bash
cd backend
npm install
```

This will install dependencies for :

* backend

---

### 3. Environment Variables

Create a `.env` file inside the **backend** folder and add:

```env
PORT=3000

#DATABASE
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=your_host

#THIRD PARTY API KEYS
GEMINI_API_KEY=your_api_key
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_secret_key
BREVO_API_KEY=your_api_key

#AWS
BUCKET_NAME=your_bucket_name
IAM_USER_ACCESS_KEY=your_access_key
IAM_USER_SECRET_KEY=your_secret_key

```
### 4. Run the app

```bash
cd backend
npm run start

cd frontend
run live server
```

* Backend runs on: `http://localhost:3000`
* Frontend runs on: `http://127.0.0.1:5500`

---


## 📸 Screenshots

* Signup Page


* Login Page


* main page


---

## 🔒 Security Features

* JWT-based authentication
* Password hashing

---

# 📡 API Documentation

## 👤 User endpoints

| Method | Endpoint       | Description       | Auth Required |
| ------ | -------------- | ----------------- | ------------- |
| POST   | `/user/signup` | Register new user | ❌ No          |
| POST   | `/user/login`  | Login user        | ❌ No          |Yes         |
| GET   | `/user/premiumUsers` | Get all premium users       | ✅ Yes         |

## 💰 Expenses Endpoints

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| GET   | `/expenses/`         | Get expenses             | ✅ Yes         |
| GET    | `/expenses/all` | Get all expenses | ✅ Yes         |
| POST    | `/expenses/addexpense` | Add a expense | ✅ Yes         |
| DELETE    | `/expenses/delete/:id` | Delete a Expense | ✅ Yes         |

## 👑 Premium Endpoints

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| GET   | `/premium/checkPremium`         | Checks if user is premium or not             | ✅ Yes         |
| GET    | `/premium/leaderboard` | load the leaderboard | ✅ Yes         |
| GET    | `/premium/downloadExpense` | Download a expense details | ✅ Yes         |
| GET    | `/premium/downloadedExpenses` | List all downloaded Expenses | ✅ Yes         |

## 🔑 Password Endpoints

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| POST   | `/password/forgotpassword`         | Generates the reset Url             | ✅ Yes         |
| GET    | `/password/forgotpassword/:uuid` | validates the reset Url | ✅ Yes         |
| POST    | `/password/resetpassword` | reset the password | ✅ Yes         |

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Developed with ❤️ by 
[@geekharman003](https://github.com/geekharman003)

---
