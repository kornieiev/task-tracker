-- Create terms_of_service table
CREATE TABLE IF NOT EXISTS terms_of_service (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(20) NOT NULL,
    effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_terms_effective_date ON terms_of_service(effective_date DESC);
CREATE INDEX IF NOT EXISTS idx_terms_version ON terms_of_service(version);

-- Enable Row Level Security (but allow public read access)
ALTER TABLE terms_of_service ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read terms of service (no auth required)
DROP POLICY IF EXISTS "Anyone can read terms of service" ON terms_of_service;
CREATE POLICY "Anyone can read terms of service" ON terms_of_service
    FOR SELECT USING (true);

-- Insert sample terms of service
INSERT INTO terms_of_service (title, content, version, effective_date) VALUES 
(
    'Terms of Service',
    '# Task Tracker Terms of Service

## 1. Acceptance of Terms

By accessing and using Task Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License

Permission is granted to temporarily access the Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- modify or copy the materials
- use the materials for any commercial purpose
- attempt to reverse engineer any software contained on the Service

## 3. Privacy Policy

Your privacy is important to us. We collect only the necessary information to provide the Service:
- Email address for authentication
- Task data you create
- Usage analytics to improve the Service

## 4. User Account

You are responsible for:
- Maintaining the confidentiality of your account
- All activities that occur under your account
- Notifying us of any unauthorized use

## 5. Prohibited Uses

You may not use our Service:
- For any unlawful purpose or to solicit others to unlawful acts
- To violate any international, federal, provincial, or state regulations or laws
- To transmit, or procure the sending of, any advertising or promotional material
- To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity

## 6. Service Availability

We reserve the right to:
- Modify or discontinue the Service at any time
- Refuse service to anyone for any reason at any time
- Remove or edit content at our sole discretion

## 7. Disclaimer

The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.

## 8. Limitation of Liability

In no event shall Task Tracker, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Service.

## 9. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.

## 10. Contact Information

If you have any questions about these Terms of Service, please contact us at support@tasktracker.com.

*Last updated: September 24, 2025*',
    '1.0',
    NOW()
) ON CONFLICT DO NOTHING;
