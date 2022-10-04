const db = require('..');

const tableExists = (table) => {
  const statement = `
    SELECT EXISTS (
        SELECT 
            TABLE_NAME
        FROM 
            family_tracker.TABLES 
        WHERE 
            TABLE_NAME = ${table}
        );
    `;

  db.query(statement, (e, r) => {
    if (e) throw e;
    console.log('CHECK', r);
    return r;
  });
};

const createTable = (table, columns) => `CREATE TABLE IF NOT EXISTS ${table} (${columns});`;

module.exports = { tableExists, createTable };