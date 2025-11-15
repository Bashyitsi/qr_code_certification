# CertifyQR - Digital Certificate System with QR Code Verification

A complete digital certificate management system built with Next.js and Supabase that generates QR codes for instant certificate verification.

## Features

- 🎯 **Digital Certificate Creation** - Create professional certificates with all necessary details
- 📱 **QR Code Generation** - Automatic QR code generation for each certificate
- 🔐 **Secure Verification** - Tamper-proof certificate verification system
- 👨‍💼 **Admin Portal** - Complete admin interface for certificate management
- 🎨 **Professional Design** - Beautiful, responsive certificate layouts
- 📄 **PDF Export** - Download certificates as PDF files
- ⚡ **Instant Verification** - Real-time certificate authenticity checking

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Custom admin authentication
- **QR Codes**: qrcode library
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr_code_certification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and API keys
   - In the SQL Editor, run the schema from `supabase_schema.sql`

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your_secure_password
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## Usage

### Admin Functions

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Use credentials from your `.env.local` file

2. **Create New Certificates**
   - Click "New Certificate" in the dashboard
   - Fill in recipient and course details
   - System automatically generates QR code and certificate ID

3. **Manage Certificates**
   - View all certificates in the dashboard
   - Download QR codes
   - Delete or deactivate certificates
   - View certificate verification pages

### Certificate Verification

- Anyone can verify certificates by:
  - Scanning the QR code with their phone
  - Visiting `/verify/[certificate-code]`
  - The system shows certificate authenticity and details

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin portal pages
│   │   ├── dashboard/           # Admin dashboard and certificate creation
│   │   └── login/               # Admin authentication
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── certificates/        # Certificate CRUD operations
│   ├── verify/[code]/           # Certificate verification pages
│   └── page.tsx                 # Homepage
├── lib/                         # Utility libraries
│   ├── admin-auth.ts           # Admin authentication logic
│   ├── pdf-generator.ts        # PDF generation utilities
│   ├── qr-generator.ts         # QR code generation
│   └── supabase.ts             # Supabase client configuration
├── services/                    # Business logic services
│   └── certificate-service.ts  # Certificate operations
└── types/                       # TypeScript type definitions
    └── certificate.ts           # Certificate data types
```

## Database Schema

The application uses a single `certificates` table with the following structure:

- `id` - Unique identifier (UUID)
- `recipient_name` - Certificate recipient's name
- `recipient_email` - Recipient's email address
- `course_name` - Name of the course/achievement
- `description` - Optional course description
- `issue_date` - When the certificate was issued
- `completion_date` - When the course was completed
- `instructor_name` - Optional instructor name
- `organization` - Issuing organization
- `certificate_code` - Unique verification code
- `qr_code_url` - Data URL of the QR code image
- `is_active` - Whether the certificate is active
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Authentication
- `POST /api/auth` - Admin login
- `DELETE /api/auth` - Admin logout

### Certificates
- `GET /api/certificates` - List all certificates (admin only)
- `POST /api/certificates` - Create new certificate (admin only)
- `DELETE /api/certificates/[id]` - Delete certificate (admin only)
- `PATCH /api/certificates/[id]` - Update certificate (admin only)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `NEXTAUTH_URL` | Application base URL | Yes |
| `ADMIN_EMAIL` | Admin login email | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your production URL
   - Ensure all other environment variables are set

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Customization

### Styling
- Modify Tailwind classes in components
- Update `globals.css` for global styles
- Customize colors in Tailwind config

### Certificate Design
- Edit `/verify/[code]/page.tsx` for certificate layout
- Modify PDF generation in `pdf-generator.ts`
- Update QR code styling in `qr-generator.ts`

### Branding
- Replace logo and brand colors
- Update homepage content
- Modify admin interface styling

## Security Considerations

- Admin authentication uses HTTP-only cookies
- Database uses Row Level Security (RLS)
- Environment variables secure sensitive data
- QR codes use unique, non-guessable certificate codes
- Input validation on all forms

## License

MIT License - feel free to use this project for your own purposes.

## Support

For questions or issues, please check the documentation or create an issue in the repository.

---

**CertifyQR** - Professional digital certificates with QR verification. Built with ❤️ using Next.js and Supabase.
