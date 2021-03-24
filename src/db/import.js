const fs = require('fs');
const csv = require('csv-stream');
const through2 = require('through2');
const path = require('path');
const Queries = require('../models/Import');

const stream = fs.createReadStream(path.resolve(__dirname, 'csv', 'questions.csv'))
  .pipe(csv.createStream({
    endLine: '\n',
    columns: ['id', 'product_id', 'body', 'created_at', 'reported', 'helpfulness'],
    escapeChar: '"',
    enclosedChar: '"',
  }))
  .pipe(through2.obj((row, enc, cb) => {
    Queries.queryImportQuestion(row)
      .then(() => cb(null, true))
      .catch((error) => cb(error, null));
  }))
  .on('data', (data) => console.log('saved a row'))
  .on('end', () => console.log('end'))
  .on('error', (error) => console.error(error));