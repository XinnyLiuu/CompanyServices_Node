'use strict';
const express = require("express");
const router = express.Router();
const companyBL = require("../business/company");

/**
 * DELETE /company
 * 
 * Deletes a company 
 */
router.delete("/company", (req, res) => {
    try {
        // Get the query params
        const query = req.query;

        // Delete the company
        const affected = companyBL.deleteCompany(query);

        if (affected > 0) return res.json({
            success: `${query.company}'s information deleted`
        });
    } catch (e) {
        return res.status(500).send({
            error: e.message
        });
    }
});

module.exports = router;