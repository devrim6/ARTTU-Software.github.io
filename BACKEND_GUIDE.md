### terminal 1: run django backend (port 8000)
```bash
cd backend

# activate virtual environment (windows)
.\venv\Scripts\activate

# run migrations & seed sample data (already prepared)
python manage.py migrate
python manage.py seed_data

# start server
python manage.py runserver
```
backend runs at: **http://localhost:8000**
admin dashboard: **http://localhost:8000/admin**  
admin login credentials:
* **username:** `admin`
* **password:** `admin123`

---

### terminal 2: run react frontend (port 5173)
```bash
# in the root project folder
npm run dev
```

---

## mvc architecture breakdown

```
       [ View / Client Layer ]  <--- React 18 + Vite (localhost:5173)
                 │
                 │ HTTP GET / POST (JSON)
                 ▼
    [ Controller / Dispatcher ] <--- Django URLs & DRF ViewSets (backend/api/views.py)
                 │
                 │ ORM Queries & Validation
                 ▼
        [ Model Layer ]         <--- Django Models (backend/api/models.py)
                 │
                 │ SQL Queries
                 ▼
      [ Database Layer ]        <--- SQLite (backend/db.sqlite3)
```

1. **Model (M) — `backend/api/models.py`:**
   * `Car`: stores technical specifications (weight, horsepower, powertrain, season).
   * `Sponsor`: stores team corporate partners and tiers (platinum, gold, silver).
   * `RecruitmentApplication`: stores student candidates who apply to join the engineering team.
   * persisted using django's orm into sqlite (`db.sqlite3`).

2. **View (V) — `src/components/` & `src/pages/`:**
   * the user-facing view is our react 18 single-page application.
   * `RecruitmentModal.tsx` provides interactive forms to submit applications (POST) and browse live records from sqlite (GET).
   * serializers in `backend/api/serializers.py` format model instances into clean json representations.

3. **Controller (C) — `backend/api/views.py` & `urls.py`:**
   * `RecruitmentApplicationViewSet` and `CarViewSet` receive incoming http requests.
   * handles validation (`validate_year_of_study`), invokes orm operations, and dispatches json responses.

---

## 🎬 3-minute oral presentation script (live demo)

1. **show the public frontend:**
   * open `http://localhost:5173/recruitment`.
   * click **"Apply Online (Django API)"**.

2. **submit a live application (POST):**
   * fill in a candidate (e.g. your name, email, department: *Software & Telemetry*, motivation).
   * click **"Submit Application (POST)"**.
   * show the green confirmation box with the new application ID (e.g. `#3`).

3. **show live database records (GET):**
   * click the **"Database Records (GET)"** tab inside the modal.
   * show that the new record is instantly listed from sqlite with status `PENDING`.

4. **show backend admin & crud (UPDATE):**
   * open `http://localhost:8000/admin` in a new browser tab.
   * log in with `admin` / `admin123`.
   * open **Recruitment Applications**, find the candidate just created, and change their status from `Pending Review` to `Accepted into Team`. Click Save.

5. **verify full-stack synchronization:**
   * go back to the react app tab, click **"Refresh"**.
   * watch the status badge turn green `ACCEPTED` live in the frontend!
