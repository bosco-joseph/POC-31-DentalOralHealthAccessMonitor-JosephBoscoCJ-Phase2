from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data.dental_data import (
    REGIONS,
    PREVALENCE,
    DENTIST_DENSITY,
    WAITLISTS,
    SCREENING,
    ACCESS_GAPS,
)

app = FastAPI(title="Dental & Oral Health Access Monitor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://poc-31-dental-oral-health-access-monitor-joseph-bosco-c-bosco20.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Dental & Oral Health Access Monitor API"}


@app.get("/api/overview")
def overview():
    return {
        "regions": len(REGIONS),
        "total_dentists": sum(item["dentists"] for item in DENTIST_DENSITY),
        "average_density": round(
            sum(item["density"] for item in DENTIST_DENSITY) / len(DENTIST_DENSITY),
            1,
        ),
        "average_screening": round(
            sum(item["coverage"] for item in SCREENING) / len(SCREENING),
            1,
        ),
        "highest_access_gap": ACCESS_GAPS[0]["region"],
    }


@app.get("/api/prevalence")
def prevalence():
    return PREVALENCE


@app.get("/api/dentist-density")
def dentist_density():
    return DENTIST_DENSITY


@app.get("/api/waitlists")
def waitlists():
    return WAITLISTS


@app.get("/api/screening")
def screening():
    return SCREENING


@app.get("/api/access-gaps")
def access_gaps():
    return ACCESS_GAPS