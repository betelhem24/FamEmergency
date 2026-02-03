# FamEmergency

**FamEmergency** is a real-time **"safety heartbeat"** that makes sure you're never alone in a crisis. It uses **WebSockets and GPS** to act as a digital **Guardian**, automatically alerting family or nearby help if you don’t check in or if an emergency is triggered. 

I’m building this because when **seconds count**, having your location and **medical info** instantly in the hands of rescuers can literally be the difference between **life and death**. This project bridges the **"information gap"** by sharing life-saving data before it's too late.

## 🚀 MVP Features
* **Real-Time SOS & GPS Tracking**: One-tap emergency broadcast via WebSockets.
* **Medical Profile CRUD**: Secure management of vital health data.
* **The Guardian Timer**: Automated "dead-man's switch" safety countdown.

## ✨ Advanced Features
* **AI Medication Scanner**: Camera-based OCR to identify and log medications.
* **Emergency QR "Life-Key"**: Lock-screen bypass for paramedics to see health data.
* **Community "Help Nearby" Alerts**: Geospatial logic to alert nearby CPR volunteers.

## 🛠️ Tech Stack & Architecture

### Core Web Technologies
* **Frontend**: HTML5 & CSS3 (Advanced Glassmorphism & Dynamic CSS Variables)
* **Logic**: JavaScript (via TypeScript), TypeScript
* **State Management**: Redux Toolkit for centralized data flow
* **Backend**: Node.js (Runtime)
* **API Architecture**: REST API powered by Express.js
* **Database**: MongoDB + Mongoose (High-Performance NoSQL)
* **Security**: JWT Authentication + bcrypt for encrypted password hashing

### Frameworks & Libraries
* **React 18**: Component-based UI with interactive hooks
* **Express.js**: Backend framework for robust routing
* **Socket.io**: Real-time bi-directional event communication

### Data & Visualization
* **Analytics Dashboard**: Interactive charts and data visualization (e.g., `AnalyticsTab.tsx`) to track vitals and emergency metrics.

## 🔮 Future / Planned Additions
* **SQL Database Implementation**: Integrating relational data for complex reporting (Prisma/SQL).
* **ChatGPT/AI Integration**: Intelligent AI Assistant for emergency response guidance.
* **Enhanced Data Visualization**: Deep-dive health analytics and trend forecasting.
* **Machine Learning & Deep Learning**: Predictive analytics for health emergencies.
* **Computer Vision**: Advanced OCR and diagnostic assistance through the camera.

---
Development: `npm run dev` | Port: 5000 (Backend) / 5173 (Frontend)