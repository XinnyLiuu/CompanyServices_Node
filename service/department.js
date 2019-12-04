'use strict';
const express = require("express");
const router = express.Router();
const departmentBL = require("../business/department");

/**
 * GET /department
 * 
 * Returns the department as a JSON string
 */
router.get("/department", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get department
        const department = departmentBL.getDepartment(query);

        return res.json(department);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * GET /departments
 * 
 * Retrieves all department entities
 */
router.get("/departments", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get all departments
        const departments = departmentBL.getDepartments(query);

        return res.json(departments);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * PUT /department
 * 
 * Updates a department 
 */
router.put("/department", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Update the department
        const department = departmentBL.updateDepartment(body);

        return res.json({
            success: department
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * POST /department
 * 
 * Creates a department 
 */
router.post("/department", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Create the department
        const department = departmentBL.createDepartment(body);

        return res.json({
            success: department
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * DELETE /department
 * 
 * Deletes a department 
 */
router.delete("/department", (req, res) => {
    try {
        // Get the query params
        const query = req.query;

        // Delete the department
        const affected = departmentBL.deleteDepartment(query);

        if (affected === 1) return res.json({
            success: `Department ${query.dept_id} from ${query.company} deleted.`
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

module.exports = router;