FROM python:3.5

COPY ./ /

RUN pip install -r requirements.txt

EXPOSE 5000
ENTRYPOINT [ "python" ]
CMD [ "api.py" ]