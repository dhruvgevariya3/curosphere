# Curosphere Web Frontend

Curosphere is a comprehensive healthcare management platform that connects patients with doctors for appointment booking and consultation services. This repository contains the frontend application built with React and Vite.

## 📋 Project Overview

Curosphere aims to streamline the healthcare experience by providing:

- **Patients**: Easy doctor discovery, appointment booking, and profile management
- **Doctors**: Patient management, clinic information, and appointment scheduling
- **Admins**: System-wide management and oversight

The web frontend provides an intuitive interface for all user types with responsive design and smooth user experience.

## ✨ Features

### Patient Features

- User registration and authentication
- Doctor discovery and search
- Appointment booking with available time slots
- Appointment history and management
- Profile management with personal details
- Password reset functionality

### Doctor Features

- Doctor registration and profile management
- Clinic information management
- Patient list viewing
- Appointment management dashboard
- Schedule updates

### Admin Features

- Admin dashboard for system oversight
- User and doctor management
- Role-based access control

## 🛠️ Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Bootstrap CSS & Custom CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **UI Components**: Bootstrap 5

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd curosphere-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Login, Signup, Navigation)
│   ├── Patient/         # Patient-specific components
│   ├── Doctor/          # Doctor-specific components
│   ├── admin/           # Admin-specific components
│   ├── elements/        # Reusable UI elements
│   └── hooks/           # Custom React hooks
├── assets/              # Static assets and designs
├── App.jsx              # Main App component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🔑 Key Components

- **HomePage**: Landing page with overview and features
- **Login/Signup**: Authentication components for users
- **DoctorList**: Browse available doctors
- **AppointmentBooking**: Schedule appointments
- **PatientDashboard**: Patient's personal dashboard
- **DoctorDashboard**: Doctor's appointment management
- **AdminDashboard**: System administration interface

## 🔗 API Integration

The application connects to the backend API at `http://localhost:3000`. Key endpoints:

- `/user/*` - User management endpoints
- `/doctor/*` - Doctor management endpoints
- `/appointment/*` - Appointment handling
- `/state/*` - State data
- `/city/*` - City data

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📝 Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support or issues, please contact the development team or open an issue in the repository.
