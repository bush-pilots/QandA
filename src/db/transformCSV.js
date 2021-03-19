import fs from 'fs';
import path from 'path';

import readline from 'readline-promise';
import User from '../models/User';
import Question from '../models/Question';
import query from '.';

const csv = require('fast-csv');

const stream = fs.createReadStream(path.resolve(__dirname, 'csvData', 'questions.csv'));
const csvData = [];
const csvStream = csv
  .parse()
  .on('data', (data) => {
    csvData.push(data);
  })
  .on('end', (data) => {
    csvData.shift();

    csvData.forEach((row) => {
      User.queryAddUser([row[4], row[5]])
        .catch((err) => console.log(err.detail))
        .then(() => User.queryGetUser(row[4]))
        .then((rows) => rows[0].id)
        .then((id) => {
          const question = {
            id: Number(row[0]),
            body: row[2],
            reported: row[6] ? 'true' : 'false',
            helpfulness: Number(row[7]),
            usernameId: Number(id),
            productId: Number(row[1]),
            createdAt: row[3],
          };
          return Question.queryAddQuestion(question);
        })
        .then((rows) => console.log(rows))

      // User.queryGetUser(row[4])
      //   .then((rows) => rows[0].id)
      //   .then((id) => console.log(id));
    });
  });
stream.pipe(csvStream);
// const questionsCSV = readline.createInterface({
//   input: fs.createReadStream(path.resolve(__dirname, 'csvData', 'questions.csv')),
//   output: process.stdout,
//   terminal: false,
// });

// exports.readQuestions = async () => {
//   let headers = [];
//   let row = {};

//   const addAllQuestions = async (row) => {
//     User.queryGetUser(row.asker_name)
//       .then(([{ id }]) => id)
//       .then((id) => {
//         const question = {
//           id: row.id,
//           body: row.body,
//           reported: row.reported,
//           helpfulness: row.helpful,
//           usernameId: id,
//           productId: row.product_id,
//           createdAt: row.date_written,
//         };
//         return question;
//       })
//       .then((question) => Question.queryAddQuestion(question))
//       .catch((err) => console.log(err.detail));
//   };

//   questionsCSV.forEach((line, index) => {
//     if (index === 0) {
//       headers = line.split(', ').map((header) => header);
//       return;
//     }

//     row = line
//       .split(',')
//       .reduce((acc, value, idx) => {
//         if (Number(value)) {
//           return { ...acc, [headers[idx]]: Number(value) };
//         }
//         if (headers[idx] === 'reported') {
//           return { ...acc, [headers[idx]]: Boolean(value) };
//         }
//         return { ...acc, [headers[idx]]: value.slice(1, -1) };
//       }, {});

//     User.queryAddUser({ username: row.asker_name, email: row.asker_email })
//       .catch((err) => console.log(err.detail))
//   });
// };

// questionsCSV.on('line', (line) => {
//   counter += 1;
//   if (counter === 1) {
//     headers = line.split(', ');
//   } else {
//     const data = line.split(',');
//     row = headers.reduce((acc, header, index) => {
//       if (header === 'id' || header === 'product_id' || header === 'helpful') {
//         return { ...acc, [header]: Number(data[index]) };
//       }

//       if (header === 'reported') {
//         return { ...acc, [header]: Boolean(data[index]) };
//       }

//       return { ...acc, [header]: data[index].slice(1, -1) };
//     }, {});

//     const user = {
//       username: row.asker_name,
//       email: row.asker_email,
//     };

//     User.queryAddUser(user)
//       .then((response) => console.log('I inserted this user: ', response))
//       .catch((err) => console.log(err.detail));

//     User.queryGetUser(user.username)
//       .then(([{ id }]) => {
//         const question = {
//           id: row.id,
//           body: row.body,
//           reported: row.reported,
//           helpfulness: row.helpful,
//           usernameId: id,
//           productId: row.product_id,
//           createdAt: row.date_written,
//         };
//         Question.queryAddQuestion(question)
//           .then((response) => console.log(response))
//           .catch((err) => console.log(err));
//       });
//   }
// });

// exports.readQuestions();
