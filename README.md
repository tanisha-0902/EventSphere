# 🌐 EventSphere: Professional Event Management System

EventSphere is a **robust, full-stack web application** designed to simplify and streamline the entire event management lifecycle.  
It provides a centralized platform for both administrators and general users — featuring dedicated dashboards, calendar integration, and complete **event CRUD (Create, Read, Update, Delete)** functionality.

---

## ✨ Features

- **Dual User Interface:**  
  Separate dashboards for Admins and Users.  
  - **Admin Dashboard** – Manage events, users, and system settings.  
  - **User Dashboard** – View, register, and interact with events.

- **Event Lifecycle Management:**  
  Full CRUD operations to create, update, publish, and delete events.

- **Intuitive Interface:**  
  Modern, responsive design built with **Tailwind CSS** for a seamless experience on all devices.

- **Database Integration:**  
  Powered by **MongoDB** for flexible and scalable storage of event data, user profiles, and contact submissions.

- **Authentication & Authorization:**  
  Secure user registration, login, and session management with **role-based access control**.

---

## ⚙️ Tech Stack

| Category | Technology | Description |
|-----------|-------------|-------------|
| **Backend** | Node.js | JavaScript runtime environment |
| **Framework** | Express.js | Minimalist and flexible Node.js web application framework |
| **Database** | MongoDB | NoSQL database for flexible data persistence |
| **Frontend** | HTML / EJS | Templating engine for dynamic content rendering |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid UI development |
| **Deployment** | Heroku / Vercel / AWS *(suggested)* | For hosting and deployment |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📋 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/)

---

### ⚡ Installation

Clone the repository:
git clone [YOUR_REPOSITORY_URL]
cd eventsphere

Install dependencies:
npm install

🔐 Configure Environment Variables
Create a file named .env in the root directory and add the following:
env
MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/eventsphere?retryWrites=true&w=majority"
SESSION_SECRET="a_strong_secret_key_here"
PORT=3000

▶️ Run the Application
Start the server:
npm start
Now visit the application at:
👉 http://localhost:3000

