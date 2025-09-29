-- Insert test users (these will be used for testing purposes)
-- Note: In production, users will be created through authentication flow

-- Test User 1
INSERT INTO users (id, email, name) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Lola@mail.com',
    'Lola'
) ON CONFLICT (id) DO NOTHING;

-- Test User 2  
INSERT INTO users (id, email, name) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440002', 
    'Leo@mail.com',
    'Leo'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for test users
INSERT INTO tasks (title, description, user_id, completed) VALUES
(
    'Setup Development Environment',
    'Install Node.js, VS Code, and setup the project repository',
    '550e8400-e29b-41d4-a716-446655440001',
    true
),
(
    'Design Database Schema',
    'Create tables for users, tasks, and terms of service',
    '550e8400-e29b-41d4-a716-446655440001',
    true
),
(
    'Implement Authentication',
    'Setup NextAuth.js with Supabase integration',
    '550e8400-e29b-41d4-a716-446655440001',
    false
),
(
    'Create Task Management UI',
    'Build forms and lists for CRUD operations on tasks',
    '550e8400-e29b-41d4-a716-446655440001',
    false
),
(
    'Write Documentation',
    'Create README.md with setup and usage instructions',
    '550e8400-e29b-41d4-a716-446655440002',
    false
),
(
    'Deploy to Production',
    'Setup Vercel deployment and configure environment variables',
    '550e8400-e29b-41d4-a716-446655440002',
    false
) ON CONFLICT DO NOTHING;

-- Insert FAQ data
INSERT INTO terms_of_service (title, content, version, effective_date) VALUES 
(
    'Frequently Asked Questions',
    '# Frequently Asked Questions

## General Questions

### What is Task Tracker?
Task Tracker is a simple, efficient task management application that helps you organize and track your daily tasks and projects.

### Is Task Tracker free to use?
Yes, Task Tracker is completely free to use for personal projects.

### Do I need to create an account?
Yes, you need to create an account to save and sync your tasks across devices.

## Technical Questions

### What browsers are supported?
Task Tracker works on all modern browsers including Chrome, Firefox, Safari, and Edge.

### Can I use Task Tracker offline?
Currently, Task Tracker requires an internet connection to sync your data.

### Is my data secure?
Yes, we use industry-standard encryption and security practices to protect your data.

## Account Questions

### How do I reset my password?
You can reset your password using the "Forgot Password" link on the login page.

### Can I delete my account?
Yes, you can delete your account and all associated data from your profile settings.

### How do I export my tasks?
You can export your tasks as JSON or CSV from the settings page.

## Feature Questions

### Can I share tasks with others?
Currently, tasks are private to each user. Collaboration features are planned for future releases.

### Is there a mobile app?
Task Tracker is a web application that works great on mobile browsers. Native mobile apps are planned for the future.

### Can I set reminders?
Reminder functionality is planned for a future release.

## Troubleshooting

### I forgot my password, what should I do?
Use the "Forgot Password" link on the login page to reset your password.

### My tasks are not saving, what''s wrong?
This usually indicates a connection issue. Check your internet connection and try refreshing the page.

### The app is loading slowly, how can I fix this?
Try clearing your browser cache and cookies, or try using a different browser.

*Last updated: September 24, 2025*',
    'FAQ-1.0',
    NOW()
) ON CONFLICT DO NOTHING;
