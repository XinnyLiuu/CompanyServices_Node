'use strict';
const moment = require("moment");

/**
 * Business Layer logic for all employee related routes
 */
const DataLayer = require("../companydata");
const COMPANY_NAME = "xl4998";
const dl = new DataLayer(COMPANY_NAME);

/**
 * Check if the department exists
 * 
 * @param {*} company 
 * @param {*} dept_id 
 */
function isExistingDepartment(company, dept_id) {
    const d = dl.getDepartment(company, dept_id);

    if (d === null) throw new Error(`Department with id ${dept_id} does not exist!`);
}

/**
 * Check if this is the first employee
 * 
 * @param {*} company 
 * @param {*} body 
 */
function isFirstEmployee(company, body) {
    const arr = dl.getAllEmployee(company);

    if (arr.length === 0) {
        body.mng_id = 0;
        return body;
    }

    return body;
}

/**
 * Check if the employee exists
 * 
 * @param {*} mng_id 
 */
function isExistingEmployee(mng_id) {
    const e = dl.getEmployee(mng_id);

    if (e === null) throw new Error(`Employee with id ${mng_id} does not exist!`);
}

/**
 * Check if the hire date is valid 
 * 
 * Hire dates should be equal to the current date or earlier 
 * Hire dates must be M T W TH F (1-4)
 * 
 * @param {*} hire_date 
 */
function isValidHireDate(hire_date) {
    // Format the date to be YYYY-MM-DD and check if it is valid
    const hire = moment(hire_date, "YYYY-MM-DD");

    if (!hire.isValid()) throw new Error("The hire date specified is not valid! Please enter in YYYY-MM-DD format!");

    // Check if the date is equal to or earlier than the current date
    const current = moment();

    if (!hire.isSameOrBefore(current)) throw new Error("The hire date is not equal or earlier than the current date!");

    // Check if the date is not on a weekend
    if (hire.day() === 0 || hire.day() === 6) throw new Error("The hire date is on a weekend!");
}

/**
 * Check if the employee no is unique
 * 
 * @param {*} company 
 * @param {*} emp_no 
 */
function isUniqueEmpNo(company, emp_no) {
    const arr = dl.getAllEmployee(company);

    arr.forEach(e => {
        if (e.getEmpNo() === emp_no) throw new Error("emp_no already exists!");
    });
}

/**
 * Gets the specified employee
 */
exports.getEmployee = (query) => {
    // Check for company and check for if the employee exists
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("emp_id")) {

        // Get employee
        const e = dl.getEmployee(query.emp_id);

        if (e === null) throw new Error(`Employee with id ${query.emp_id} does not exist!`);

        return e;
    }

    throw new Error("Invalid query parameters!");
};

/**
 * Retrieves the list of employees
 */
exports.getEmployees = (query) => {
    // Check for company
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME) {

        // Get employees
        const arr = dl.getAllEmployee(query.company);

        if (arr.length === 0) throw new Error(`There are no employees!`);

        return arr;
    }

    throw new Error("Invalid query parameters!");
};

/**
 * Creates an employee based on information passed into the body
 */
exports.createEmployee = (body) => {
    body = JSON.parse(JSON.stringify(body)); // x-www-form-urlencoded data does not inherit from the typical JavaScript object

    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("dept_id") &&
        body.hasOwnProperty("mng_id") &&
        body.hasOwnProperty("hire_date") &&
        body.hasOwnProperty("emp_no") &&
        body.hasOwnProperty("emp_name") &&
        body.hasOwnProperty("job") &&
        body.hasOwnProperty("salary")) {

        // Check if department exists
        isExistingDepartment(body.company, body.dept_id);

        // Check if this is the first employee
        body = isFirstEmployee(body.company, body);

        if (body.mng_id !== 0) {
            // Check if the specified manager exists
            isExistingEmployee(body.mng_id);
        }

        // Check the hire date
        isValidHireDate(body.hire_date);

        // Check that the employee no is unique
        isUniqueEmpNo(body.company, body.emp_no);

        // Create the employee
        let e = new dl.Employee(
            body.emp_name,
            body.emp_no,
            moment(body.hire_date).format("YYYY-MM-DD"),
            body.job,
            body.salary,
            body.dept_id,
            body.mng_id);

        e = dl.insertEmployee(e);

        return e;
    }

    throw new Error("Invalid body parameters!");
}

/**
 * Updates an employee based on information passed into the body
 */
exports.updateEmployee = (body) => {
    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("emp_id") &&
        body.hasOwnProperty("dept_id") &&
        body.hasOwnProperty("mng_id") &&
        body.hasOwnProperty("hire_date") &&
        body.hasOwnProperty("emp_no") &&
        body.hasOwnProperty("emp_name") &&
        body.hasOwnProperty("job") &&
        body.hasOwnProperty("salary")) {

        // Check if the specified employee exists
        isExistingEmployee(body.emp_id);

        // Check if department exists
        isExistingDepartment(body.company, body.dept_id);

        // Check if this is the first employee
        body = isFirstEmployee(body.company, body);

        if (body.mng_id !== 0) {
            // Check if the specified manager exists
            isExistingEmployee(body.mng_id);
        }

        // Check the hire date
        isValidHireDate(body.hire_date);

        // Check that the employee no is unique
        dl.getAllEmployee(body.company).forEach(e => {
            if (e.getId() === body.emp_id) return;
            if (e.getEmpNo() === body.emp_no) throw new Error("emp_no already exists!");
        });

        // Update the employee
        let e = dl.getEmployee(body.emp_id);

        e.setDeptId(body.dept_id);
        e.setMngId(body.mng_id);
        e.setHireDate(
            moment(body.hire_date).format("YYYY-MM-DD")
        );
        e.setEmpNo(body.emp_no);
        e.setEmpName(body.emp_name);
        e.setJob(body.job);
        e.setSalary(body.salary);

        e = dl.updateEmployee(e);

        return e;
    }

    throw new Error("Invalid body parameters!");
}

/**
 * Deletes the specified employee
 */
exports.deleteEmployee = (query) => {
    // Check for fields
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("emp_id")) {

        // Check if employee exists
        isExistingEmployee(query.emp_id);

        // Delete the employee
        const affected = dl.deleteEmployee(query.emp_id);
        if (affected === 0) throw new Error(`Could not delete employee!`);

        return affected;
    }

    throw new Error("Invalid query parameters!");
}