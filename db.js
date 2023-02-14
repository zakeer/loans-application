const sqlite3 = require("sqlite3").verbose();

// To connect database we need to open connection
const db = new sqlite3.Database("./loans.db", sqlite3.OPEN_READWRITE, (error) => {
  if (error) {
    console.log("Unable to connect DB")
  } else {
    console.log("DB Connected...")
  }
});

module.exports = db;


// db.serialize(function() {
//   // Get all applications from the loans table
//   // SELECT * from loans;
//   db.each(`SELECT * from loans`, (error, dbRow) => {
//     console.log(":: ERROR ::", error);
//     console.log(":: DB ROW ::", dbRow);
//   })

//   db.all(`SELECT * from loans`, function(error, rows) {
//     console.log("All ROWS", rows);
//   })
// })

