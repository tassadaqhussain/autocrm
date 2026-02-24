# AutoCRM - Enterprise Clinic Management System

A comprehensive, scalable, and modern enterprise Customer Relationship Management (CRM) system tailored for clinics. Provides advanced modular capabilities across HR, Finance, Marketing, and Operations with a robust Role-Based Access Control (RBAC) foundation.

Built with bleeding-edge tools, this project emphasizes performance, aesthetics, and developer experience.

## 🚀 Tech Stack

*   **Backend:** Laravel (v12.x) - PHP 8.3
*   **Frontend:** React (v18.x) with Inertia.js
*   **Styling:** TailwindCSS (v4.x)
*   **Icons & UI:** Lucide React, Recharts (for Analytics)
*   **Database:** MySQL
*   **Package Managers:** Composer, NPM

## ✨ Core Modules

### 1. Dynamic RBAC System
*   Database-driven Roles and Permissions management.
*   Granular permissions allowing specific UI rendering based on the user's role limits constraints.
*   Matrix-style Settings dashboard for Admins to toggle access logic freely.

### 2. Marketing Hub
*   **Dashboard & Analytics:** Recharts integration for complex lead/conversion data distribution.
*   **Campaign Management:** Manage and monitor marketing drives alongside their generated reach.
*   **Influencer & Sources:** Track lead attribution to designated channels or content creators.
*   **Library:** Dynamic creative control.

### 3. HR & Clinic Architecture
*   **Clinic Profile:** Global identity settings control.
*   **Hierarchy Modeling:** Setup dynamic **Departments** and map corresponding **Designations**.
*   **Employees & Staffing:** Full employee tracking.

### 4. CRM & Leads Flow
*   Seamless migration of leads to formal patients.
*   Pipeline monitoring via 'Deals'.
*   Patient interaction and appointment tracking.
*   Full visual pipeline tracking.

### 5. Finance Management
*   Directly manage proposals, invoices, and estimates.
*   Track clinic expenses, credit notes, and associated bank accounts interactively.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tassadaqhussain/autocrm.git
   cd autocrm
   ```

2. **Install PHP Dependencies:**
   ```bash
   composer install
   ```

3. **Install Node Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Note: Ensure you configure your database connection parameters in your `.env` file.*

5. **Database Migrations & Seeding:**
   ```bash
   php artisan migrate --seed
   ```
   *This seeds core permissions, default roles (Admin, Doctor, Counselor, Media Manager), modules, dummy clinic data, and super-user credentials.*

6. **Serve the Application:**
   ```bash
   # Terminal 1 - Serve Laravel Backend
   php artisan serve

   # Terminal 2 - Compile Frontend Assets
   npm run dev
   ```

## 🔒 Security

*   Endpoints handling HR/Finance are strictly gated via `['role:Admin']` and specific permissions arrays. 
*   Inertia's HTTP Middleware abstracts validation requests safely from clients.

## 📝 License

This project is proprietary and confidential. Unauthorized copying of this project, via any medium, is strictly prohibited.
