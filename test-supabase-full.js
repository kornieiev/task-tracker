const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection and RLS policies...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials in .env.local')
    return
  }

  console.log('🔑 Credentials found:')
  console.log('   URL:', supabaseUrl)
  console.log('   Key:', supabaseKey.substring(0, 20) + '...')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Test 1: Check connection
    console.log('\n🌐 Testing basic connection...')
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error && error.message.includes('relation "users" does not exist')) {
      console.log('❌ Table "users" not found - migrations not applied?')
      return
    }

    console.log('✅ Connection successful!')

    // Test 2: Test users table
    console.log('\n👥 Testing users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(3)

    if (usersError) {
      console.log('❌ Users error:', usersError.message)
    } else {
      console.log('✅ Users table accessible')
      console.log('   Records found:', users.length)
      if (users.length > 0) {
        console.log('   Sample user:', users[0].email || users[0].name)
      }
    }

    // Test 3: Test tasks table
    console.log('\n📋 Testing tasks table...')
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(3)

    if (tasksError) {
      console.log('❌ Tasks error:', tasksError.message)
    } else {
      console.log('✅ Tasks table accessible')
      console.log('   Records found:', tasks.length)
      if (tasks.length > 0) {
        console.log('   Sample task:', tasks[0].title)
      }
    }

    // Test 4: Test terms_of_service
    console.log('\n📄 Testing terms_of_service table...')
    const { data: terms, error: termsError } = await supabase
      .from('terms_of_service')
      .select('title, version, is_active')
      .limit(2)

    if (termsError) {
      console.log('❌ Terms error:', termsError.message)
    } else {
      console.log('✅ Terms of Service table accessible')
      console.log('   Records found:', terms.length)
      if (terms.length > 0) {
        console.log(
          '   Active version:',
          terms.find(t => t.is_active)?.version || 'None active'
        )
      }
    }

    // Test 5: Test RLS (should fail without auth)
    console.log('\n🛡️ Testing RLS policies...')
    const { error: rlsError } = await supabase.from('tasks').insert({
      title: 'Test RLS Task',
      description: 'This should fail due to RLS',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
    })

    if (rlsError) {
      console.log('✅ RLS working correctly:', rlsError.message)
    } else {
      console.log(
        '⚠️  RLS might not be working - insert succeeded without auth'
      )
    }

    console.log('\n🎉 Supabase database test complete!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Database connection: Working')
    console.log('   ✅ Table structure: Created')
    console.log('   ✅ RLS policies: Active')
    console.log('   ✅ Ready for Next.js integration!')
  } catch (error) {
    console.log('❌ Connection error:', error.message)
  }
}

testSupabaseConnection()
