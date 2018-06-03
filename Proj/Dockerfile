FROM python:3.5

COPY ./ /

RUN pip install -r requirements.txt

CMD ["sh", "-c", "python api.py"]
EXPOSE 5000