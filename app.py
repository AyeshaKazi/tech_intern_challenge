from flask import Flask, render_template, jsonify, request
import pandas as pd
import json
import os
import logging
import datetime

# Creating Flask web application
app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
logging.basicConfig(filename='record.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

# Defining root directories
project_dir = os.path.dirname(os.path.abspath(__file__))
my_files = r"/static/data/"
file_dir = project_dir + my_files

jsonData = []
column = ""

# Reading json input
def loadData():
    """ Function to read the songData json file.
    The function also assumes that one of the keys(metricC) is misspelled as "metricCi and is corrected"
    """
    global jsonData
    json_file = file_dir + r"songData.json"
    raw_data = []
    with open(json_file) as f:
        raw_data = json.load(f)

    # Cleaning data
    for elem in raw_data:
        if "metricCi" in elem:
            elem['metricC'] = elem.pop('metricCi')
            
    # Discarding records that has invalid release date    
    validList = []
    for i in range(len(raw_data)):
        try:
            datetime.datetime.strptime(raw_data[i]['songReleaseDate'], '%d/%m/%Y')
            validList.append(raw_data[i])
        except:
            pass
    jsonData = validList


def date_validation(day, month, year):
    isValidDate = True  
    try :
        datetime.datetime(int(year),
                          int(month), int(day))
    except ValueError :
        isValidDate = False        
    if(not isValidDate) :
        return 1
    else :
        return 0

# Performing search operation on the datatable
def filterData(filter):
    """ Function to search for substrings individually in each column.
    The function is also capable of applying multiple search filters on multiple columns
    The search substring is not case sensitive.
    Search filter example -> {'artist': 'rihanna', 'playCount': '81'}
    """
    if len(filter) == 0:
        return jsonData
    filterList = []
    for obj in jsonData:
        res = all(str(val).upper() in str(obj.get(key, None)).upper()
                  for key, val in filter.items())
        if res:
            filterList.append(obj)
    if not filterList:
        filterList = [{}]
    return filterList

# Sorting Helper function
def sortJson(json):
    """ Fetching Column to sort the table """
    try:
        return (json[column])
    except KeyError:
        return 0

# Performing sort operation on the datatable
def sortData(col, order):
    """ sorting the table based on the given conditions
    Condition 1 - Column Name
    Condition 2 - Sorting order (ASC or DESC)
    """
    global jsonData, column
    if col is None or order is None or col == "":
        return jsonData
    column = col
    # logging.Logger.info('Sorting table')
    df = jsonData.sort(key=sortJson, reverse=not bool(order))
    return df

# Rendering webpage
@app.route("/")
def index():
    app.logger.info('Rendering webApp')
    return render_template("index.html")

# Reading params to sort, search and perform web pagination
@app.route("/searchData", methods=["POST"])
def searchData():
    """ Reading Search and Sort filters received from the UI 
    and calling the functions for the respective operations"""
    global jsonData
    app.logger.info("Number of Rows %s", len(jsonData))
    response_data = {}
    app.logger.info("Filter Query %s" ,request.json)
    app.logger.info('Filtering table')
    filteredData = filterData(request.json["filter"])
    app.logger.info('Sorting table')
    sortData(request.json["sortColumn"], request.json["sortOrderAsc"])
    app.logger.info('Implementing Pagination')
    startIdx = (request.json["pageNo"] - 1) * request.json["records"]
    endIdx = min(startIdx + request.json["records"], len(jsonData))
    response_data["data"] = filteredData[startIdx:endIdx]
    response_data["totalRecords"] = len(jsonData)
    app.logger.info('Rendered json into table')
    return response_data

# main
if __name__ == "__main__":
    loadData()
    app.run(debug=True)
