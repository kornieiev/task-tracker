# 📋 Task Tracker

A modern, full-stack task management application built with Next.js 15, tRPC, Supabase, and NextAuth.

![Task Tracker](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![tRPC](https://img.shields.io/badge/tRPC-11.0-2596be?style=flat-square&logo=trpc)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ecf8e?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## 🚀 Live Demo

**Production:** [https://task-tracker-omxengjjj-kornieiev-ds-projects.vercel.app](https://task-tracker-omxengjjj-kornieiev-ds-projects.vercel.app)

### Demo Credentials

- **Email:** `lola@mail.com`
- **Password:** `qweqwe`

- **Email:** `leo@mail.com`
- **Password:** `qweqwe`

## ✨ Features

- 🔐 **Secure Authentication** - NextAuth.js with Supabase backend
- 📝 **Task Management** - Create, read, update, delete tasks
- 📊 **Dashboard Analytics** - Task completion statistics and insights
- 📅 **Due Date Validation** - Mandatory due dates with future-only validation
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔒 **Type Safety** - Full TypeScript support with tRPC
- ⚡ **Real-time Updates** - Optimistic updates with React Query
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend

- **tRPC** - End-to-end typesafe APIs
- **Supabase** - PostgreSQL database and authentication
- **NextAuth.js** - Authentication library
- **Row Level Security** - Database-level security

### Deployment

- **Vercel** - Hosting and deployment platform
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Vercel account (for deployment)

### 1. Clone the repository

```bash
git clone https://github.com/kornieiev/task-tracker.git
cd task-tracker
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Development settings
NODE_ENV=development
```

### 4. Set up Supabase

#### Create tables

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own profile" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can only see their own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
```

#### Configure Authentication

1. Go to Authentication → Settings → Auth Providers
2. Enable Email provider
3. Add your domain to Site URL and Redirect URLs

### 5. Create demo users (optional)

For testing purposes, you can create demo users:

```bash
node create-auth-users.js
```

This will create:

- `lola@mail.com` / `qweqwe`
- `leo@mail.com` / `qweqwe`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
task-tracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── tasks/             # Task management pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── providers/        # Context providers
│   ├── lib/                  # Utility functions and configurations
│   │   ├── auth/             # NextAuth configuration
│   │   ├── supabase/         # Supabase clients
│   │   └── trpc/             # tRPC setup
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── supabase/                # Supabase migrations and config
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production

```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NODE_ENV=production
```

## 🧪 Testing

### Test User Account

For testing purposes, you can use:

- **Email:** `lola@mail.com`
- **Password:** `qweqwe`

- **Email:** `leo@mail.com`
- **Password:** `qweqwe`

## 📚 API Documentation

The application uses tRPC for type-safe API calls. Main procedures:

- `getTasks` - Fetch all user tasks
- `getTask` - Fetch single task by ID
- `createTask` - Create new task
- `updateTask` - Update existing task
- `deleteTask` - Delete task
- `getTaskStats` - Get task statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library

## 📞 Contact

**Developer:** Dmytro Korneev  
**Email:** kornieiev.d@gmail.com  
**GitHub:** [@kornieiev](https://github.com/kornieiev)

---

⭐ **Star this repository if you found it helpful!**
