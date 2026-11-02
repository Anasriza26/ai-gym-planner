# 💪 AI Gym Planner

**Your AI-powered personal fitness planning assistant.**

AI Gym Planner is a full-stack fitness web application that helps users manage fitness profiles, generate personalized workout plans using AI, and access saved workout history.

Built with Next.js, TypeScript, Neon PostgreSQL, and Gemini AI, the project demonstrates full-stack development, authentication, database integration, and AI-powered workout generation.

<p align="center">
  <strong>Personalized Fitness • AI Workout Planning • Progress Tracking</strong>
</p>

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- Password hashing with bcrypt
- Email verification workflow using OTP
- Protected pages and API endpoints
- Sign-out functionality
- User-specific workout plan access

### 🧍 Fitness Profile
- Create and update fitness profiles
- Store age, height, weight, fitness goal, and experience level
- Load saved profile information
- Persist profile data in PostgreSQL

### 🤖 AI Workout Generation
- Generate workout plans with Gemini AI
- Personalize plans using fitness goals and experience level
- Support different workout goals and training experience levels
- Save generated plans for future access

### 📚 Workout History
- Save workout plans in Neon PostgreSQL
- Retrieve previously saved plans
- Associate workout records with the authenticated user

### 🎨 User Interface
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Reusable interface components

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack web framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable UI components |
| Neon PostgreSQL | Cloud-hosted relational database |
| `@neondatabase/serverless` | PostgreSQL connectivity |
| Auth.js / NextAuth | Authentication and sessions |
| `bcryptjs` | Password hashing |
| Gemini AI | AI-powered workout generation |
| Resend | Email delivery for verification |

---

## 🏗️ Application Architecture

```text
User
 │
 ▼
Next.js Application
 │
 ├── Authentication
 │    ├── Registration
 │    ├── Login
 │    ├── Email Verification
 │    └── Sign Out
 │
 ├── Fitness Profile
 │    ├── Create Profile
 │    ├── Read Profile
 │    └── Update Profile
 │
 ├── AI Workout Generation
 │    └── Gemini AI
 │
 ├── Workout History
 │    ├── Save Plans
 │    └── Retrieve Plans
 │
 ▼
Neon PostgreSQL
```

---

## 📂 Project Structure

The following is a representative structure. Check your repository for the exact paths and filenames.

```text
ai-gym-planner/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── workout-plan/
│   │   │   └── workout-plans/
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   └── verify-email/
│   ├── components/
│   ├── lib/
│   │   ├── db.ts
│   │   └── otp-service.ts
│   ├── types/
│   └── auth.ts
├── public/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install the following tools and create the necessary service accounts:

- Node.js LTS
- npm
- Git
- Neon PostgreSQL account
- Gemini API access
- Resend account for email delivery

### 1. Clone the repository

```bash
git clone https://github.com/Anasriza26/ai-gym-planner.git
cd ai-gym-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the environment variables required by your application:

```env
DATABASE_URL="YOUR_NEON_DATABASE_URL"
AUTH_SECRET="YOUR_AUTH_SECRET"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
RESEND_API_KEY="YOUR_RESEND_API_KEY"
```

**Important:** These names are examples. Use the exact variable names referenced in your source code. If your Gemini integration uses a different variable name, keep your implementation's existing name.

Generate an authentication secret using a supported Auth.js command or a cryptographically secure generator.

Never commit real API keys, passwords, database URLs, or `.env.local` to GitHub.

### 4. Configure the database

Create a Neon PostgreSQL project and set `DATABASE_URL`.

Create the database tables required by your application. The current project uses tables for:

- `users`
- `fitness_profiles`
- `workout_plans`
- `email_verification_codes`

Use the actual SQL schema and constraints from your project. Configure appropriate primary keys, foreign keys, and unique constraints.

### 5. Start the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build the application

```bash
npm run build
npm run start
```

---

## 🧪 Development Demo Account

The following credentials are intended only for a test account in a development database that you control.

| Field | Value |
|---|---|
| Name | `Gym Test User` |
| Email | `gymtest@example.com` |
| Password | `GymTest@12345` |

**The demo account is not automatically created by cloning the repository.** Create it in your own development database before attempting to log in.

### Create the demo account

First, generate a bcrypt hash in your project terminal:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('GymTest@12345', 12).then(hash => console.log(hash))"
```

Copy the resulting hash, then open the Neon SQL Editor and execute the following query after replacing the placeholder:

```sql
INSERT INTO users (
    name,
    email,
    password_hash,
    email_verified
)
VALUES (
    'Gym Test User',
    'gymtest@example.com',
    'REPLACE_WITH_BCRYPT_HASH',
    TRUE
)
ON CONFLICT (email)
DO NOTHING
RETURNING id, name, email, email_verified;
```

The `users.email` column must have a unique constraint for this conflict-handling query to work.

If the email already exists, the query will not change the existing account or password.

Once the user has been created, open the application's login page and use the demo credentials above.

**Security warning:** Anyone who can read this public README can see these credentials. Never use this account or password for production. Do not insert a public demo account into a production database. Keep demo data isolated from real users.

---

## 🔌 Main Application APIs

The following endpoints reflect the API routes discussed during development. Confirm the actual methods and request schemas in your source code.

| Endpoint | Purpose |
|---|---|
| `/api/profile` | Manage fitness profile data |
| `/api/workout-plan` | Generate or manage workout plans |
| `/api/workout-plans` | Save and retrieve workout history |
| `/api/auth/signup` | Register a user |
| `/api/auth/[...nextauth]` | Auth.js authentication handlers |

Protected endpoints should verify the authenticated session and restrict records to the current user's ID.

---

## 🔒 Security Best Practices

- Hash passwords; never store plain-text passwords.
- Keep API keys and database credentials in environment variables.
- Protect private pages and API routes with server-side authentication.
- Validate incoming request data on the server.
- Enforce user-specific access to profiles and workout plans.
- Add rate limiting and abuse protection to authentication and OTP endpoints.
- Store OTPs securely and enforce expiration and attempt limits.
- Use HTTPS and secure production configuration.
- Never expose private API keys in client-side code.
- Do not use public demo credentials in a production deployment.

---

## 🗺️ Roadmap

Potential future improvements include:

- Structured workout plans with exercises, sets, reps, and rest periods
- Workout completion tracking
- Fitness progress charts and analytics
- Improved AI response validation
- Automated tests for APIs and authentication
- Deployment and production monitoring
- Enhanced accessibility and mobile experience

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Open a pull request.

---

## 📄 License

No license is specified here. Add an appropriate `LICENSE` file if you intend to grant others permission to use, modify, or distribute the project.

---

## 👨‍💻 Author

**Anasriza26**

GitHub: [@Anasriza26](https://github.com/Anasriza26)

Project repository: [AI Gym Planner](https://github.com/Anasriza26/ai-gym-planner)

---

*Built with Next.js, TypeScript, Neon PostgreSQL, and Gemini AI.*
