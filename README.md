[![Build Status](https://travis-ci.org/steffen25/SI_DLS_Mandatory1.svg?branch=master)](https://travis-ci.org/steffen25/SI_DLS_Mandatory1)
[![Coverage Status](https://coveralls.io/repos/github/steffen25/SI_DLS_Mandatory1/badge.svg?branch=master)](https://coveralls.io/github/steffen25/SI_DLS_Mandatory1?branch=master)

Made by: Steffen Thomsen - Thomas Attermann 
________________________________________________________

/////////////////// Schedule Planner ///////////////////
________________________________________________________

Quick description:
The webservice is developed in node.js, using the express routing framework.

The idea of the webservice is to present and modify (later) schedules for students. 
A student will be able to access his/her schedule and see what team they are assigned to.
A team will have a schedule that shows the subjects in the requested week. 
________________________________________________________

1. Prerequisites:

Noode.js must be installed. 
________________________________________________________

2. Install instruction:

	1. git clone https://github.com/steffen25/SI_DLS_Mandatory1.git     (Clones the repo to your machine)
	2. npm install 														(Downloads and install project dependencies)
________________________________________________________

3. Usage:

Access the webservice with your browser/Postman. 
The application runs on Port 4000 and returns data in JSON format. 


## Locust load testing

```sh
cd locust
docker build -t locust-test .
# Test scenarios are written in locustfile.py 

# for mac
docker run --rm -it -p 8089:8089 -e LOCUST_TARGET_HOST='http://docker.for.mac.localhost:4000' locust-test

# Visit the web UI
http://localhost:8089
```
