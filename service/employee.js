'use strict';
const express = require("express");
const router = express.Router();
const employeeBL = require("../business/employee");

/**
 * GET /employee
 * 
 * Returns the employee as a JSON string
 */
router.get("/employee", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get employee
        const employee = employeeBL.getEmployee(query);

        return res.json(employee);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * GET /employees
 * 
 * Retrieves all employee entities
 */
router.get("/employees", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get all employees
        const employees = employeeBL.getEmployees(query);

        return res.json(employees);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * POST /employee
 * 
 * Creates an employee 
 */
router.post("/employee", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Create the employee
        const employee = employeeBL.createEmployee(body);

        return res.json({
            success: employee
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * PUT /employee
 * 
 * Updates an employee 
 */
router.put("/employee", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Update the employee
        const employee = employeeBL.updateEmployee(body);

        return res.json({
            success: employee
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * DELETE /employee
 * 
 * Deletes an employee 
 */
router.delete("/employee", (req, res) => {
    try {
        // Get the query params
        const query = req.query;

        // Delete the employee
        const affected = employeeBL.deleteEmployee(query);

        if (affected === 1) return res.json({
            success: `Employee ${query.emp_id} deleted.`
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});


module.exports = router;