Dental & Oral Health Access Monitor
POC-31
A healthcare intelligence dashboard for visualizing dental and oral healthcare access indicators across the Gulf region.

Data Notice: This PoC uses synthetic analytical data for demonstration and visualization purposes. It should not be interpreted as validated healthcare statistics.

Project Overview
The Dental & Oral Health Access Monitor is an interactive intelligence dashboard designed to make dental healthcare access gaps visible across Gulf countries.

The dashboard combines:

Oral disease prevalence

Dental workforce density

Treatment waiting lists

School dental screening coverage

Regional access-gap indicators

The system provides an interactive regional view through maps, charts, rankings, filters, and contextual intelligence panels.

Problem Statement
Dental and oral healthcare access can vary significantly between regions due to differences in:

Dental workforce availability

Disease burden

Screening coverage

Treatment capacity

Waiting-list pressure

These differences can be difficult to understand when the indicators are viewed separately.

This PoC brings the indicators together into a single intelligence interface so users can compare regions and identify areas requiring greater attention.

Key Features
Oral Disease Prevalence
Interactive Gulf-region choropleth showing synthetic oral disease prevalence.
Users can change the age band to compare:

5–12

13–18

19–44

45+

Dentist Density
Regional comparison of dentists per 100,000 population.

Treatment Wait-list Trends
Interactive trend visualization showing treatment waiting-list pressure over time.
Supported treatment categories:

Orthodontics

General Dentistry

Pediatric Dentistry

Oral Surgery

School Dental Screening
Regional comparison of school dental screening coverage.

Access-gap Ranking
Ranks regions according to the synthetic access-gap score.

Interactive Filters
The dashboard supports:

Region

Age Band

Treatment Type

Filters update the relevant visualizations and contextual information.

Regional Intelligence
The dashboard provides contextual intelligence through:

Why This Matters

Who Controls the Rail

Regional Snapshot

Key Signal

Data Scope

Dashboard Architecture
Plaintext
                    ┌─────────────────────────┐
                    │       Next.js UI         │
                    │     React + TypeScript   │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / JSON
                                 ▼
                    ┌─────────────────────────┐
                    │       FastAPI API        │
                    │          Python           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Synthetic Dataset     │
                    │          Python          │
                    └─────────────────────────┘
Data Flow
Plaintext
Synthetic Data
      ↓
FastAPI
      ↓
JSON API
      ↓
Next.js
      ↓
Dashboard
      ↓
Interactive Visualizations
Technology Stack
Frontend

Next.js

React

TypeScript

Tailwind CSS

Recharts

React Simple Maps

World Atlas

Backend

Python

FastAPI

Pandas

Uvicorn

Geographic Coverage
The current PoC covers six Gulf regions:

Saudi Arabia

United Arab Emirates

Qatar

Kuwait

Bahrain

Oman

Data Model
The PoC uses synthetic data covering five primary analytical areas:

Prevalence

region

age_band

prevalence

Dentist Density

region

population

dentists

density

Waiting Lists

region

treatment

month

patients_waiting

School Screening

region

schools

screened

coverage

Access Gaps

region

dentist_density

disease_prevalence

screening_coverage

waitlist_pressure

access_gap_score

Backend API
The FastAPI backend provides the following endpoints:

GET /api/overview

GET /api/prevalence

GET /api/dentist-density

GET /api/waitlists

GET /api/screening

GET /api/access-gaps

Project Structure
Plaintext
POC-31-DentalOralHealthAccessMonitor-JosephBoscoCJ/
│
├── backend/
│   ├── data/
│   │   ├── __init__.py
│   │   └── dental_data.py
│   │
│   ├── main.py
│   └── venv/
│
├── frontend/
│   ├── app/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── PrevalenceMap.tsx
│   │
│   ├── package.json
│   └── ...
│
├── architecture-summary.md
├── VAR_REPORT.md
├── UAT_CHECKLIST.md
├── README.md
└── .gitignore
Note: backend/venv and frontend/node_modules are excluded from version control through .gitignore.

Setup Instructions
Prerequisites
Install:

Node.js

npm

Python 3.x

Git

Backend Setup
Navigate to the backend:

Bash
cd backend
Create the virtual environment:

Bash
python -m venv venv
Activate it on Windows:

Bash
.\venv\Scripts\activate
Install dependencies:

Bash
pip install fastapi uvicorn pandas
Start the API:

Bash
uvicorn main:app --reload
The API will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Frontend Setup
Open another terminal and navigate to the frontend:

Bash
cd frontend
Install dependencies:

Bash
npm install
(If npm reports the React peer-dependency conflict for react-simple-maps, use npm install --legacy-peer-deps)

Start the development server:

Bash
npm run dev
The dashboard will be available at: http://localhost:3000

Running the Application
Both services must be running simultaneously.

Terminal 1 — Backend

Bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
Terminal 2 — Frontend

Bash
cd frontend
npm run dev
Then open: http://localhost:3000

Screenshots
Main Dashboard
Regional Intelligence
Analytics Section
AI Usage Summary
AI tools were used during development as an engineering assistance layer.
AI assistance included:

Project structure planning

Architecture discussion

Component organization

UI implementation assistance

Debugging support

Error diagnosis

API structure guidance

Visualization implementation guidance

Documentation drafting

All generated code and implementation decisions were reviewed, tested, modified, and integrated into the project manually. The final implementation was validated through functional testing of the application and its API endpoints.

Validation
The project was validated through:

API Validation

Overview endpoint

Prevalence endpoint

Dentist-density endpoint

Wait-list endpoint

Screening endpoint

Access-gap endpoint

Functional Validation

Region filtering

Age-band filtering

Treatment filtering

Combined filtering

Filter reset

Map interaction

Regional intelligence display

UI Validation

70/30 dashboard structure

KPI readability

Map visualization

Chart readability

Table readability

Sidebar organization

Responsive layout

See VAR_REPORT.md and UAT_CHECKLIST.md for the detailed validation records.

Future Enhancements
Future versions could integrate validated healthcare datasets and introduce:

Live data ingestion

Historical data storage

Database integration

Automated data pipelines

More detailed geographic boundaries

Healthcare facility-level analysis

Predictive access-gap modelling

Authentication and role-based access

Cloud deployment

Automated testing

Scheduled data updates

Disclaimer
This project is a proof-of-concept intelligence dashboard.
The analytical values currently displayed are synthetic and are intended only to demonstrate the application's architecture, visualization capabilities, filtering model, and intelligence workflow. They should not be used for medical, policy, operational, or healthcare planning decisions.

Project Status
Completed — PoC-31
The current implementation includes the required dashboard functionality, interactive visualizations, filtering, contextual intelligence panels, validation documentation, and UAT documentation.