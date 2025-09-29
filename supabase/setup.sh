#!/bin/bash

# Task Tracker Database Setup Script
# This script applies all database migrations to your Supabase project

echo "🚀 Setting up Task Tracker database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

echo "📋 Applying database migrations..."

# Apply each migration in order
echo "1️⃣ Creating users table..."
supabase db apply migrations/001_create_users_table.sql

echo "2️⃣ Creating tasks table..."
supabase db apply migrations/002_create_tasks_table.sql

echo "3️⃣ Creating terms of service table..."
supabase db apply migrations/003_create_terms_of_service_table.sql

echo "4️⃣ Inserting test data..."
supabase db apply migrations/004_insert_test_data.sql

echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env.local file with your Supabase credentials"
echo "2. Start your development server: npm run dev"
echo "3. Visit http://localhost:3000 to see your app"
