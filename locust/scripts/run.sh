#!/bin/bash

host=${LOCUST_TARGET_HOST}
locust -f /locust/locustfile.py --host=$host