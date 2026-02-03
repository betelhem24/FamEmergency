# ❓ Instructor Q&A: Master Your Presentation

Here are the most likely questions your instructor will ask, with "Full-Stack Pro" answers.

### Q1: Where exactly is the data saved?
**Answer**: Our app uses a hybrid approach. 
1.  **Structured Data**: Medical records and User profiles are managed via **Prisma** into a **PostgreSQL** database (perfect for strict data like health info).
2.  **Flexible Data**: Community posts, comments, and real-time location logs are stored in **MongoDB** using **Mongoose**. This allows us to scale social features quickly without rigid schemas.

### Q2: How does the Real-Time SOS work?
**Answer**: It uses **WebSockets (via Socket.io)**. Unlike standard HTTP requests where the client has to "ask" for data, WebSockets keep an open "pipe." When someone triggers an SOS, the server "pushes" that event to every family member's device instantly.

### Q3: Why did you choose TypeScript over regular JavaScript?
**Answer**: For an emergency app, **reliability is everything**. TypeScript allows us to define "Interfaces." For example, we define an `IMedicalRecord`. If I try to save a record without a Blood Type, TypeScript will give me an error *before* the code even runs. It's an extra layer of safety.

### Q4: Explain the "Glassmorphism" in your CSS.
**Answer**: The design uses `backdrop-filter: blur()`. It creates a frosted-glass effect that keeps the focus on the foreground content while maintaining a sense of depth. It's used in `index.css` via custom CSS Variables like `--glass-bg`.

### Q5: How do you handle file/image uploads for medical records?
**Answer**: We use **Multer** as middleware on our Node.js server. The images themselves are saved in the `backend/uploads/` folder, and the *path* (the URL) to those images is saved in the MongoDB medical record document.

### Q6: If the phone is locked, how does the QR code help?
**Answer**: The user is encouraged to keep the QR code on their lock screen or as a physical sticker. A paramedic scans it, and our **DoctorDashboard** (protected by Medical License verification) fetches the data directly from our API without needing the patient's phone to be unlocked.

### Q7: What was the hardest part of the project?
**Answer**: Managing the **Global State**. Handling real-time location updates while ensuring the user remains authenticated across different pages required careful use of **React Context** and **Redux Toolkit**.

### Q8: How is the theme switching handled?
**Answer**: We have a `ThemeContext` that wraps the entire app. It saves the user's choice (Light, Dark, or Blue) in **LocalStorage**. When the app loads, it reads that value and applies the corresponding CSS class to the `<body>` element, which updates all the colors instantly using CSS variables.
