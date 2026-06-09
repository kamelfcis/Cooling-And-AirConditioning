# HVAC Service Marketplace - Project Proposal

## Table of Contents

1. [Background](#background)
2. [Project Idea](#project-idea)
3. [Project Scope](#project-scope)
4. [Problem Statement](#problem-statement)
5. [System Objectives](#system-objectives)
6. [System Features](#system-features)
7. [Related Work and Comparative Study](#related-work-and-comparative-study)
8. [System Requirements](#system-requirements)
9. [System Users](#system-users)
10. [System Tools](#system-tools)
11. [Project Time Plan](#project-time-plan)

---

## Background

This project focuses on the **HVAC (Heating, Ventilation, and Air Conditioning) service industry**. HVAC businesses provide cooling, air conditioning, maintenance, repair, and installation services. Service providers travel to customer locations, making scheduling and coordination critical.

**Key Business Terms:**
- **Service Requests**: Customer requests for HVAC services
- **Service Assignment**: Matching engineers with customer requests
- **Service Status Tracking**: Monitoring request progress
- **Pricing Calculation**: Determining costs based on service type and AC unit count
- **Service Reviews**: Customer feedback after service completion

**Current Situation:**
Most HVAC businesses use manual methods:
- Phone calls and WhatsApp messages for booking
- Notebooks or spreadsheets to track requests
- Manual engineer assignment through phone calls
- No centralized system for managing requests

**Problems:**
- Unstructured communication across multiple channels
- Manual assignment process with no availability tracking
- No transparency for customers (can't see request status)
- Pricing inconsistencies from verbal negotiations
- No systematic service history or review collection

**Stakeholders:**
- **Customers**: Homeowners and business owners needing HVAC services
- **Engineers**: Service providers who perform on-site work
- **Admins**: Business managers who coordinate requests

A digital marketplace platform can centralize requests, automate assignments, provide real-time tracking, standardize pricing, and enable systematic reviews.

---

## Project Idea

Develop a **bilingual (Arabic & English) HVAC service marketplace** that connects customers with engineers.

**For Customers:**
- Browse services with transparent pricing
- Submit service requests with preferred dates/times
- Track request status in real-time
- Rate and review engineers after completion

**For Engineers:**
- View assigned service requests
- Update job status (Pending → On the Way → In Progress → Completed)
- Enter final pricing and job notes

**For Admins:**
- Assign engineers to requests
- Manage service catalog and pricing
- View analytics (requests, revenue, completion rates)
- Monitor engineer performance

The system automates service management, eliminates manual coordination, and provides transparent communication.

---

## Project Scope

### Included in Scope

**Customer Features:**
- User registration and authentication
- Browse available services with pricing
- Create service requests (AC count, date/time, notes)
- Track request status
- View service history
- Rate and review engineers

**Engineer Features:**
- Engineer profile registration
- View assigned requests
- Update request status
- Enter final price and job notes

**Admin Features:**
- Dashboard with analytics
- Assign engineers to requests
- Manage services and pricing
- Manage engineers
- View reviews

**Technical Features:**
- Bilingual support (Arabic RTL / English LTR)
- Responsive design
- Secure authentication
- Row Level Security (RLS)

### Excluded from Scope

- Payment gateway integration
- SMS/Email notifications
- Mobile native apps
- GPS tracking
- Multi-branch management
- Inventory management
- Advanced analytics
- Chat/messaging system

---

## Problem Statement

HVAC businesses rely on **manual methods** (phone calls, WhatsApp, notebooks) to manage service requests. This creates:

**Scheduling Conflicts**: Engineers get double-booked, leading to missed appointments.

**Lack of Transparency**: Customers can't see request status and must call repeatedly.

**Pricing Inconsistencies**: Verbal negotiations lead to disputes and revenue loss.

**Inefficient Resource Allocation**: Managers can't view engineer workload or availability.

**No Quality Tracking**: Customer feedback isn't collected systematically.

**Communication Overhead**: Constant phone calls waste time and cause miscommunication.

**Lost Business**: No digital presence means missing customers who prefer online booking.

The absence of an automated system impacts **operational efficiency**, **customer satisfaction**, and **revenue**. A digital marketplace platform is needed to manage requests, automate assignments, provide transparency, and enable quality tracking.

---

## System Objectives

- Develop a bilingual web-based marketplace connecting customers with HVAC engineers
- Automate service request management
- Provide transparent service browsing and pricing
- Enable engineers to manage assigned requests
- Standardize service pricing
- Implement review and rating system
- Provide admin analytics (requests, revenue, completion rates)
- Reduce customer waiting time
- Enhance operational efficiency
- Create a scalable platform

---

## System Features

### Customer Features
- User registration and authentication
- Browse HVAC services with pricing (per AC unit)
- Create service requests (select service, AC count, date/time, notes)
- Automatic price estimation (base price × AC count)
- Track request status in real-time
- View service history
- Rate engineers (1-5 stars) and write reviews
- Bilingual interface (Arabic/English)

### Engineer Features
- Register engineer profile (city, specialization, experience)
- View assigned service requests
- Update request status
- Enter final price and job notes
- View customer information

### Admin Features
- Dashboard with analytics (total requests, revenue, active engineers)
- View all service requests
- Assign engineers to requests
- Manage service catalog (add, edit, delete services)
- Manage engineers (activate/deactivate)
- View customer reviews

---

## Related Work and Comparative Study

### Existing Solutions

**General Marketplaces:**
- **TaskRabbit**: General tasks, lacks HVAC features, limited Arabic support
- **Thumbtack**: Requires subscription fees, no HVAC workflow
- **Airtasker**: Generic marketplace, lacks industry-specific features

**HVAC Platforms:**
- **ServiceTitan**: Enterprise solution, expensive ($200-500/month), unaffordable for small businesses
- **Housecall Pro**: Field service management, lacks customer booking interface
- **Jobber**: Scheduling software, no customer self-service

**Local Solutions:**
- Manual phone-based services (unstructured, inefficient)
- Basic websites (no booking functionality)

### Comparative Analysis

| Feature | Proposed System | ServiceTitan | TaskRabbit | Manual Methods |
|--------|----------------|-------------|------------|----------------|
| HVAC-Specific Features | ✓ | ✓ | ✗ | ✗ |
| Customer Self-Service Booking | ✓ | ✗ | ✓ | ✗ |
| Transparent Pricing | ✓ | ✗ | ✗ | ✗ |
| Real-Time Status Tracking | ✓ | ✓ | Partial | ✗ |
| Bilingual Support | ✓ | ✗ | ✗ | ✗ |
| Affordable for Small Businesses | ✓ | ✗ | ✗ | ✓ |
| Engineer Dashboard | ✓ | ✓ | ✗ | ✗ |
| Review & Rating System | ✓ | Partial | ✓ | ✗ |

### Project Advantages

- Affordable solution for small businesses
- Full bilingual support (Arabic/English)
- HVAC-specific features (AC unit pricing, service types)
- Customer transparency (browse services, track requests)
- Simple implementation with intuitive interfaces
- Focus on core marketplace functionality

---

## System Requirements

### A. Functional Requirements

**Authentication:**
- User registration (email, password, name, phone, role)
- Secure login/logout
- Role-based access control (Customer, Engineer, Admin)

**Customer:**
- Display services with bilingual names and pricing
- Create service requests (service, AC count, date/time, notes)
- Calculate estimated price (base price × AC count)
- View request history
- Track request status in real-time
- Rate engineers (1-5 stars) and write reviews

**Engineer:**
- Register engineer profile (city, specialization, experience)
- View assigned requests
- Update request status
- Enter final price and job notes
- View customer information

**Admin:**
- View analytics dashboard
- View all service requests
- Assign engineers to requests
- Manage service catalog (CRUD)
- Manage engineers (view, activate/deactivate)
- View reviews

**Data Management:**
- Store users, services, engineers, requests, reviews
- Enforce data relationships
- Auto-calculate estimated prices
- Track status changes and timestamps

### B. Non-Functional Requirements

**Performance:**
- Pages load within 2 seconds
- Handle concurrent users efficiently
- Real-time updates without delay

**Security:**
- Encrypt passwords and sensitive data
- Row Level Security (RLS) policies
- Protect against SQL injection and XSS
- Authenticate all API requests

**Usability:**
- Intuitive interfaces for all users
- Bilingual support (Arabic RTL / English LTR)
- Responsive design (mobile and desktop)
- Clear error messages

**Reliability:**
- Available 24/7 with minimum downtime
- Handle errors gracefully
- Maintain data consistency

**Scalability:**
- Support growing users and requests
- Allow future feature additions
- Efficient database queries

---

## System Users

| User Type | Description | Purpose | Key Activities |
|-----------|-------------|---------|----------------|
| **Customer** | Homeowners and business owners | Request services, track status, provide feedback | Browse services, create requests, view history, rate engineers |
| **Engineer** | HVAC technicians | Complete assigned requests, update status | View assignments, update status, enter pricing, add notes |
| **Admin** | System administrators | Manage platform operations | Assign engineers, manage services, view analytics |

---

## System Tools

### Documentation
- Microsoft Word, Markdown
- Draw.io, Lucidchart (diagrams)

### Design
- Figma (UI design)
- Lucide React Icons

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (UI components)
- React Router (routing)
- React Query (state management)
- React Hook Form + Zod (forms)
- react-i18next (i18n)
- dayjs (dates)

### Backend
- Supabase (PostgreSQL, Auth, RLS)
- PostgreSQL database
- Supabase REST API

### Development
- Visual Studio Code
- Git & GitHub
- npm
- TypeScript
- ESLint

### Hosting
- Vercel/Netlify (frontend)
- Supabase Cloud (backend)

---

## Project Time Plan

### Phase 1: Planning & Design (Weeks 1-2)
- Week 1: Requirements analysis, database design, UI wireframing
- Week 2: Architecture planning, tech stack setup

### Phase 2: Database Setup (Weeks 2-3)
- Week 2: Supabase setup, schema implementation, RLS policies
- Week 3: Seed data, authentication setup

### Phase 3: Frontend Foundation (Weeks 3-4)
- Week 3: React setup, routing, i18n, UI components
- Week 4: Core components, authentication pages

### Phase 4: Customer Features (Weeks 4-5)
- Week 4: Landing page, service catalog, request form
- Week 5: Request tracking, history, reviews

### Phase 5: Engineer Features (Weeks 5-6)
- Week 5: Engineer registration, dashboard
- Week 6: Status updates, price entry, notes

### Phase 6: Admin Features (Weeks 6-7)
- Week 6: Admin dashboard, analytics
- Week 7: Service management, engineer management, assignments

### Phase 7: Testing & Refinement (Weeks 7-8)
- Week 7: Integration testing, bug fixes, security testing
- Week 8: User testing, optimization, documentation

### Gantt Chart

```
Task                    | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8
------------------------|----|----|----|----|----|----|----|----
Planning & Design       |████|    |    |    |    |    |    |
Database Setup          |    |████|    |    |    |    |    |
Frontend Foundation     |    |    |████|    |    |    |    |
Customer Features       |    |    |    |████|    |    |    |
Engineer Features      |    |    |    |    |████|    |    |
Admin Features         |    |    |    |    |    |████|    |
Testing & Refinement    |    |    |    |    |    |    |████|
```

**Total Duration**: 8 weeks

**Milestones:**
- Week 2: Database completed
- Week 4: Customer features functional
- Week 6: All features implemented
- Week 8: Ready for deployment

---

## Conclusion

This HVAC service marketplace addresses inefficiencies in manual service coordination by providing a modern, bilingual, scalable digital platform. It benefits customers through transparency, engineers through organized workload management, and businesses through improved efficiency and data-driven insights.

The solution fills a market gap by offering an affordable, HVAC-specific, bilingual platform tailored for small and medium businesses.
