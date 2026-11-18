# simple recruitment portal (django + react)

minimal mvc setup with just the recruitment page and django backend.

## backend
```bash
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```
runs on http://localhost:8000
admin panel: http://localhost:8000/admin (user `admin`, pass `admin123`)

## frontend
```bash
npm run dev
```
runs on http://localhost:5173

## mvc structure
- model: `backend/api/models.py` (`RecruitmentApplication` in sqlite)
- view: `src/pages/RecruitmentPage.tsx` (form + list) and `backend/api/serializers.py` (json)
- controller: `backend/api/views.py` and `backend/api/urls.py` (`RecruitmentApplicationViewSet`)

## tests
```bash
cd backend
python manage.py test
```
