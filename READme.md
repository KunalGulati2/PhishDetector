# 🛡️ PhishDetector

PhishDetector is a smart web app that checks if a website is safe or a phishing attempt. It gives a risk score and shows your check history.

---

## 🔧 How to Run the App

### 1. 🧬 Clone the Repo

```bash
git clone https://github.com/KunalGulati2/PhishDetector.git
cd PhishDetector
```

---

### 2. 🖥️ Start the Backend

```bash
cd backend
npm install
```

Then create a `.env` file inside the backend folder:

```
PORT=5000
DATABASE_URL=your_postgres_connection_url
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
```

Now start the backend server:

```bash
npm start
```

---

### 3. 🌐 Start the Frontend

```bash
cd ../frontend
npm install
npm start
```

Open the app in your browser:

```
http://localhost:3000
```

---

## 📽️ Demo Video

🎥 [Click to see the app in action](https://github.com/KunalGulati2/PhishDetector/blob/main/demo.mp4)

---

## ✅ Risk Levels

| Score Range | Classification     |
|-------------|--------------------|
| 90–100      | ✅ Safe             |
| 50–90       | 🟡 Moderately Safe  |
| 20–50       | 🟠 Risky            |
| 0–20        | 🔴 Highly Risky     |

---

## 📦 Features

- 🧠 Heuristic-based phishing detection
- 🔍 Google Safe Browsing
- 📊 Pie chart showing risk level distribution
- 🧾 History of checked URLs (requires login)

---

## 🧰 Built With

- **Frontend**: React + Tailwind CSS  
- **Backend**: Node.js + Express + PostgreSQL  
- **APIs**: Google Safe Browsing 
- **Auth**: JWT-based login

---

## 👨‍💻 Author

Made by Kunal Gulati

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE)
