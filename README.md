# 💧 JAL TARAANG - Smart Rainwater Harvesting App

![Project Status](https://img.shields.io/badge/Status-Active-green)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20TypeScript%20|%20Vite-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Jal Taraang** is a smart rainwater harvesting application designed to empower households and communities to conserve water. It combines **Augmented Reality (AR)**, **AI-driven recommendations**, and **smart assessment tools** to make water conservation accessible and efficient.

## ✨ Key Features

* **📊 Smart Assessment Tool**: Calculate your home's annual rainwater harvesting potential and estimated financial savings based on roof area and rainfall data.
* **👓 AR Visualization**: Visualize water tanks and recharge structures (pits, trenches) in your actual space using Augmented Reality.
* **🤖 AI Tank Recommendation**: Get personalized recommendations for tank size and type based on your family size, property type, and daily usage.
* **🗣️ Voice & Chat Assistant**: Integrated AI chatbot and voice assistant for accessible, hands-free navigation and support.
* **📚 Knowledge Hub**: Comprehensive guides on artificial recharge techniques (Recharge Pits, Shafts, Trenches) and cost guidance.
* **🌍 Community Impact**: Track neighborhood water conservation statistics and "Jal Taraang" teams.

## 🛠️ Tech Stack

* **Frontend**: React, TypeScript, Vite
* **Styling**: Tailwind CSS, Shadcn UI
* **Animations**: Framer Motion
* **State Management**: React Context API
* **Icons**: Lucide React

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/sanket1505/JAL-TARAANG-.git](https://github.com/sanket1505/JAL-TARAANG-.git)
    cd JAL-TARAANG-
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📱 Project Structure

```bash
src/
├── components/        # UI Components (Assessment, AR, Home, etc.)
├── contexts/          # Context Providers (Location, Language)
├── assets/            # Images and static assets
├── styles/            # Global styles and Tailwind config
├── App.tsx            # Main application component
└── main.tsx           # Entry point
