/* Declaring global variables for filtering, sorting and pagination */
var data = []
var totalRecords = 0;
var records = 50;
var pageNo = 1;
var filter = {}
var sortColumn = ""
var sortOrderAsc = null

/* Default theme on loading document */
$(document).ready(function () {
    document.documentElement.setAttribute("data-theme", "light");
    loadData(true);
});

/* Loading data table and  setting up pagination */
function loadData(isFirst = false) {
    getData();
    if (isFirst) {
        loadTableHead();
    }
    loadTableBody();
    setupPages();
}

/* Dynamically loading table head */
function loadTableHead() {
    if (data == undefined || data.length == 0) { return; }
    var html = "<tr>";
    var columns = Object.keys(data[0]);
    for (var i = 0; i < columns.length; i++) {
        var buttons = "&nbsp <i onclick=\"sortData(" + columns[i] + ")\" class=\"fas fa-caret-up\"></i><i onclick=\"sortData(" + columns[i] + ")\" class=\"fas fa-caret-down\"></i>"
        html += "<th>" + columns[i] + buttons + "<br /><input class=\"data-search\" type=\"text\" placeholder=\"Search...\" id=\"" + columns[i] + "\" onchange=\"filterUpdate(" + columns[i] + ")\" /></th > ";
    }
    html += "</tr>";
    $("#data-thead").html(html);
}

/* Dynamically loading table body */
function loadTableBody() {
    if (data == undefined || data.length == 0) { return; }
    var html = "<tr>";
    var columns = Object.keys(data[0]);

    for (var row = 0; row < data.length; row++) {
        html += "<tr>";
        for (var j = 0; j < columns.length; j++) {
            html += "<td title=\"" + data[row][columns[j]] + "\">" + data[row][columns[j]] + "</td>";
        }
        html += "</tr>";
    }

    $("#data-tbody").html(html);
}

/* Passing input filter from UI to python API */
function getData() {
    input = {}
    input.pageNo = pageNo;
    input.records = records;
    input.filter = filter
    input.sortColumn = sortColumn
    input.sortOrderAsc = sortOrderAsc
    console.log(input)
    $.ajax({
        url: "/searchData",
        type: "POST",
        data: JSON.stringify(input),
        async: false,
        contentType: "application/json; charset=utf-8"
    })
        .done(function (result) {
            data = result.data
            totalRecords = result.totalRecords
        })
}

/* Pagination */
function setupPages() {
    $("#pagination").pagination({
        dataSource: new Array(totalRecords),
        pageSize: records,
        pageNumber: pageNo,
        showPrevious: false,
        showNext: false,
        autoHidePrevious: true,
        autoHideNext: true,
        callback: function (data, pagination) {
            pageNo = pagination.pageNumber
        },
        afterPageOnClick: function () {
            if (data != undefined && data.length > 0)
                loadData();
        }
    })
}

/* theme toggling */
$("#theme-toggle").click(function () {
    if (document.documentElement.getAttribute("data-theme") == "dark") {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
    }
});

/* Pagination - no of records change */
$("#selectRecords").on("change", function () {
    records = parseInt($(this).val());
    pageNo = 1;
    loadData();
})

/* Validating conditions for filtering the data in the table */
function filterUpdate(element) {
    if ($(element).val() === "") {
        delete filter[$(element).attr("id")];
    } else {
        filter[$(element).attr("id")] = $(element).val();
    }
    loadData();
}

/* Validating conditions for sorting 
Condition - 1 : Column Name 
Condition - 2 : Sorting order (Ascending or Descending)
*/
function sortData(element) {
    if (sortOrderAsc == null || !sortOrderAsc) {
        sortOrderAsc = true;
    } else {
        sortOrderAsc = false;
    }
    sortColumn = $(element).attr("id")
    loadData();
}