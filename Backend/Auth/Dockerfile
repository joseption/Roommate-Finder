FROM python:3.10.4
EXPOSE 80
WORKDIR /auth
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "80","--log-level","debug"]
