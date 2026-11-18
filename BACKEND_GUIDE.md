# backend setup

need two terminals to run frontend and backend together.

## django backend
```bash
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```
api runs on http://localhost:8000
admin page is at http://localhost:8000/admin (user `admin`, pass `admin123`)

## react frontend
```bash
npm run dev
```
frontend runs on http://localhost:5173

## mvc layout
- model: `backend/api/models.py` (Car, Sponsor, RecruitmentApplication in sqlite)
- view: react components (`src/components/recruitment/RecruitmentModal.tsx`) + `backend/api/serializers.py` for json
- controller: `backend/api/views.py` and `backend/api/urls.py` (handles GET/POST requests)

## tests
```bash
cd backend
python manage.py test
```
