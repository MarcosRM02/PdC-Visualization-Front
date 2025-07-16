<div align="center">
    <img width="300" height="168" alt="MAmI_logo" src="https://github.com/user-attachments/assets/871eedfe-0812-4ac1-9679-3f49ba5aea1f" />
    <img width="293" height="168" alt="download" src="https://github.com/user-attachments/assets/a2c11698-f795-448f-8edd-64595c8258a3" />
</div>

This repository is a core component of the MVP‑Gait toolkit, developed to support the [SSITH](https://mamilab.eu/ssith-project/) project and to advance research in human gait analysis. The toolkit comprises a collection of interoperable services, including an API, a front-end web application, and an animation generator microservice.

# **MVP-Gait Web Service for managing and visualizing research data**
This web service, built with React, provides tools for managing and visualizing research data related to human gait studies. It offers interactive modules to explore datasets, view animation outputs, and support research workflows in gait analysis.

<img width="4408" height="2475" alt="Imagen1" src="https://github.com/user-attachments/assets/ec3adc87-9d56-4020-84b1-3da5fae18fe1" />

## 🚀 Features

- **Secure Authentication** with login and protected routes.
    
- **Full CRUD** for:
    
    - Experiments
        
    - Participants
        
    - Participant templates and personal data
        
    - Trials and trial templates
        
- **Interactive visualizations** of wearable sensor data.
- **Routing** via React Router with access control through `PrivateRoute`.
- **Cookie Policy** support via a dedicated component.
    

## 🛠️ Technologies

- **Framework**: React + TypeScript + Vite
    
- **Styling**: Tailwind CSS
    
- **HTTP**: Axios for REST API calls
    
- **Visualization**: Plotly.js
    
- **Data Handling**: Danfo.js

## 📋 Requirements

- Node.js >= 16
    
- npm >= 8
    
- Docker (optional, for containerization)
    

## 🔧 Installation

```bash
# Clone the repository
git clone <repository-url>
cd PdC-Visualization-Front

# Install dependencies
npm install
# or run ./install.sh
```

## 🏃‍♂️ Development

```bash
# Start the development server
npm run dev
```

- The app will run at `http://localhost:5173/`.
    
- Hot Module Replacement (HMR) is enabled by default.
    

## 📦 Production Build

```bash
# Create an optimized production build
npm run build
# or run ./build.sh
```

- Output files in the `dist/` folder.
    
- Preview with `npm run preview`.
    

## 🐳 Docker Usage

```bash
# Build the Docker image
docker build -t pdc-visualization-front .

# Run the container
docker run -d -p 5173:80 pdc-visualization-front
```

## 📁 Project Structure

```
PdC-Visualization-Front/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images & JSON data
│   ├── Components/        # Reusable React components
│   ├── Interfaces/        # TypeScript types & interfaces
│   ├── Services/          # Business logic & API calls
│   ├── PrivateRoute.tsx   # Route guard component
│   ├── App.tsx            # Main layout & routing
│   └── main.tsx           # Entry point
├── Dockerfile
├── install.sh
├── build.sh
├── package.json
└── vite.config.ts
