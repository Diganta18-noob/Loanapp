<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:f59e0b,100:d97706&height=200&section=header&text=💰%20LoanApp&fontSize=55&fontColor=fef3c7&animation=twinkling&fontAlignY=35&desc=AI-Powered%20Smart%20Loan%20Management%20Platform&descSize=18&descColor=ffffff&descAlignY=55" alt="Header"/>
</p>

<p align="center">
  <a href="#"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=F59E0B&center=true&vCenter=true&width=700&lines=🤖+AI-Powered+Loan+Assistant;💳+Smart+Loan+Application+%26+Tracking;📊+Financial+Analytics+Dashboard;🔐+Secure+Document+Upload;💬+Groq+AI+Chatbot+Integration;📱+Modern+Material+UI+Design" alt="Typing SVG" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/MUI-7.3-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI"/>
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-9.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Groq_AI-🤖-ff6b35?style=for-the-badge" alt="Groq AI"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Diganta18-noob/Loanapp?style=flat-square&color=f59e0b" alt="Last Commit"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/AI%20Powered-Yes-ff6b35?style=flat-square" alt="AI Powered"/>
</p>

---

<h2 align="center">🧠 Where Finance Meets Artificial Intelligence</h2>

<p align="center">
<b>LoanApp</b> is an intelligent, full-stack loan management platform that leverages <b>Groq AI</b> and <b>Google Generative AI</b> to provide smart loan assistance, automated document processing, and an AI-powered chatbot for instant customer support.
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## 🌟 What Makes LoanApp Special?

<table>
<tr>
<td width="50%" align="center">

### 🤖 AI-Powered Chatbot
Intelligent FAQ answering powered by<br/>
**Groq SDK** + **Google Generative AI**<br/>
Instant responses to loan queries

</td>
<td width="50%" align="center">

### 💳 Smart Loan Processing
End-to-end loan lifecycle management<br/>
Application → Review → Approval<br/>
with real-time status tracking

</td>
</tr>
<tr>
<td width="50%" align="center">

### 📄 Document Management
Secure file uploads via **Multer**<br/>
Support income proofs, ID docs<br/>
Automated document verification

</td>
<td width="50%" align="center">

### 🎨 Premium UI/UX
Material UI v7 + Framer Motion<br/>
Smooth animations & transitions<br/>
Responsive across all devices

</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## ✨ Feature Breakdown

<details>
<summary><b>💬 AI Chatbot Engine</b></summary>
<br/>

- 🧠 Powered by **Groq SDK** for ultra-fast inference
- 🤖 **Google Generative AI** integration for rich responses
- 📚 Pre-seeded FAQ database (`seedFaqs.js`)
- 💡 Context-aware conversations
- ⚡ Sub-second response times

</details>

<details>
<summary><b>💰 Loan Management</b></summary>
<br/>

- 📝 Multi-step loan application forms
- 📊 Loan status tracking dashboard
- 🔄 Application lifecycle management
- 💵 EMI calculation tools
- 📈 Financial analytics

</details>

<details>
<summary><b>🔐 Security & Auth</b></summary>
<br/>

- 🔑 JWT-based authentication
- 🔒 bcryptjs password encryption
- 🛡️ Protected API routes
- 📝 Role-based access control
- 🍪 Secure session management

</details>

<details>
<summary><b>📄 Document Processing</b></summary>
<br/>

- 📎 Multi-file upload support (Multer)
- 🗂️ Organized file storage system
- ✅ Document type validation
- 🔒 Secure file access controls

</details>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## 🏗️ Architecture

```
Loanapp/
├── 🎨 client/                      # React 19 + Vite + MUI v7
│   ├── public/
│   ├── src/
│   │   ├── components/             # MUI-based UI components
│   │   ├── store/                  # Redux Toolkit slices
│   │   ├── pages/                  # Route pages
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ⚙️ server/                      # Express 5 + MongoDB
│   ├── controllers/                # Business logic
│   ├── middleware/                  # Auth & validation
│   ├── models/                     # Mongoose schemas
│   ├── routes/                     # API endpoints
│   ├── utils/                      # Helper functions
│   ├── uploads/                    # Document storage
│   ├── test/                       # Test suites
│   ├── seedFaqs.js                 # FAQ seed data
│   ├── server.js                   # Entry point
│   └── package.json
│
├── 🤖 chatbot/                     # AI Chatbot Module
│
├── 📸 srs img/                     # SRS documentation images
│
└── README.md
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## 🛠️ Tech Stack

<table align="center">
<tr>
<td align="center"><b>🎨 Frontend</b></td>
<td align="center"><b>⚙️ Backend</b></td>
<td align="center"><b>🤖 AI & Tools</b></td>
</tr>
<tr>
<td>

| Tech | Purpose |
|:----:|:-------:|
| ⚛️ React 19 | UI Framework |
| ⚡ Vite 7 | Build Tool |
| 🧩 MUI v7 | Component Library |
| 📦 Redux Toolkit | State Management |
| 🎭 Framer Motion | Animations |
| 🗺️ React Router 7 | Routing |
| 🎯 React Icons | Icon Library |
| 🔔 React Toastify | Notifications |

</td>
<td>

| Tech | Purpose |
|:----:|:-------:|
| 🚀 Express 5 | API Server |
| 🍃 Mongoose 9 | MongoDB ODM |
| 🔐 JWT | Auth Tokens |
| 🔑 bcryptjs | Encryption |
| 📎 Multer 2 | File Uploads |
| 🔄 Axios | HTTP Client |
| 🌐 CORS | Cross-Origin |
| 📦 dotenv | Config |

</td>
<td>

| Tech | Purpose |
|:----:|:-------:|
| 🧠 Groq SDK | AI Inference |
| 🤖 Google Gen AI | NLP Engine |
| 💬 Chatbot Module | User Support |
| 📚 FAQ Seeder | Knowledge Base |
| ⚙️ Nodemon | Dev Server |

</td>
</tr>
</table>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+  •  MongoDB  •  Groq API Key  •  Google AI API Key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Diganta18-noob/Loanapp.git
cd Loanapp

# ── Server Setup ──
cd server
npm install
node seedFaqs.js               # Seed the FAQ database
npm run dev                     # Starts on http://localhost:5000

# ── Client Setup ──
cd ../client
npm install
npm run dev                     # Starts on http://localhost:5173
```

### Environment Variables

```env
# server/.env
MONGODB_URI=mongodb://localhost:27017/loanapp
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GOOGLE_AI_API_KEY=your_google_ai_key

# client/.env
VITE_API_URL=http://localhost:5000
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" alt="divider"/>

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/SmartFeature`)
3. Commit changes (`git commit -m 'Add SmartFeature'`)
4. Push to branch (`git push origin feature/SmartFeature`)
5. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:f59e0b,100:d97706&height=120&section=footer" alt="Footer"/>
</p>

<p align="center">
  <b>💰 Smart Lending, Powered by AI</b><br/>
  <b>⭐ Star this repo to support the project!</b>
</p>
