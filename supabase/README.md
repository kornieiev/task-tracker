# Supabase Database Setup

This directory contains database migrations and configuration for the Task Tracker application.

## Quick Setup

### Option 1: Use Supabase Cloud (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and keys from the project settings
3. Update your `.env.local` file with the credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. In the Supabase SQL editor, run each migration file in order:
   - `001_create_users_table.sql`
   - `002_create_tasks_table.sql`
   - `003_create_terms_of_service_table.sql`
   - `004_insert_test_data.sql`

### Option 2: Use Local Development

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase locally:
   ```bash
   supabase init
   supabase start
   ```

3. Apply migrations:
   ```bash
   ./supabase/setup.sh
   ```

## Database Schema

### Tables

- **users**: User accounts with authentication data
- **tasks**: User tasks with title, description, and completion status
- **terms_of_service**: Static content for Terms of Service and FAQ pages

### Security

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Terms of service are publicly readable

## Test Data

The setup includes test users and sample tasks for development purposes:

- **Test User 1**: john.doe@example.com (John Doe)
- **Test User 2**: jane.smith@example.com (Jane Smith)

Each user has sample tasks in various states (completed/incomplete).

## Environment Variables

Make sure to set these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```
