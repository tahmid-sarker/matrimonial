# Matrimonial (Matrimony Management)

- [**View Live**](https://tahmid-sarker.github.io/matrimonial/)

Matrimonial is a modern matrimony management web application designed to help Bengali singles and families find suitable matches, manage biodata, and connect with others. The platform offers a secure, user-friendly experience for both regular users and administrators.

> [!TIP]
> **Test User Credentials:**
> - **Email**: `tahmid@engineer.com`
> - **Password**: `Abc@123456`
> 
> **Test Admin Credentials:**
> - **Email**: `contact.tahmid.sarker@gmail.com`
> - **Password**: `Abc@123456`

## Features

* **Authentication** – Firebase-based user login, registration, and password reset
* **BioData Management** – Create, edit, and view biodata profiles
* **Favourites & Success Stories** – Save favourite profiles and share success stories
* **Admin Dashboard** – Approve premium users, manage biodatas, users, payments, and success stories
* **User Dashboard** – Update profile, edit biodata, manage favourites, and mark as married
* **Contact & Feedback** – Contact form for user messages
* **Payment Integration** – Premium membership and payment management
* **Dark Mode Support** – Toggle between light and dark themes
* **Role-Based Access** – Admin and user route protection
* **Responsive Design** – Fully mobile-friendly with modern UI

## Tech Stack

| Category       | Tools                               |
| -------------- | ------------------------------------|
| Frontend       | React, TanStack Query               |
| Styling        | Tailwind CSS, daisyUI               |
| HTTP Client    | Axios                               |
| Payments       | Stripe                              |
| Backend        | Node.js, Express                    |
| Database       | MongoDB                             |
| Auth & Hosting | Firebase (Auth + Hosting), JWT      |
| Deployment     | GitHub Pages (client) + Vercel (API) |

## Routing Overview

| Route                              | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| `/`                                | Home page                                     |
| `/about-us`                        | About Us                                      |
| `/contact-us`                      | Contact Us                                    |
| `/biodatas`                        | All Biodatas                                  |
| `/biodata/:id`                     | Biodata Details *(protected)*                 |
| `/checkout/:biodataId`             | Checkout/Payment *(protected)*                |
| `/my-profile`                      | My Profile *(protected)*                      |
| `/my-biodata`                      | My Biodata *(protected)*                      |
| `/dashboard/manage-users`          | Admin: Manage Users *(admin only)*            |
| `/dashboard/manage-biodatas`       | Admin: Manage Biodatas *(admin only)*         |
| `/dashboard/approve-premium`       | Admin: Approve Premium *(admin only)*         |
| `/dashboard/stories`               | Admin: Success Stories *(admin only)*         |
| `/dashboard/payment-list`          | Admin: Payment List *(admin only)*            |
| `/dashboard/contact-messages`      | Admin: Contact Messages *(admin only)*        |
| `/dashboard/update-profile`        | User: Update Profile *(user only)*            |
| `/dashboard/edit`                  | User: Edit Biodata *(user only)*              |
| `/dashboard/favorites`             | User: Favourites *(user only)*                |
| `/dashboard/married`               | User: Got Married *(user only)*               |
| `*`                                | Error/404                                     |

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tahmid-sarker/matrimonial.git
   cd matrimonial
   ```

2. **Install root, client, and server dependencies**:

   ```bash
   npm install
   npm run install:all
   ```

3. **Setup Environment Variables**

   Copy `client/.env.example` to `client/.env.local` and `server/.env.example` to `server/.env.local`, then fill in your values.

4. **Start client and server together** (from the project root):

   ```bash
   npm run dev
   ```

   This runs the Express API and the Vite client at the same time. To run them separately: `npm run dev:server` or `npm run dev:client`.

5. Open `http://localhost:5173` in your browser to view the project.

## Project Structure

```
client/
└── src/
     ├── assets/
     ├── components/
     │   ├── auth/
     │   │   ├── ForgetPassword.jsx
     │   │   ├── Login.jsx
     │   │   └── Register.jsx
     │   └── shared/
     │       ├── DarkModeToggler.jsx
     │       └── DynamicTitle.jsx
     ├── config/
     │   └── firebase.config.js
     ├── context/
     │   ├── AuthContext.jsx
     │   ├── AuthProvider.jsx
     │   ├── ThemeContext.jsx
     │   └── ThemeProvider.jsx
     ├── hooks/
     │   ├── useAuth.jsx
     │   └── useAxiosSecure.jsx
     ├── layout/
     │   ├── DashboardLayout.jsx
     │   ├── Footer.jsx
     │   ├── Header.jsx
     │   └── MainLayout.jsx
     ├── pages/
     │   ├── AboutUs.jsx
     │   ├── BioData.jsx
     │   ├── ContactUs.jsx
     │   ├── Error.jsx
     │   ├── MyProfile.jsx
     │   ├── BioData/
     │   │   ├── BioDatas.jsx
     │   │   └── BioDetails.jsx
     │   ├── Dashboard/
     │   │   ├── Admin/
     │   │   │   ├── ApprovePremium.jsx
     │   │   │   ├── ContactMessages.jsx
     │   │   │   ├── ManageBiodatas.jsx
     │   │   │   ├── ManageUsers.jsx
     │   │   │   ├── PaymentList.jsx
     │   │   │   └── SuccessStories.jsx
     │   │   └── User/
     │   │       ├── EditBioData.jsx
     │   │       ├── FavouriteList.jsx
     │   │       ├── GotMarried.jsx
     │   │       └── UpdateProfile.jsx
     │   ├── Home/
     │   │   ├── Banner.jsx
     │   │   ├── FeaturedMembers.jsx
     │   │   ├── Home.jsx
     │   │   ├── HowItWorks.jsx
     │   │   ├── Stats.jsx
     │   │   └── SuccessStory.jsx
     │   └── Payment/
     │       ├── Payment.jsx
     │       └── PaymentFrom.jsx
     ├── routes/
     │   ├── AdminRoutes.jsx
     │   ├── PrivateRoutes.jsx
     │   ├── Router.jsx
     │   └── UserRoutes.jsx
     ├── index.css
     ├── main.jsx
     └── index.html

server/
└── index.js
```

## Credits

This project was developed by [Tahmid Sarker](https://tahmid-sarker.github.io).