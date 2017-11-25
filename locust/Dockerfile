FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update
RUN apt-get install -y build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN python3.6 -m pip install pip --upgrade
RUN python3.6 -m pip install wheel

RUN pip install locustio

RUN mkdir -p /locust

ADD ./scripts/locustfile.py /locust/locustfile.py

ADD ./scripts/run.sh /run.sh
RUN chmod +x run.sh

ENTRYPOINT ["/run.sh"]

EXPOSE 8089