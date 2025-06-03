const db = require('../database/config');

/**
 * Execute a stored procedure with parameters
 * @param {string} procedureName - Name of the stored procedure
 * @param {Array} params - Array of parameters
 * @returns {Promise} - Query result
 */
async function executeStoredProcedure(procedureName, params = []) {
    try {
        let query;
        let replacements = [];

        if (params.length > 0) {
            // Create placeholders for parameters
            const placeholders = params.map(() => '?').join(', ');
            query = `CALL ${procedureName}(${placeholders})`;
            replacements = params;
        } else {
            // No parameters, just call the procedure
            query = `CALL ${procedureName}()`;
        }

        console.log('Executing stored procedure:', query);
        console.log('With parameters:', replacements);

        // Execute the stored procedure
        const [results, metadata] = await db.sequelize.query(query, {
            replacements,
            type: db.sequelize.QueryTypes.RAW,
            raw: true,
            multipleStatements: true
        });

        console.log('Raw results from stored procedure:', JSON.stringify(results, null, 2));
        console.log('Metadata:', JSON.stringify(metadata, null, 2));

        // For sp_get_all_employees, we need to handle multiple result sets
        if (procedureName === 'sp_get_all_employees') {
            // Return the first result set which contains the employee data
            return results;
        }

        // For other procedures, return the results as is
        return results;
    } catch (error) {
        console.error('Error executing stored procedure:', error);
        throw error;
    }
}

/**
 * Execute a raw SQL query
 * @param {string} query - SQL query string
 * @param {Array} params - Array of query parameters
 * @returns {Promise} - Query result
 */
async function executeQuery(query, params = []) {
    try {
        const [results] = await db.sequelize.query(query, {
            replacements: params,
            type: db.sequelize.QueryTypes.SELECT
        });
        return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

module.exports = {
    executeStoredProcedure,
    executeQuery
}; 