# Database Setup for SAT RSPO PADI
# Supabase Project: https://ileiutoopvambzimbjyr.supabase.co

## Quick Setup Instructions

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/ileiutoopvambzimbjyr
   - Navigate to "SQL Editor" in the left sidebar

2. **Run the Database Schema**
   - Copy the entire content from `/database/schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor" tab
   - You should see: `user_profiles`, `assessments`, `login_history`

## Schema Summary

### Tables Created:
- **user_profiles** - Extended user information (linked to auth.users)
- **assessments** - Assessment results and answers in JSON format  
- **login_history** - Audit trail of user login attempts

### Key Features:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Manajer role can view all data for management
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ UUID primary keys for security
- ✅ Foreign key constraints to auth.users

### User Roles:
- **petani** - Regular users (farmers)
- **manajer** - Managers with admin privileges

## Testing the Setup

After running the schema, test the connection:

```bash
# Test database connection
curl -X GET https://ileiutoopvambzimbjyr.supabase.co/rest/v1/user_profiles \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q"
```

Expected response: `[]` (empty array, indicating table exists but no data yet)

## Next Steps

1. ✅ Database schema deployed
2. ⏳ Deploy backend API to Vercel
3. ⏳ Configure frontend with environment variables
4. ⏳ Test complete authentication flow

## Troubleshooting

**If you get permission errors:**
- Check that RLS policies are correctly applied
- Verify API keys are correct
- Ensure you're using the anon key for public operations

**If tables don't appear:**
- Check for SQL syntax errors in the console
- Run each CREATE TABLE statement individually
- Verify you have proper permissions in Supabase dashboard