const cassandra = require('cassandra-driver');
const executeConcurrent = cassandra.concurrent.executeConcurrent;
const csv = require('csv-parse');
const fs = require('fs');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
});

var syncHolder = [];
counter = 10;
var even = 3;
fs.createReadStream('./raw_data/characteristics.csv')
  .pipe(csv())
  .on('data', (row) => {
    //clean data
    let id = parseInt(row[0], 10);
    let product_id = parseInt(row[1], 10);
    let name = row[2];

    //push into my holder array
    if (counter >= 0) {
      console.log([product_id, name, id]);

      counter--;
    }
    if (row[0] !== 'id') {
      syncHolder.push([product_id, name, id]);
    }
    // even++;
  })
  .on('end', () => {
    dataPusher(syncHolder);
    console.log('CSV file successfully processed');
  });

async function dataPusher(entries) {
  await client.connect();
  await client.execute('USE reviews_container');

  try {
    var charQuery =
      'update reviews_container.chars_by_product_id SET product_id=?, name=? WHERE characteristic_id=?';

    await executeConcurrent(client, charQuery, entries);
    console.log('done!');
  } finally {
    await client.shutdown();
  }
}
