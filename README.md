# 🚀 TaskFlow – Full Stack Task Management Application

TaskFlow is a modern **full-stack task management web application** built to help users organize, track, and manage their daily tasks efficiently.  
It supports authentication, task statistics, and a clean dashboard experience.

---

## 🌟 Features

- 🔐 User Authentication (JWT-based)
  - Register
  - Login
  - Refresh tokens
  - Secure logout
- 📝 Task Management
  - Create, update, delete tasks
  - Task status: **Todo, In-Progress, Completed**
  - Priority levels
  - Due dates & overdue tracking
- 📊 Dashboard Statistics
  - Total tasks
  - Completed / In-progress / Todo
  - Completion & overdue rates
- ⚡ Optimistic UI updates
- 🌐 RESTful API architecture
- 🔒 Protected routes using middleware

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Vite)
- Context API
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas

---

## 📁 Project Structure

TaskFlow/
├── client/ # Frontend (React)
│ ├── src/
│ ├── public/
│ └── vite.config.js
│
├── server/ # Backend (Node + Express)
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
└── README.md


---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=your_frontend_url

Frontend (client/.env)
VITE_API_BASE_URL=your_backend_url

🚀 Getting Started (Local Setup)
1️⃣ Clone the repository
git clone https://github.com/Prashanthbkm/TaskFlow.git
cd TaskFlow

2️⃣ Backend setup
cd server
npm install
npm run dev

3️⃣ Frontend setup
cd client
npm install
npm run dev

🔐 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create task
PUT	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
GET	/api/tasks/stats/summary	Dashboard stats
📌 Future Enhancements

🤖 AI Assistant inside dashboard

📅 Calendar view

🔔 Notifications & reminders

📱 Mobile responsive improvements

👥 Team collaboration

👨‍🎓 Author

Prashanth B.K.M

GitHub: @Prashanthbkm

Role: Full Stack Developer (MERN)

live
https://task-flow-orcin-alpha.vercel.app/
