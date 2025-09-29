-- Insert test users БЕЗ поля image
-- Note: In production, users will be created through authentication flow

-- Test User 1
INSERT INTO users (id, email, name) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'lola@mail.com',
    'Lola'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- Test User 2
INSERT INTO users (id, email, name) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'leo@mail.com',
    'Leo'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name;

-- Insert test tasks for the users
INSERT INTO tasks (id, title, description, status, priority, due_date, user_id) VALUES
-- Tasks for Lola
(
    '550e8400-e29b-41d4-a716-446655440011',
    'Complete project proposal',
    'Finish the Q4 project proposal document',
    'in_progress',
    'high',
    '2025-10-15T10:00:00Z',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'Review code changes',
    'Review pull request #123',
    'todo',
    'medium',
    '2025-10-05T14:00:00Z',
    '550e8400-e29b-41d4-a716-446655440001'
),
-- Tasks for Leo
(
    '550e8400-e29b-41d4-a716-446655440021',
    'Update documentation',
    'Update API documentation with new endpoints',
    'completed',
    'low',
    '2025-09-25T12:00:00Z',
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    'Database optimization',
    'Optimize slow queries in the database',
    'todo',
    'high',
    '2025-10-10T16:00:00Z',
    '550e8400-e29b-41d4-a716-446655440002'
)
ON CONFLICT (id) DO NOTHING;