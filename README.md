# 🔁 Skill Swap – MERN Stack Skill Bartering Platform

**Skill Swap** is a full-stack MERN application that allows users to exchange skills with others by posting ads, browsing open barter requests, and initiating chats or video calls upon request acceptance. The platform encourages learning and collaboration through skill sharing.

---

## 🚀 Features

- 🔐 **Authentication**
  - JWT-based signup/login
  - Google login using Firebase Authentication

- 📢 **Skill Ads**
  - Users can post skills they offer or seek
  - Browse and filter other users' skill ads

- 🤝 **Barter Requests**
  - View and send barter requests to skill posts
  - Accept or reject incoming barter requests

- 💬 **Chat System**
  - Real-time messaging using **Socket.io** after request acceptance

- 🎥 **Video Calling** *(In Progress)*
  - Video call functionality being built using WebRTC & Socket.io

- ⏱️ **3-Day Expiry**
  - Barter requests expire automatically if the skill exchange doesn't happen within 3 days

- 🧑‍💼 **Profile Management**
  - Users can edit personal info and manage posted skills

---

## 🛠️ Tech Stack

- **Frontend**: React, Context API, Axios, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, Firebase Google Auth
- **Real-Time**: Socket.io
- **Deployment**: Render (backend), Vercel (frontend)

---

## 📦 Folder Structure

