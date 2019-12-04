'use strict'; 
/**
 * Company Services Routes
 */
const companyRoute = require("./company"); 
const departmentRoute = require("./department");
const employeeRoute = require("./employee");
const timecardRoute = require("./timecard");

module.exports = {
    companyRoute,
    departmentRoute,
    employeeRoute, 
    timecardRoute
};