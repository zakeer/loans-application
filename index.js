const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db.js");

// Creating an express application
const app = express();

// Handling json body request 
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({
    status: true,
    message: "Loans API running successfull"
  });
});


// Get all loan applications
app.get('/loans', function (req, res) {

  db.serialize(() => {
    // const selectQuery = `SELECT loan_id, firstname, lastname, loan_amount, purpose, status from loans`
    const selectQuery = `SELECT * from loans`
    db.all(selectQuery, (error, rows) => {
      if (error) {
        res.json({
          status: false,
          error: error
        })
      } else {
        

        for(let i=0; i < rows.length; i++) {
          delete rows[i].email;
        }

        let index=0;
        while(index < rows.length) {
          delete rows[index].purpose;
          index++;
        }

        rows.forEach(singleRow => {
          delete singleRow.lastname;
        })

        res.json({
          status: true,
          loans: rows
        })
      }
    })
  })

});

// POST API for new loan application
app.post('/new-loan', function (req, res) {
  const loanData = req.body;

  // const firstName = loanData.firstName;
  // const lastName = loanData.lastName;
  // const amount = loanData.amount;
  // const purpose = loanData.purpose;
  // const email = loanData.email;

  // You can do same thing using destructing object
  const { firstName, lastName, amount, purpose, email } = loanData;

  if (!firstName) {
    // return res.status(400).json({
    //   status: false,
    //   error: 'Please provide firstname'
    // })
    return sendErrorResponse(res, 'Please provide firstname')
  }

  if (!lastName) {
    // return res.status(400).json({
    //   status: false,
    //   error: 'Please provide lastname'
    // })
    return sendErrorResponse(res, 'Please provide lastname')
  }

  if (!amount) {
    // return res.status(400).json({
    //   status: false,
    //   error: 'Please provide loan amount'
    // });
    return sendErrorResponse(res, 'Please provide loan amount')

  }

  if (!email) {
    return sendErrorResponse(res, 'Please provide email address')
  }

  if (!purpose) {
    return sendErrorResponse(res, 'Please define purpose of applying loan')
  }

  const insertSQL = `INSERT INTO loans (
    firstname,
    lastname,
    email,
    loan_amount,
    purpose
  ) VALUES (
    "${firstName}",
    "${lastName}",
    "${email}",
    "${amount}",
    "${purpose}"
  )`;

  db.serialize(() => {
    db.exec(insertSQL, (error) => {
      if (error) {
        res.status(400).json({
          status: false,
          error: error
        })
      } else {
        res.json({
          status: true,
          message: "New Loan application created...",
          // data: loanData,
          // sql: insertSQL
        });
      }
    })
  })
});

app.get('/loans/:id', function (req, res) {
  const loan_id = req.params.id;

  const sql = `SELECT * from loans WHERE loan_id=${loan_id};`;
  db.serialize(() => {
    // get(sql: string, callback?: (err: Error | null, row: any) => void): this;
    db.get(sql, (err, row) => {
      if (err || !row) {
        res
          .status(400)
          .json({
            status: false,
            error: `Unable to find loan with id: ${loan_id}`
          })
      } else {
        res.json({
          status: true,
          loan: row
        })
      }
    })
  })
})

app.post('/loans/:id', function (req, res) {
  const loan_id = req.params.id;
  const requestBody = req.body;
  const status = requestBody.status;

  const sql = `
    UPDATE loans
    SET status="${status}"
    WHERE loan_id=${loan_id}
  `;

  db.serialize(function() {
    db.exec(sql, (error) => {
      console.log(error)
      if(error) {
        res.status(400).json({
          status: false,
          sql,
          error: `Error while updating the loan for ID: ${loan_id}`
        })
      } else {
        res.json({
          status: true,
          message: "Loan Details updated..."
        })
      }
    })
  })
});

app.delete("/loans/:loanId", (req, res) => {
  const loan_id = req.params.loanId;
  const sql = `DELETE from loans WHERE loan_id=${loan_id}`;

  db.serialize(() => {
    db.exec(sql, (error) => {
      if(error) {
        return sendErrorResponse(res, "Can't delete the loan")
      } else {
        res.json({
          status: true,
          message: "Loan deleted..."
        })
      }
    })
  })

})


function sendErrorResponse(response, errorMessage) {
  return response.status(400).json({
    status: false,
    error: errorMessage
  });
}

app.listen(3000, function () {
  console.log(`API Services are running on http://localhost:3000`);
});