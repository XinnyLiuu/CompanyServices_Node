'use strict';
/**
 * Business Layer logic for all department related routes
 */
const DataLayer = require("../companydata");
const COMPANY_NAME = "xl4998";
const dl = new DataLayer(COMPANY_NAME);

/**
 * Checks if the department exists
 * 
 * @param {*} company 
 * @param {*} dept_id 
 */
function isExistingDepartment(company, dept_id) {
    const d = dl.getDepartment(company, dept_id);

    if (d === null) throw new Error(`Department with id ${dept_id} does not exist!`);
}

/**
 * Checks if the department no is unique
 * 
 * @param {*} company 
 * @param {*} dept_no 
 */
function isUniqueDeptNo(company, dept_no) {
    dl.getAllDepartment(company).forEach(d => {
        if (d.getDeptNo() === dept_no) throw new Error("dept_no already exists!");
    });
}

/**
 * Gets the specified department
 */
exports.getDepartment = (query) => {
    // Check for company and check for if the department exists
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("dept_id")) {

        // Get department
        const d = dl.getDepartment(query.company, query.dept_id);

        if (d === null) throw new Error(`Department with id ${query.dept_id} does not exist!`);

        return d;
    }

    throw new Error("Invalid query parameters!");
};

/**
 * Retrieves the list of departments
 */
exports.getDepartments = (query) => {
    // Check for company
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME) {

        // Get departments
        const arr = dl.getAllDepartment(query.company);

        if (arr.length === 0) throw new Error(`There are no departments!`);

        return arr;
    }

    throw new Error("Invalid query parameters!");
};

/**
 * Updates a department based on information passed into the body
 */
exports.updateDepartment = (body) => {
    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("dept_id") &&
        body.hasOwnProperty("dept_name") &&
        body.hasOwnProperty("dept_no") &&
        body.hasOwnProperty("location")) {

        // Check if department exists
        isExistingDepartment(body.company, body.dept_id);

        // Check if department no is unique
        dl.getAllDepartment(body.company).forEach(d => {
            if (d.getId() === body.dept_id) return;
            if (d.getDeptNo() === body.dept_no) throw new Error("dept_no already exists!");
        });

        // Update the department
        let d = dl.getDepartment(body.company, body.dept_id);

        d.setDeptName(body.dept_name);
        d.setDeptNo(body.dept_no);
        d.setLocation(body.location);

        d = dl.updateDepartment(d);

        return d;
    }

    throw new Error("Invalid body parameters!");
}

/**
 * Creates a department based on information passed into the body
 */
exports.createDepartment = (body) => {
    body = JSON.parse(JSON.stringify(body)); // x-www-form-urlencoded data does not inherit from the typical JavaScript object

    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("dept_name") &&
        body.hasOwnProperty("dept_no") &&
        body.hasOwnProperty("location")) {

        // Check if department no is unique
        isUniqueDeptNo(body.company, body.dept_no);

        // Create department
        let d = new dl.Department(body.company, body.dept_name, body.dept_no, body.location);

        d = dl.insertDepartment(d);

        return d;
    }

    throw new Error("Invalid body parameters!");
}

/**
 * Deletes the specified department
 */
exports.deleteDepartment = (query) => {
    // Check for fields
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("dept_id")) {

        // Check if department exists
        isExistingDepartment(query.company, query.dept_id);

        // Delete the department
        const affected = dl.deleteDepartment(query.company, query.dept_id);
        if (affected === 0) throw new Error(`Could not delete department!`);

        return affected;
    }

    throw new Error("Invalid query parameters!");
}