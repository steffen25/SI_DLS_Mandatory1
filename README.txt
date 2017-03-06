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
All requests are GET requests.

	1. Get all users:
	localhost:4000/users/

	2. Get user by id:
	localhost:4000/users/1

		1. Get all teams:
	localhost:4000/teams/

	2. Get team by id:
	localhost:4000/teams/1

		1. Get all schedules:
	localhost:4000/schedules/

	2. Get user by id:
	localhost:4000/schedules/1








