# 🏥 Clinic Appointment System — Frontend

This is the **frontend** of the Clinic Appointment System built with **React.js** and **Tailwind CSS**.  
The application has **three user roles**:
- 👨‍💼 **Admin** – Full control over the system (manage doctors, patients, and appointments)
- 👨‍⚕️ **Doctor** – Manage their own appointments and availability
- 🧑‍🤝‍🧑 **Patient** – Book appointments with doctors and view their history

---

## 📁 Folder Structure Overview

```
clinic-appointment-frontend/
│
├── public/                       # Static assets (logo, favicon, etc.)
│
├── src/
│   ├── assets/                   # Images, icons, and other media files
│   │
│   ├── components/               # Shared/reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Button.jsx
│   │   ├── Table.jsx
│   │   └── Notification.jsx
│   │
│   ├── layouts/                  # Page layout wrappers per role
│   │   ├── AdminLayout.jsx
│   │   ├── DoctorLayout.jsx
│   │   └── PatientLayout.jsx
│   │
│   ├── modules/      # 🔥 Each user type (module) has its own pages
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageDoctors.jsx
│   │   │   ├── ManageAppointments.jsx
│   │   │   └── ManageSlots.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── ManageAvailability.jsx
│   │   │
│   │   └── patient/
│   │       ├── Home.jsx
│   │       ├── DoctorDetails.jsx
│   │       ├── BookAppointment.jsx
│   │       └── MyAppointments.jsx
│   │
│   ├── pages/                    # Global pages (common for all)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/                 # API integration layer
│   │   ├── api.js                # axios/fetch configuration
│   │   ├── authService.js
│   │   ├── doctorService.js
│   │   ├── patientService.js
│   │   └── adminService.js
│   │
│   ├── context/                  # Global state management (React Context)
│   │   ├── AuthContext.jsx
│   │   └── RoleContext.jsx
│   │
│   ├── routes/                   # App routing system
│   │   ├── PrivateRoute.jsx      # Role-based route protection
│   │   ├── AdminRoutes.jsx
│   │   ├── DoctorRoutes.jsx
│   │   └── PatientRoutes.jsx
│   │
│   ├── styles/                   # Global styles (Tailwind or custom CSS)
│   │   ├── index.css
│   │   └── theme.css
│   │
│   ├── utils/                    # Helper functions
│   │   ├── formatDate.js
│   │   ├── validateForm.js
│   │   └── constants.js
│   │
│   ├── App.jsx                   # Main app entry (routing setup)
│   └── main.jsx                  # Root render file
│
├── .env                          # API base URLs and secrets
├── package.json
└── tailwind.config.js
```


---

## 🧩 Folder & File Explanation

### 🗂️ `public/`
Holds static files that are directly served by the frontend.
- `favicon.ico` → Browser tab icon  
- `index.html` → Entry HTML file for React  
- `logo.png` → Application logo  

---

### 🎨 `src/assets/`
Stores static media used in the app such as:
- Images (e.g., doctor avatars, banners)
- Icons and SVGs
- Backgrounds and logos

---

### 🧱 `src/components/`
Contains **reusable UI components** used across all modules.

| File | Description |
|------|--------------|
| `Navbar.jsx` | Top navigation bar for all pages |
| `Sidebar.jsx` | Role-based sidebar navigation (Admin/Doctor/Patient) |
| `Card.jsx` | Reusable card layout for doctor info, stats, etc. |
| `Modal.jsx` | Reusable modal popup for confirmations/forms |
| `Button.jsx` | Custom button with consistent design |
| `Table.jsx` | Generic table component for displaying lists |
| `Notification.jsx` | Alert/toast notification component |

---

### 🧩 `src/layouts/`
Defines **layout wrappers** for each role-based dashboard.

| File | Description |
|------|--------------|
| `AdminLayout.jsx` | Page wrapper for all admin routes (includes Admin sidebar + header) |
| `DoctorLayout.jsx` | Page wrapper for doctor routes (includes Doctor sidebar + header) |
| `PatientLayout.jsx` | Page wrapper for patient routes (includes Patient navbar + content) |

---

### 🏗️ `src/modules/`
Contains pages and components for each **user module** (Admin, Doctor, Patient).

#### **Admin Module**
| File | Description |
|------|--------------|
| `Dashboard.jsx` | Displays overall stats and analytics |
| `ManageDoctors.jsx` | Manage doctor profiles (add/edit/delete) |
| `ManageAppointments.jsx` | View or manage all appointments in the system |
| `ManageSlots.jsx` | Set or modify available doctor time slots |

#### **Doctor Module**
| File | Description |
|------|--------------|
| `Dashboard.jsx` | Doctor’s personal overview (appointments & schedule) |
| `MyAppointments.jsx` | List of all appointments booked with this doctor |
| `ManageAvailability.jsx` | Doctor’s slot and availability management |

#### **Patient Module**
| File | Description |
|------|--------------|
| `Home.jsx` | Landing page showing available doctors |
| `DoctorDetails.jsx` | Detailed profile view of a doctor |
| `BookAppointment.jsx` | Booking form to choose time slot and confirm appointment |
| `MyAppointments.jsx` | List of all appointments booked by the patient |

---

### 🌐 `src/pages/`
Holds global or shared pages that are not specific to a user role.

| File | Description |
|------|--------------|
| `Login.jsx` | Login page for all user types |
| `Register.jsx` | Registration page for new users |
| `NotFound.jsx` | 404 page shown when a route doesn’t exist |

---

### 🔌 `src/services/`
Handles **API calls** and external communication logic.  
Uses `axios` or `fetch` to talk to backend APIs.

| File | Description |
|------|--------------|
| `api.js` | Global axios configuration (base URL, headers, interceptors) |
| `authService.js` | Handles login, logout, and authentication requests |
| `doctorService.js` | API calls related to doctor management and schedule |
| `patientService.js` | API calls for booking/canceling appointments |
| `adminService.js` | API calls for admin actions like managing doctors and slots |

---

### ⚙️ `src/context/`
Holds **React Context API** logic for global state management.

| File | Description |
|------|--------------|
| `AuthContext.jsx` | Manages authentication (login, logout, user session) |
| `RoleContext.jsx` | Provides role-based access and permissions (admin/doctor/patient) |

Used in combination with `PrivateRoute` for route protection.

---

### 🚦 `src/routes/`
Defines **route configurations** and role-based route protection.

| File | Description |
|------|--------------|
| `PrivateRoute.jsx` | Wrapper that checks login before allowing access |
| `AdminRoutes.jsx` | All admin-only routes |
| `DoctorRoutes.jsx` | All doctor-only routes |
| `PatientRoutes.jsx` | All patient-only routes |

---

### 💅 `src/styles/`
Contains global styles and Tailwind configuration files.

| File | Description |
|------|--------------|
| `index.css` | Main CSS file imported in the app (usually Tailwind imports) |
| `theme.css` | Custom color themes, gradients, and typography overrides |

---

### 🧠 `src/utils/`
Helper functions and constants used across the app.

| File | Description |
|------|--------------|
| `formatDate.js` | Converts and formats dates in a readable format |
| `validateForm.js` | Form validation utility for login/register forms |
| `constants.js` | Stores constant values (e.g., API endpoints, role names) |

---

### 🧩 `App.jsx`
Main component that defines the **routing structure** of the application.  
It imports route files, layouts, and context providers.

---

### 🚀 `main.jsx`
Entry point of the app that renders `<App />` to the DOM.  
Also wraps the app with:
```jsx
<AuthProvider>
  <RoleProvider>
    <App />
  </RoleProvider>
</AuthProvider>
