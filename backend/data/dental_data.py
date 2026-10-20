REGIONS = [
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
]

PREVALENCE = [
    {"region": "Saudi Arabia", "age_band": "5-12", "prevalence": 68},
    {"region": "Saudi Arabia", "age_band": "13-18", "prevalence": 61},
    {"region": "Saudi Arabia", "age_band": "19-44", "prevalence": 54},
    {"region": "Saudi Arabia", "age_band": "45+", "prevalence": 49},
    {"region": "United Arab Emirates", "age_band": "5-12", "prevalence": 57},
    {"region": "United Arab Emirates", "age_band": "13-18", "prevalence": 51},
    {"region": "United Arab Emirates", "age_band": "19-44", "prevalence": 46},
    {"region": "United Arab Emirates", "age_band": "45+", "prevalence": 42},
    {"region": "Qatar", "age_band": "5-12", "prevalence": 52},
    {"region": "Qatar", "age_band": "13-18", "prevalence": 47},
    {"region": "Qatar", "age_band": "19-44", "prevalence": 41},
    {"region": "Qatar", "age_band": "45+", "prevalence": 38},
    {"region": "Kuwait", "age_band": "5-12", "prevalence": 63},
    {"region": "Kuwait", "age_band": "13-18", "prevalence": 56},
    {"region": "Kuwait", "age_band": "19-44", "prevalence": 49},
    {"region": "Kuwait", "age_band": "45+", "prevalence": 44},
    {"region": "Bahrain", "age_band": "5-12", "prevalence": 55},
    {"region": "Bahrain", "age_band": "13-18", "prevalence": 49},
    {"region": "Bahrain", "age_band": "19-44", "prevalence": 43},
    {"region": "Bahrain", "age_band": "45+", "prevalence": 39},
    {"region": "Oman", "age_band": "5-12", "prevalence": 60},
    {"region": "Oman", "age_band": "13-18", "prevalence": 54},
    {"region": "Oman", "age_band": "19-44", "prevalence": 47},
    {"region": "Oman", "age_band": "45+", "prevalence": 43},
]

DENTIST_DENSITY = [
    {"region": "Saudi Arabia", "population": 36000000, "dentists": 18500, "density": 51.4},
    {"region": "United Arab Emirates", "population": 10000000, "dentists": 7200, "density": 72.0},
    {"region": "Qatar", "population": 3000000, "dentists": 2500, "density": 83.3},
    {"region": "Kuwait", "population": 4300000, "dentists": 2800, "density": 65.1},
    {"region": "Bahrain", "population": 1600000, "dentists": 1200, "density": 75.0},
    {"region": "Oman", "population": 5500000, "dentists": 2500, "density": 45.5},
]

TREATMENTS = [
    "Orthodontics",
    "General Dentistry",
    "Pediatric Dentistry",
    "Oral Surgery",
]

WAITLISTS = []

for region, base in [
    ("Saudi Arabia", 1850),
    ("United Arab Emirates", 1200),
    ("Qatar", 620),
    ("Kuwait", 950),
    ("Bahrain", 420),
    ("Oman", 1100),
]:
    for treatment_index, treatment in enumerate(TREATMENTS):
        for month in range(1, 7):
            WAITLISTS.append({
                "region": region,
                "treatment": treatment,
                "month": f"2026-{month:02d}",
                "patients_waiting": (
                    base
                    + treatment_index * 180
                    + month * 35
                ),
            })

SCREENING = [
    {"region": "Saudi Arabia", "schools": 4200, "screened": 2600, "coverage": 61.9},
    {"region": "United Arab Emirates", "schools": 1100, "screened": 790, "coverage": 71.8},
    {"region": "Qatar", "schools": 420, "screened": 330, "coverage": 78.6},
    {"region": "Kuwait", "schools": 850, "screened": 560, "coverage": 65.9},
    {"region": "Bahrain", "schools": 310, "screened": 250, "coverage": 80.6},
    {"region": "Oman", "schools": 1250, "screened": 700, "coverage": 56.0},
]

ACCESS_GAPS = [
    {
        "region": "Oman",
        "dentist_density": 45.5,
        "disease_prevalence": 60,
        "screening_coverage": 56.0,
        "waitlist_pressure": 82,
        "access_gap_score": 84,
    },
    {
        "region": "Saudi Arabia",
        "dentist_density": 51.4,
        "disease_prevalence": 68,
        "screening_coverage": 61.9,
        "waitlist_pressure": 88,
        "access_gap_score": 82,
    },
    {
        "region": "Kuwait",
        "dentist_density": 65.1,
        "disease_prevalence": 63,
        "screening_coverage": 65.9,
        "waitlist_pressure": 69,
        "access_gap_score": 68,
    },
    {
        "region": "United Arab Emirates",
        "dentist_density": 72.0,
        "disease_prevalence": 57,
        "screening_coverage": 71.8,
        "waitlist_pressure": 58,
        "access_gap_score": 55,
    },
    {
        "region": "Bahrain",
        "dentist_density": 75.0,
        "disease_prevalence": 55,
        "screening_coverage": 80.6,
        "waitlist_pressure": 46,
        "access_gap_score": 43,
    },
    {
        "region": "Qatar",
        "dentist_density": 83.3,
        "disease_prevalence": 52,
        "screening_coverage": 78.6,
        "waitlist_pressure": 39,
        "access_gap_score": 36,
    },
]