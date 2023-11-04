# this file exists for .gitattributes

# real Dockerfile = [
# ./server/Dockerfile-flask,
# ./server/Dockerfile-mysql,
# ./client/Dockerfile-react,
# ]

FROM    python:3.11
RUN     apt-get update && apt-get install -y cron
WORKDIR /app
COPY    . .
RUN     pip install jwt
RUN     pip install --no-cache-dir -r requirements.txt
RUN     crontab -l | { cat; echo "* * * * * /usr/local/bin/python /app/historyUpdate.py >> /var/log/cron.log 2>&1"; } | crontab -
CMD     ["sh", "-c", "cron && python app.py"]


FROM    mysql:8.0
ENV     MYSQL_ROOT_PASSWORD=1234
COPY    ./init.sql /docker-entrypoint-initdb.d