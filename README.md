# HVAC Service Marketplace

A production-ready bilingual (Arabic & English) HVAC (Cooling & Air Conditioning) service marketplace built with React, TypeScript, and Supabase.

## Features

- 🌐 **Bilingual Support**: Full Arabic (RTL) and English (LTR) support with language switcher
- 👥 **Multi-Role System**: Customer, Engineer, and Admin roles
- 📱 **Responsive Design**: Modern SaaS design with Tailwind CSS
- 🔒 **Secure**: Row Level Security (RLS) policies in Supabase
- ⚡ **Fast**: Built with Vite and React Query for optimal performance

## Tech Stack

### Frontend
- React 18 + Vite + TypeScript
- Tailwind CSS (RTL & LTR support)
- shadcn/ui components
- React Router
- React Query
- React Hook Form + Zod
- react-i18next (Arabic & English)
- dayjs

### Backend
- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Row Level Security (RLS)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Cooling & Air Conditioning"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL Editor
   - Run the SQL from `supabase/seed.sql` to add initial services

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Database Setup

1. In your Supabase project, go to SQL Editor
2. Run `supabase/schema.sql` to create all tables, enums, and RLS policies
3. Run `supabase/seed.sql` to add initial service data

## User Roles

### Customer (عميل)
- View available services
- Create service requests
- Track request status
- Rate and review engineers after completion

### Engineer (مهندس تكييف وتبريد)
- Register engineer profile (city, specialization, experience)
- View assigned service requests
- Update request status
- Enter final price and job notes

### Admin (مسؤول النظام)
- View all service requests
- Assign engineers to requests
- Manage services (CRUD)
- Manage engineers
- View analytics (total requests, revenue, etc.)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx
│   ├── LanguageSwitcher.tsx
│   └── ...
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── CustomerRequest.tsx
│   ├── EngineerDashboard.tsx
│   └── AdminDashboard.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utilities and config
│   ├── supabaseClient.ts
│   ├── i18n.ts
│   └── utils.ts
└── locales/            # Translation files
    ├── ar.json
    └── en.json
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## License

This project is production-ready and built for commercial use.

## Support

For issues or questions, please contact the development team.

