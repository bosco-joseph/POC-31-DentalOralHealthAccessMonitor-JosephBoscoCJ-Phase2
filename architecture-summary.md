# Architecture Summary

## Project

Dental & Oral Health Access Monitor

## POC

POC-31

## Overview

The Dental & Oral Health Access Monitor is a full-stack intelligence dashboard designed to visualize synthetic dental and oral healthcare access indicators across the Gulf region.

The system combines workforce density, oral disease prevalence, school screening coverage, treatment waiting lists, and access-gap indicators into a single interactive dashboard.

## Architecture

```text
                    ┌─────────────────────────┐
                    │       Next.js UI         │
                    │     TypeScript + React   │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / JSON
                                 ▼
                    ┌─────────────────────────┐
                    │       FastAPI API        │
                    │        Python            │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Synthetic Dataset     │
                    │         Pandas           │
                    └─────────────────────────┘

Frontend

The frontend is implemented using:

Next.js
React
TypeScript
Tailwind CSS
Recharts
React Simple Maps
World Atlas geographic data

The frontend provides:

KPI summary cards
Interactive prevalence map
Regional filtering
Age-band filtering
Treatment filtering
Dentist density visualization
Treatment waiting-list trend
School screening coverage
Access-gap ranking
Regional intelligence panels
Backend

The backend uses FastAPI.

Primary endpoints:

GET /api/overview
GET /api/prevalence
GET /api/dentist-density
GET /api/waitlists
GET /api/screening
GET /api/access-gaps
Data Flow
Synthetic Data
      ↓
FastAPI
      ↓
JSON API
      ↓
Next.js
      ↓
Dashboard Visualizations
Geographic Coverage

The dashboard covers six Gulf regions:

Saudi Arabia
United Arab Emirates
Qatar
Kuwait
Bahrain
Oman
Data Classification

The analytical values used by the PoC are synthetic.

The project structure is designed so that validated external datasets can be integrated later without requiring a complete frontend redesign.

Filtering Model
Region

Controls regional context across the dashboard.

Age Band

Controls the oral disease prevalence visualization.

Treatment Type

Controls treatment waiting-list analysis.

Visualization Model
Oral Disease Prevalence

A geographic choropleth represents prevalence by region and age band.

Dentist Density

A bar chart compares dentists per 100,000 population.

Wait-list Trends

A line chart represents treatment waiting-list pressure over time.

School Screening

A bar chart compares screening coverage between regions.

Access Gap

A ranked table identifies regions with higher access-gap scores.

Design Principles

The dashboard follows:

70/30 primary-content and intelligence-control layout
Dark intelligence-dashboard visual language
Clear information hierarchy
Contextual filtering
Minimal decorative elements
Visualization-first storytelling
Responsive layout
Future Architecture

Future versions can replace the synthetic dataset with validated external sources and introduce:

Database persistence
Scheduled data ingestion
Authentication
Production geospatial services
Historical trend storage
Cloud deployment
Automated validation
