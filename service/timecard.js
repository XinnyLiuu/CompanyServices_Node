'use strict';
const express = require("express");
const router = express.Router();
const timecardBL = require("../business/timecard");

/**
 * GET /timecard
 * 
 * Returns the timecard as a JSON string
 */
router.get("/timecard", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get timecard
        const timecard = timecardBL.getTimecard(query);

        return res.json(timecard);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * GET /timecards
 * 
 * Retrieves all timecard entities
 */
router.get("/timecards", (req, res) => {
    try {
        // Get the query params 
        const query = req.query;

        // Get all timecards
        const timecards = timecardBL.getTimecards(query);

        return res.json(timecards);
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * POST /timecard
 * 
 * Creates a timecard 
 */
router.post("/timecard", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Create the timecard
        const timecard = timecardBL.createTimecard(body);

        return res.json({
            success: timecard
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * PUT /timecard
 * 
 * Updates a timecard 
 */
router.put("/timecard", (req, res) => {
    try {
        // Get the request body
        const body = req.body;

        // Update the timecard
        const timecard = timecardBL.updateTimecard(body);

        return res.json({
            success: timecard
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

/**
 * DELETE /timecard
 * 
 * Deletes a timecard 
 */
router.delete("/timecard", (req, res) => {
    try {
        // Get the query params
        const query = req.query;

        // Delete the timecard
        const affected = timecardBL.deleteTimecard(query);

        if (affected === 1) return res.json({
            success: `Timecard ${query.timecard_id} deleted.`
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

module.exports = router;