// sign up
const { data, error } = await supabase.auth.signUp({ email, password })

// sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/user-123.png', file)

// subscribe to channel
const channel = supabase
  .channel('public:messages')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    payload => console.log('new message', payload)
  )
  .subscribe()