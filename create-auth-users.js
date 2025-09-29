const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function updateAuthUsers() {
  console.log('🔧 Updating existing users in Supabase Auth...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.log('❌ Missing Supabase credentials')
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // ✅ Упрощенные пользователи без image
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
    console.log(`🔄 Updating user: ${user.email}`)

    // ✅ Сначала найдем пользователя
    const { data: existingUsers, error: listError } =
      await supabase.auth.admin.listUsers()

    if (listError) {
      console.log(`❌ Error listing users:`, listError.message)
      continue
    }

    const existingUser = existingUsers.users.find(
      u => u.email?.toLowerCase() === user.email.toLowerCase()
    )

    if (!existingUser) {
      console.log(`📝 Creating new user: ${user.email}`)

      // Создаем нового пользователя
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          user_metadata: user.user_metadata,
          email_confirm: true,
        })

      if (createError) {
        console.log(`❌ Error creating ${user.email}:`, createError.message)
        continue
      }

      console.log(`✅ Created user: ${user.email}`)
      console.log(`   UUID: ${newUser.user?.id}`)

      // ✅ Добавляем в таблицу users БЕЗ image
      const { error: insertError } = await supabase.from('users').upsert({
        id: newUser.user?.id,
        email: newUser.user?.email,
        name: user.user_metadata.name,
      })

      if (insertError) {
        console.log(
          `   ⚠️  Warning: Could not insert into users table:`,
          insertError.message
        )
      } else {
        console.log(`   ✅ Added to users table`)
      }

      continue
    }

    // ✅ Обновляем существующего пользователя
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        email: user.email,
        password: user.password,
        user_metadata: user.user_metadata,
      }
    )

    if (error) {
      console.log(`❌ Error updating ${user.email}:`, error.message)
      continue
    }

    console.log(`✅ Updated user: ${user.email}`)
    console.log(`   UUID: ${existingUser.id}`)

    // ✅ Обновляем запись в таблице users БЕЗ image
    const { error: upsertError } = await supabase.from('users').upsert({
      id: existingUser.id,
      email: user.email,
      name: user.user_metadata.name,
    })

    if (upsertError) {
      console.log(
        `   ⚠️  Warning: Could not upsert into users table:`,
        upsertError.message
      )
    } else {
      console.log(`   ✅ Updated users table`)
    }
  }

  console.log('\n🎉 Users updated successfully!')
  console.log('📋 You can now login with:')
  console.log('   • lola@mail.com / qweqwe')
  console.log('   • leo@mail.com / qweqwe')
}

updateAuthUsers()
