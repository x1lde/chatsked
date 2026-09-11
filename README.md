# ChatSked 📅💬

> **Simple booking management for local service businesses.**





\

---

## About

**ChatSked** is an early-stage SaaS prototype exploring a simpler way for small service businesses to manage appointments and customer relationships.

The idea is built around a common workflow in the Philippines:

**Customer messages the business → business checks availability → appointment gets written down → customer comes back later to confirm or reschedule.**

ChatSked aims to turn that fragmented process into a simple, mobile-first booking experience.

The long-term vision is to connect the conversations businesses already use — particularly Messenger and SMS — with a structured booking and customer management system.

> **Turn conversations into organized appointments.**

---

## 🚧 Current Status

**Prototype / Pre-MVP**

ChatSked is currently a prototype for:

* Product exploration
* UI/UX development
* Technical experimentation
* Co-founder collaboration
* Early product validation

It is **not production-ready** yet.

The architecture, features, branding, and product direction may change significantly as the concept develops.

---

## 🎯 The Problem

Many small appointment-based businesses still rely on a combination of:

* Facebook Messenger
* SMS
* Phone calls
* Notebooks
* Spreadsheets
* Memory

This works when the business is small.

As bookings increase, however, conversations become difficult to track and scheduling becomes increasingly manual.

A typical workflow might look like:

```text
Customer
   │
   ▼
Messenger / SMS
   │
   ▼
"Available po ba kayo Saturday?"
   │
   ▼
Owner checks schedule
   │
   ▼
Back-and-forth conversation
   │
   ▼
Appointment manually recorded
```

ChatSked explores a more structured workflow:

```text
Customer
   │
   ▼
Booking Link
   │
   ▼
Select Service
   │
   ▼
Choose Available Time
   │
   ▼
Confirm Booking
   │
   ▼
Business Dashboard
```

---

## 💡 The Idea

ChatSked isn't intended to force businesses to abandon the platforms they already use.

Instead, the goal is to build the **scheduling layer behind those conversations**.

A business could eventually share a ChatSked booking link through:

* Messenger
* SMS
* Facebook Pages
* Social media
* Their own website

Customers get a simple booking experience.

Businesses get a centralized place to manage their appointments.

---

## 👥 Target Market

The initial target market is **small, appointment-based businesses in the Philippines**, particularly businesses that primarily operate through their phones.

Potential customers include:

* 💇 Salons
* 💈 Barbershops
* 💅 Beauty businesses
* 🏥 Small clinics
* 🔧 Repair services
* 🐶 Pet grooming
* 📚 Tutorial centers
* 🏋️ Personal trainers
* 🚗 Automotive services
* 👤 Independent service providers

The initial focus is intentionally narrow:

> **Small local businesses that need scheduling but don't need a complicated enterprise system.**

---

## 🧪 Prototype

The current prototype focuses on establishing the foundation for the product rather than implementing every planned feature.

The repository currently contains the foundations of a web application and backend/API application.

### Web Application

The web side is being developed around a mobile-first business experience.

Current application structure includes areas for:

* Business dashboard
* Authentication
* Login
* Signup
* Customer booking
* Business-specific booking routes
* Shared UI components
* Application utilities

### Customer Booking

The prototype includes a business-specific booking route:

```text
/book/[businessSlug]
```

This establishes the foundation for eventually giving each business its own customer-facing booking experience.

### Backend / API

The project also contains a dedicated API application for server-side functionality and data management.

The backend is currently structured around:

* NestJS
* TypeScript
* Prisma
* Database-backed application logic
* Testing infrastructure

---

## 🏗️ Project Structure

```text
chatsked/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   │
│   └── api/
│       ├── prisma/
│       ├── src/
│       └── test/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

The project structure is still evolving as the prototype develops.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* TypeScript
* React
* Responsive / mobile-first UI

### Backend

* NestJS
* TypeScript
* Prisma

### Infrastructure

* Docker Compose
* Database-backed architecture

---

## 📱 Product Principles

### Mobile First

Small business owners should be able to manage their schedules from their phones.

The product should not assume that a business owner has a desktop computer available.

### Simple Over Complicated

ChatSked isn't trying to become an enterprise CRM.

The product should focus on the workflows small businesses actually need.

### Conversation Native

Businesses already communicate with customers through Messenger, SMS, and social media.

ChatSked should work **with that behavior**, not against it.

### Local First

The initial product is being designed around the realities of Filipino small businesses:

* Mobile-first usage
* Messenger-heavy communication
* SMS
* Small teams
* Owner-operated businesses
* Limited technical overhead
* Simple workflows

---

## 🔬 What We're Trying to Validate

At this stage, the most important question isn't whether we can build the software.

It's:

> **Do small local businesses actually want this?**

The prototype is intended to help us validate several assumptions.

### Product

* Is appointment management a meaningful problem?
* Which business niches experience it most?
* What features are actually necessary?
* What would make a business switch from its current workflow?

### User Experience

* Can an owner understand the dashboard immediately?
* Can a customer book without confusion?
* Does the mobile experience feel natural?
* Can the product reduce manual scheduling?

### Business

* Which businesses are most likely to pay?
* What would they realistically pay?
* Should ChatSked focus on one niche first?
* Is a Messenger/SMS-native approach actually valuable?

---

# 🗺️ Roadmap

### Phase 1 — Prototype

**Current**

* [x] Initial repository structure
* [x] Web application foundation
* [x] Backend/API foundation
* [x] Authentication pages
* [x] Business dashboard foundation
* [x] Customer booking route
* [x] Complete core booking workflow
* [x] Connect frontend workflows to backend
* [x] Refine mobile-first experience

### Phase 2 — MVP

* [ ] Business profiles
* [ ] Services
* [ ] Business availability
* [ ] Appointment creation
* [ ] Appointment management
* [ ] Customer records
* [ ] Staff management
* [ ] Business-specific booking pages
* [ ] Booking confirmations

### Phase 3 — Communication

* [ ] SMS notifications
* [ ] Appointment reminders
* [ ] Messenger integration
* [ ] Automated booking updates
* [ ] Cancellation/rescheduling notifications

### Phase 4 — Validation

* [ ] Test with local businesses
* [ ] Gather owner feedback
* [ ] Measure booking completion
* [ ] Identify strongest business niche
* [ ] Validate pricing
* [ ] Prepare production architecture

---

## 🔮 Long-Term Vision

ChatSked aims to become a lightweight operating system for appointment-based local businesses.

Not another bloated enterprise CRM.

Not another complicated scheduling platform.

Instead, a simple system that answers:

> **Who is coming?**
> **When are they coming?**
> **What are they booking?**
> **Who is handling it?**

And eventually:

> **Can we make the entire process happen naturally through the conversations businesses already have with their customers?**

---

## 🤝 About This Repository

This repository is currently a **founding-stage product workspace**.

It exists primarily for:

* Building the prototype
* Testing product ideas
* Exploring UX
* Developing the technical foundation
* Sharing progress with the founding team
* Preparing for eventual MVP development

The final product may look very different from this prototype.

That's okay.

**The goal right now isn't to build the final ChatSked.**

**The goal is to figure out what ChatSked should become.**

---

## 📌 Disclaimer

ChatSked is currently a prototype and is not intended for production use.

Features, architecture, pricing, integrations, branding, and product direction are subject to change as the product is validated.

---

<p align="center">
  <strong>ChatSked</strong><br>
  Booking made simpler for local businesses.
</p>
