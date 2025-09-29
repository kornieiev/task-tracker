const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

/**
 * Creates demo users for Task Tracker application
 * Run with: node create-auth-users.js
 */
async function createDemoUsers() {
  console.log('🔧 Setting up demo users for Task Tracker...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.log('❌ Missing Supabase credentials in .env.local')
    console.log(
      'Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const demoUsers = [
    {
      email: 'lola@mail.com',
      password: 'qweqwe',
      user_metadata: {
        name: 'Lola Demo',
      },
    },
    {
      email: 'leo@mail.com',
      password: 'qweqwe',
      user_metadata: {
        name: 'Leo Demo',
      },
    },
  ]

  for (const user of demoUsers) {
    console.log(`🔄 Processing user: ${user.email}`)

    try {
      // Check if user already exists
      const { data: existingUsers, error: listError } =
        await supabase.auth.admin.listUsers()

      if (listError) {
        console.log(`❌ Error listing users:`, listError.message)
        continue
      }

      const existingUser = existingUsers.users.find(
        u => u.email?.toLowerCase() === user.email.toLowerCase()
      )

      if (existingUser) {
        console.log(`ℹ️  User ${user.email} already exists, updating...`)

        // Update existing user
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: user.password,
            user_metadata: user.user_metadata,
          }
        )

        if (updateError) {
          console.log(`❌ Error updating ${user.email}:`, updateError.message)
          continue
        }

        // Update users table
        const { error: upsertError } = await supabase.from('users').upsert({
          id: existingUser.id,
          email: user.email,
          name: user.user_metadata.name,
        })

        if (upsertError) {
          console.log(`⚠️  Could not update users table:`, upsertError.message)
        } else {
          console.log(`✅ Updated ${user.email} successfully`)
        }
      } else {
        console.log(`📝 Creating new user: ${user.email}`)

        // Create new user
        const { data: newUser, error: createError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            user_metadata: user.user_metadata,
            email_confirm: true, // Skip email confirmation
          })

        if (createError) {
          console.log(`❌ Error creating ${user.email}:`, createError.message)
          continue
        }

        // Add to users table
        const { error: insertError } = await supabase.from('users').upsert({
          id: newUser.user?.id,
          email: newUser.user?.email,
          name: user.user_metadata.name,
        })

        if (insertError) {
          console.log(
            `⚠️  Could not insert into users table:`,
            insertError.message
          )
        } else {
          console.log(`✅ Created ${user.email} successfully`)
          console.log(`   UUID: ${newUser.user?.id}`)
        }
      }
    } catch (error) {
      console.log(`❌ Unexpected error for ${user.email}:`, error.message)
    }
  }

  console.log('\n🎉 Demo users setup completed!')
  console.log('\n📋 Login credentials:')
  console.log('┌─────────────────┬──────────┐')
  console.log('│ Email           │ Password │')
  console.log('├─────────────────┼──────────┤')
  console.log('│ lola@mail.com   │ qweqwe   │')
  console.log('│ leo@mail.com    │ qweqwe   │')
  console.log('└─────────────────┴──────────┘')
}

// Run only if called directly
if (require.main === module) {
  createDemoUsers().catch(console.error)
}

module.exports = { createDemoUsers }
