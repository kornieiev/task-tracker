// In-memory database for ToS documents (in production this would be a real DB)
const tosDocuments = [
  {
    id: '1',
    version: '1.0',
    title: 'Terms of Service',
    effective_date: '2024-01-01T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    content: `# Terms of Service

## 1. Acceptance of Terms

By accessing and using Task Tracker, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Use License

Permission is granted to temporarily download one copy of Task Tracker for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose
- Attempt to decompile or reverse engineer any software
- Remove any copyright or other proprietary notations

## 3. Disclaimer

The materials on Task Tracker are provided on an 'as is' basis. Task Tracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 4. Limitations

In no event shall Task Tracker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Task Tracker, even if Task Tracker or an authorized representative has been notified orally or in writing of the possibility of such damage.

## 5. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.

## 6. User Data

- Task Tracker may collect and store user data to provide its services
- Users are responsible for the accuracy of their data
- We implement reasonable security measures to protect user data
- Users may request deletion of their data by contacting support

## 7. Modifications

Task Tracker may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.

## 8. Governing Law

These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.

---

**Last Updated:** January 1, 2024  
**Version:** 1.0  
**Contact:** support@tasktracker.com`,
    is_active: false
  },
  {
    id: '2',
    version: '1.1',
    title: 'Terms of Service',
    effective_date: '2024-03-15T00:00:00Z',
    created_at: '2024-02-28T00:00:00Z',
    content: `# Terms of Service

## 1. Acceptance of Terms

By accessing and using Task Tracker, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

## 2. Use License

Permission is granted to temporarily download one copy of Task Tracker for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

- Modify or copy the materials
- Use the materials for any commercial purpose or for any public display
- Attempt to decompile or reverse engineer any software contained on Task Tracker
- Remove any copyright or other proprietary notations from the materials

## 3. User Accounts

- Users are responsible for maintaining the confidentiality of their account information
- Users must provide accurate and complete information when creating accounts
- One account per user is permitted
- Users must be at least 13 years old to create an account

## 4. Acceptable Use

Users agree not to:
- Use the service for any unlawful purpose
- Transmit any harmful, offensive, or inappropriate content
- Attempt to gain unauthorized access to other user accounts
- Interfere with or disrupt the service's functionality
- Upload malicious code or viruses

## 5. Disclaimer

The materials on Task Tracker are provided on an 'as is' basis. Task Tracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 6. Limitations

In no event shall Task Tracker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Task Tracker, even if Task Tracker or an authorized representative has been notified orally or in writing of the possibility of such damage.

## 7. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding data collection, use, and sharing.

## 8. User Data and Content

- Task Tracker may collect and store user data to provide its services
- Users retain ownership of their task data and content
- Users are responsible for the accuracy and legality of their data
- We implement industry-standard security measures to protect user data
- Users may request export or deletion of their data by contacting support
- We may retain anonymized analytics data for service improvement

## 9. Service Availability

- Task Tracker strives for 99% uptime but does not guarantee uninterrupted service
- Scheduled maintenance will be announced in advance when possible
- We are not liable for any loss of data or productivity during service interruptions

## 10. Modifications and Termination

- Task Tracker may revise these terms of service at any time with notice
- Material changes will be announced via email or in-app notification
- Continued use after changes constitutes acceptance of new terms
- Either party may terminate the agreement at any time
- Upon termination, user data may be retained for up to 90 days before deletion

## 11. Contact Information

If you have any questions about these Terms of Service, please contact us at:
- Email: support@tasktracker.com
- Website: https://tasktracker.com/contact

## 12. Governing Law

These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.

---

**Last Updated:** March 15, 2024  
**Version:** 1.1  
**Contact:** support@tasktracker.com`,
    is_active: true
  }
]

export async function getLatestToSDocument() {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Find the active document (latest version)
  const activeDoc = tosDocuments.find(doc => doc.is_active)
  
  if (!activeDoc) {
    // Fallback to the most recent document
    return tosDocuments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
  }
  
  return activeDoc
}

export async function getAllToSDocuments() {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 50))
  
  return tosDocuments.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export type ToSDocument = typeof tosDocuments[0]
