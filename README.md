# 🖥️ StuMan Backend Server

*A Node.js/Express backend for managing competitive programming students with Codeforces API integration.*

---

## 🚀 Overview

The **StuMan Backend** provides a robust API for storing, retrieving, and synchronizing student data with the **Codeforces** platform. It handles all data persistence, external API integrations, scheduled tasks, and notifications for the **Student Management System**.

---

## ✨ Features

- **RESTful API**: Complete CRUD operations for student data
- **Codeforces Integration**: Fetch and process data from Codeforces API
- **Automated Syncing**: Daily synchronization of student performance
- **Email Notifications**: Sends reminders to inactive students
- **Data Aggregation**: Converts raw Codeforces data into analytics-ready stats

---

## 🏗️ Project Structure
``` bash
server/
├── controllers/
│   └── studentController.js    # Request handlers for student endpoints
├── models/
│   └── Student.js              # Mongoose schema for student data
├── routes/
│   └── studentRoutes.js        # API route definitions
├── utils/
│   ├── fetchCodeforces.js      # Codeforces API integration
│   └── emailer.js              # Email notification service
├── jobs/
│   └── dailySyncJob.js         # Scheduled tasks for data synchronization
├── .env                        # Environment variables
├── index.js                    # Server entry point
├── package.json                # Dependencies and scripts
└── README.md                   # Documentation
```


---

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 8
- **External API**: Codeforces API
- **HTTP Client**: Axios
- **Email**: Nodemailer
- **Scheduling**: Node-cron
- **Environment Variables**: Dotenv

---

## 📊 Data Model

The `Student` schema includes fields for:

- Name, email, and Codeforces handle
- Performance stats (ratings, problems solved, activity)
- Sync and reminder tracking

---

## 🌐 API Endpoints

| Method | Endpoint                  | Description                                             |
|--------|---------------------------|---------------------------------------------------------|
| GET    | `/api/students`           | Retrieve all students                                  |
| POST   | `/api/students`           | Create a new student                                   |
| PUT    | `/api/students/:id`       | Update a student by ID                                 |
| DELETE | `/api/students/:id`       | Delete a student by ID                                 |
| GET    | `/api/students/:id/pro`   | Get student profile with Codeforces data               |
| POST   | `/api/sync`               | Manually trigger synchronization of all student data   |

---

## 🔄 Codeforces Integration

The server uses the following Codeforces API endpoints:

- `user.info` – Basic profile information  
- `user.rating` – Contest participation and rating history  
- `user.status` – Submission history and problem-solving activity  

Processed data includes:

- 📈 **Rating history charts**
- 📊 **Problem difficulty distribution**
- 📅 **Activity heatmaps**
- 🏁 **Contest performance analytics**

---

## ⏱️ Scheduled Jobs

Daily synchronization tasks powered by **node-cron**:

- Automatically fetch updated data for all students
- Sync Codeforces performance stats
- Trigger email reminders if students are inactive

---

## 📧 Email Notifications

Automated emails for student engagement:

- Reminds inactive students to solve problems
- Tracks number of reminders sent per student
- Honors opt-out preferences

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

---

### ⚙️ Environment Setup

Create a `.env` file in the `server/` directory with:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

📦 Installation
``` bash
# Clone the repository
git clone https://github.com/your-username/stuman-backend.git
cd stuman-backend

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-restart
npm run dev
```

## 🛡️ Error Handling
The backend includes robust error handling:
-API failures are logged without crashing the server
-Database errors return descriptive HTTP status codes
-All routes include try-catch and fallback messages

## 🔌 API Usage Examples
- Fetch all students
``` http
GET /api/students
```
- Add a new student
``` http
POST /api/students
```
- Get detailed student profile
``` http
GET /api/students/:id/pro
```
- Trigger manual sync
``` http
POST /api/sync
```
## 🔮 Future Enhancements
- 🔐 Add user authentication & role-based access

- 🧢 Rate limiting for Codeforces API requests

- ⚙️ Support for other CP platforms (LeetCode, AtCoder)

- 📊 Admin analytics dashboard

- 🛎️ Real-time updates via webhooks


## 📝 Development Notes
### Code Conventions
- Controllers: camelCase

- Routes: RESTful, lowercase

- Models: PascalCase schemas with camelCase fields

- Utilities: Grouped by domain

### Best Practices
- Environment-based config (.env)

- Modular, testable structure

- Async/await everywhere

- Centralized error handling

- Scheduled tasks decoupled from main logic

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙌 Credits
Built with ❤️ by Jayant Joshi