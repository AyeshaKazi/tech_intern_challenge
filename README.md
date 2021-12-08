# iHeartMedia Project

# Implementation Tech Stack:
    1. Backend - Python with Flask framework (Developed on Python version 3.8)
    2. UI - HTML, Styling - CSS & Bootstrap, Scripting - Javascript & Jquery

# Python dependencies if not installed already:
    pip install flask
    pip install request
    pip install pandas 
    pip install json
    pip install os
    pip install logging
    pip install datetime

# Executing the project:
    cd iHeartMedia
    python app.py

# Features:
    1. Searching 
        a. Ability to filter on each column
        b. Ability to search on multiple columns
        c. Ability to search a keywords or part of a string for any given column(substring)
    2. Ability to sort each column in ascending or descending
    3. Pagination - Ability to render 50, 100 or 200 rows in the table at a time
    4. Theme - Ability to switch between light and dark theme on the user interface
    5. Data cleaning and validation performed based on the following rules **:
        a. Cleaned json data (Refer assumptions point 1)
        b. Song release date validation
            i. Year is greater than 999
            ii. Month is between 1 to 12
            ii. Date is between 1 to 31 or 1 to 30 or 1 to 28 depending on the month.
    6. Basic logging for debugging the backend. Log file name record.log
    7. Basic exception handling

# ** Assumptions:
    1. The song "Temperatxre" had an additional key as "metricCi" and the key "metricC" was missing. I've assumed that it was a data collection error and have replaced the "metricCi" to "metricC"
    2. I've assumed that a release date is invalid if the year is less than 1000
