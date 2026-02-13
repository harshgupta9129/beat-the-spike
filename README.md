# ⚡ Beat The Spike - Master Your Metabolic Health

![Project Banner](https://raw.githubusercontent.com/harshgupta9129/spring/main/banner.jpg)

> **"What gets measured, gets managed."** 
> Beat The Spike is a gamified metabolic health tracker that helps users visualize their glucose spikes, understand their body's response to food, and take corrective actions in real-time.

---


## 💻 Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ArunIsharwal/Mcode.git
    cd Mcode
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create a .env file with:
    # MONGODB_URI=mongodb+srv://rockstar221405_db_user:1S2bTC2jBVuwcywg@cluster0.wwjfoeq.mongodb.net/sugar?appName=Cluster0
    # PORT=5000
    npm run start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    # Create a .env.local file with:
    # VITE_API_URL=http://localhost:5000
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:3000/` to start crusing spikes!

---

## 💡 Inspiration: The Invisible Rollercoaster

Every day, millions of people ride an invisible hormonal rollercoaster. The "post-lunch slump," the sudden brain fog, the 3 PM cravings—these aren't just personality quirks; they are biological responses to **glucose spikes**.

Modern diets are saturated with hidden sugars, leading to inflammation, insulin resistance, and long-term metabolic damage. But because this happens *internally*, most people are flying blind.

**We built Beat The Spike to make the invisible visible.** We wanted to answer a simple question: *What if managing your health was as addictive as a video game?*

## 🚀 What it does

Beat The Spike is a full-stack web application that acts as your personal metabolic dashboard.

*   **⚡ Real-Time "Metabolic Saturation" Meter**: Visualizes your daily sugar intake against a personalized limit. As you log food, the meter fills up, changing color from Green (Safe) to Red (Danger).
*   **🔮 AI-Powered Prediction**: Logs common items (Soda, Coffee, Snacks) and instantly estimates the glycemic load and potential spike.
*   **🛡️ Smart Recommendations**: When a spike is detected, the app suggests immediate corrective actions (e.g., "Take a 10-minute walk") to neutralize the impact.
*   **🎮 Gamification Engine**: 
    *   **XP System**: Earn Experience Points for staying in the "Green Zone" and completing challenges.
    *   **Streaks**: Build habits by logging daily.
    *   **Leaderboard**: Compete with other "Sugar Warriors" globally.
*   **📊 Dynamic Visualization**: Interactive heatmaps and charts show your metabolic history over time.

## 🛠️ How we built it

We chose a modern **MERN Stack** (MongoDB, Express, React, Node.js) turbocharged with **Vite** for performance.

### **Frontend**
*   **React (Vite)**: For a lightning-fast, reactive user interface.
*   **Tailwind CSS**: For a sleek, futuristic "Dark Mode" aesthetic.
*   **Framer Motion**: To create silky-smooth animations (page transitions, meter fills, modal popups) that make the app feel alive.
*   **Recharts**: For rendering complex data visualizations (Area charts, heatmaps).
*   **Zustand**: For robust global state management (User profile, history, leaderboard).
*   **Lucide React**: For beautiful, consistent iconography.

### **Backend**
*   **Node.js & Express**: Handling API routes, authentication, and game logic.
*   **MongoDB (Atlas)**: Storing user profiles, event logs, and leaderboard data.
*   **Mongoose**: For strict schema validation and data modeling.

### **Key Algorithms**
*   **Spike Logic**: We implemented a custom algorithm that calculates "Metabolic Saturation" based on a user's BMI, activity level, and recent intake.
*   **Leaderboard Aggregation**: Uses MongoDB Aggregation Pipelines to categorize scores by Daily and Monthly timeframes in real-time.

## 🧠 Challenges we ran into

*   **Visualizing "Invisible" Data**: Representing abstract concepts like "glucose load" in a way that is intuitive to a layperson was difficult. We iterated through bar charts and line graphs before settling on the circular "Shield" meter, which provides instant emotional feedback.
*   **Gamification Balance**: We had to tune the XP system carefully. If it's too hard, users quit. If it's too easy, it's boring. We added "Corrective Action Bonuses" to reward positive behavior, not just punishment for eating sugar.
*   **State Persistence**: Ensuring the leaderboard and user history loaded instantly required optimizing our `Zustand` state with local storage persistence and efficient backend syncing.

## 🏅 Accomplishments that we're proud of

*   **The UI/UX**: It genuinely feels like a premium app. The glassmorphism, the neon accents, and the micro-interactions are polished.
*   **The "Burn Mode"**: We implemented a working timer for the "10-minute walk" feature. It doesn't just tell you to walk; it counts down with you.
*   **Global Layout**: The app is fully responsive and works beautifully on mobile devices (where most people log food).

## 🔮 What's next for Beat The Spike

*   **Wearable Integration**: Syncing with Apple Health / Fitbit to pull real activity data.
*   **Computer Vision Logging**: Snap a photo of your food, and AI identifies the sugar content automatically.
*   **Social Squads**: Team up with friends to keep the collective "Squad Score" high.
*   **PWA Support**: Making it installable as a native app on iOS and Android.

---
*Built with ❤️ by The Bug Smashers.*
