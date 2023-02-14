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
    db.all(`SELECT * from loans`, (error, rows) => {
      if (error) {
        res.json({
          status: false,
          error: error
        })
      } else {
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


  res.json({
    status: true,
    message: "New Loan application created...",
    data: loanData
  });
});


function sendErrorResponse(response, errorMessage) {
  return response.status(400).json({
    status: false,
    error: errorMessage
  });
}

app.listen(3000, function () {
  console.log(`API Services are running on http://localhost:3000`);
});