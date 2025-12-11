FROM python:3.11-slim

WORKDIR /app

COPY backend/ ./backend/

WORKDIR /app/backend

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/backend

CMD ["flask", "run", "--host=0.0.0.0"]