# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. Open Supabase SQL Editor
2. Run `supabase/schema.sql` to create:
   - Enums (user_role, service_status)
   - Tables (users, services, engineers, service_requests, reviews)
   - Row Level Security (RLS) policies
   - Triggers and functions
3. Run `supabase/seed.sql` to add initial service data

### 4. Create First Admin User

After running the schema, create an admin user manually:

```sql
-- First, create auth user (use Supabase Auth UI or API)
-- Then run this SQL (replace 'auth_user_id' with actual auth user ID):

INSERT INTO public.users (id, role, name, phone)
VALUES ('auth_user_id', 'admin', 'Admin User', '+1234567890');
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## User Flows

### Customer Flow
1. Register as customer
2. Browse services on landing page
3. Create service request
4. Track request status
5. Rate engineer after completion

### Engineer Flow
1. Register as engineer (role selection)
2. Complete engineer profile registration (city, specialization, experience)
3. View assigned requests
4. Update request status
5. Enter final price and notes

### Admin Flow
1. Login as admin
2. View all requests
3. Assign engineers to requests
4. Manage services
5. View analytics

## Important Notes

- Engineers must complete profile registration after account creation
- RLS policies ensure data security based on user roles
- All text is internationalized (Arabic/English)
- Language switcher updates UI direction (RTL/LTR) automatically

## Production Build

```bash
npm run build
```

Output will be in `dist/` directory.

## Troubleshooting

### Supabase Connection Issues
- Verify `.env` file has correct credentials
- Check Supabase project is active
- Ensure RLS policies are enabled

### Authentication Issues
- Verify users table has matching auth.users entries
- Check RLS policies allow user access
- Ensure user role is set correctly

### Missing Data
- Run seed.sql to populate services
- Create admin user manually
- Register engineers through the UI

