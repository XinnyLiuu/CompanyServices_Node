'use strict';
/**
 * Business Layer logic for all company related routes
 */
const DataLayer = require("../companydata");
const COMPANY_NAME = "xl4998";
const dl = new DataLayer(COMPANY_NAME);

/**
 * Deletes all values in company
 */
exports.deleteCompany = (query) => {
    // Check for fields
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME) {

        // Delete all tables in company
        const affected = dl.deleteCompany(COMPANY_NAME);
        
        if(affected === 0) throw new Error("There has been an error deleting all the tables in the company!");
        else return affected;
    }

    throw new Error("Invalid query parameters!");
}