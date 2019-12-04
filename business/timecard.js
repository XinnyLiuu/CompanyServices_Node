'use strict';
const moment = require("moment");

/**
 * Business Layer logic for all employee related routes
 */
const DataLayer = require("../companydata");
const COMPANY_NAME = "xl4998";
const dl = new DataLayer(COMPANY_NAME);

/**
 * Check if the employee exists
 * 
 * @param {*} emp_id 
 */
function isExistingEmployee(emp_id) {
    const e = dl.getEmployee(emp_id);

    if (e === null) throw new Error(`Employee with id ${emp_id} does not exist!`);
}

/**
 * Check if the timecard exists
 * 
 * @param {*} company 
 * @param {*} timecard_id 
 */
function isExistingTimecard(timecard_id) {
    const t = dl.getTimecard(timecard_id);

    if (t === null) throw new Error(`Timecard with id ${timecard_id} does not exist!`);
}

/**
 * Validate the start and end times 
 * 
 * Start time must be valid date and time equal to the current date or back to the Monday prior to the current date if the current date is not a monday
 * 
 * End time must be valid date and time at least 1 hour greater than the start time and be on the same day as the start time
 * 
 * Start and end time must be M T W TH F 
 * 
 * Start and end time must be in 24 hour format between 6:00:00 and 18:00:00 inclusive
 * 
 * Start time must not be on same date as any of that employee's start times
 * 
 * @param {*} start 
 * @param {*} end 
 * @param {*} emp_id
 */
function isValidDates(start, end, emp_id) {
    // Format the dates to be YYYY-MM-DD hh:mm:ss
    const s = moment(start, "YYYY-MM-DD hh:mm:ss");
    const e = moment(end, "YYYY-MM-DD hh:mm:ss");

    // Check the validity of the two dates
    if (!(s.isValid() && e.isValid())) throw new Error("The specified times are not valid! Please enter in YYYY-MM-DD hh:mm:ss format!");

    // Check if the dates are on weekends
    if (s.day() === 0 || s.day() === 6) throw new Error("The start time is on a weekend!");

    if (e.day() === 0 || e.day() === 6) throw new Error("The end time is on a weekend!");

    // Check if the times are between in 24 hour format between 6:00:00 and 18:00:00 inclusively
    if (!(s.hour() >= 6 && s.hour() <= 18)) throw new Error("The start time is not between the hours of 6:00:00 and 18:00:00!");

    if (!(e.hour() >= 6 && e.hour() <= 18)) throw new Error("The end time is not between the hours of 6:00:00 and 18:00:)0!");

    // Check to make sure that the start time is unique to that employee
    dl.getAllTimecard(emp_id).forEach(t => {

        // Convert the old timestamp to a moment object
        const old_s = moment(t.getStartTime(), "YYYY-MM-DD hh:mm:ss");

        if (old_s.isSame(s, 'year') &&
            old_s.isSame(s, 'month') &&
            old_s.isSame(s, 'day')) throw new Error("The start time has already for recorded for that date!");
    });

    // Ensure the start time is between now to the prior monday
    const current = moment();
    const priorMonday = moment().day(1);
    priorMonday.set({ // Set priorMonday to 12 AM to indicate start of day
        'hour': 0,
        'minute': 0,
        'second': 0,
        'millisecond': 0
    });

    if (!(s.isSameOrBefore(current) &&
            s.isSameOrAfter(priorMonday))) throw new Error("The start time is not within the allowed range!");

    // Ensure that the end time is on the same date as start time
    if (!(s.isSame(e, 'year') &&
            s.isSame(e, 'month') &&
            s.isSame(e, 'day'))) throw new Error("The start time and end times are not on the same date!");

    // Ensure that the end time is at least one hour greater than the start time
    if (!(e.isSameOrAfter(s.add(1, 'hours')))) throw new Error("The end time is not at least one hour greater than the start time!");
}

/**
 * Gets the specified timecard
 */
exports.getTimecard = (query) => {
    // Check for company and check for if the timecard exists
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("timecard_id")) {

        // Get timecard
        const t = dl.getTimecard(query.timecard_id);

        if (t === null) throw new Error(`Timecard with id ${query.timecard_id} does not exist!`);

        return t;
    }

    throw new Error("Invalid query parameters!");
};

/**
 * Retrieves the list of timecards
 */
exports.getTimecards = (query) => {
    // Check for company
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("emp_id")) {

        // Check if employee exists
        const e = dl.getEmployee(query.emp_id);

        if (e === null) throw new Error(`Employee with id ${query.emp_id} does not exist!`);

        // Get timecards
        const arr = dl.getAllTimecard(query.emp_id);

        if (arr.length === 0) throw new Error(`There are no timecards for the employee with id ${query.emp_id}!`);

        return arr;
    }

    throw new Error("Invalid query parameters!");
};


/**
 * Creates a timecard based on information passed into the body
 */
exports.createTimecard = (body) => {
    body = JSON.parse(JSON.stringify(body)); // x-www-form-urlencoded data does not inherit from the typical JavaScript object

    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("emp_id") &&
        body.hasOwnProperty("start_time") &&
        body.hasOwnProperty("end_time")) {

        // Check that the employee exists
        isExistingEmployee(body.emp_id);

        // Check dates
        isValidDates(body.start_time, body.end_time, body.emp_id);

        // Create timecard
        let t = new dl.Timecard(
            moment(body.start_time).format("YYYY-MM-DD hh:mm:ss"),
            moment(body.end_time).format("YYYY-MM-DD hh:mm:ss"),
            body.emp_id
        );

        t = dl.insertTimecard(t);

        return t;
    }

    throw new Error("Invalid body parameters!");
}


/**
 * Updates a timecard based on information passed into the body
 */
exports.updateTimecard = (body) => {
    // Check for fields
    if (body.hasOwnProperty("company") &&
        body.company === COMPANY_NAME &&
        body.hasOwnProperty("timecard_id") &&
        body.hasOwnProperty("emp_id") &&
        body.hasOwnProperty("start_time") &&
        body.hasOwnProperty("end_time")) {

        // Check that the specified timecard exists
        isExistingTimecard(body.timecard_id);

        // Check that the employee exists
        isExistingEmployee(body.emp_id);

        // Check dates
        isValidDates(body.start_time, body.end_time, body.emp_id);

        // Update timecard
        let t = dl.getTimecard(body.timecard_id);

        t.setEmpId(body.emp_id);
        t.setStartTime(body.start_time);
        t.setEndTime(body.end_time);

        t = dl.updateTimecard(t);

        return t;
    }

    throw new Error("Invalid body parameters!");
}


/**
 * Deletes the specified timecard
 */
exports.deleteTimecard = (query) => {
    // Check for fields
    if (query.hasOwnProperty("company") &&
        query.company === COMPANY_NAME &&
        query.hasOwnProperty("timecard_id")) {

        // Check if timecard exists
        isExistingTimecard(query.timecard_id);

        // Delete the timecard
        const affected = dl.deleteTimecard(query.timecard_id);
        if (affected === 0) throw new Error(`Could not delete timecard!`);

        return affected;
    }

    throw new Error("Invalid query parameters!");
}