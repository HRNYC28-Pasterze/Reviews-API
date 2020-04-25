const cassandra = require('cassandra-driver');
const executeConcurrent = cassandra.concurrent.executeConcurrent;
const csv = require('csv-parse');
const fs = require('fs');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
});

// client.connect(function (err) {
//   console.log(err);
// });

//have to specify keyspace
// client.execute(query).then((result) => {
//   const row = result.first();

//   // The row is an Object with column names as property keys.
//   console.log(row);
// });

// const stream = csvStream.pipe(transformLineToArrayStream);
// const result = await executeConcurrent(client, query, stream);

var syncHolder = [];
counter = 2;
fs.createReadStream('./raw_data/reviews_photos.csv')
  .pipe(csv())
  .on('data', (row) => {
    //clean data
    let review_id = parseInt(row[1], 10);
    let photo_id = parseInt(row[0], 10);
    let newPhotoObj = [{ id: photo_id, url: row[2] }];
    //push into my holder array
    if (counter >= 0) {
      console.log(syncHolder);
      counter--;
    }
    if (row[0] !== 'id') {
      syncHolder.push([newPhotoObj, review_id]);
    }
  })
  .on('end', () => {
    dataPusher(syncHolder);
    console.log('CSV file successfully processed');
  });

async function dataPusher(entries) {
  await client.connect();
  await client.execute('USE reviews_container');

  try {
    var photoQuery =
      'update reviews_container.reviews_by_product_id set photos = photos + ? where id=?';

    await executeConcurrent(client, photoQuery, entries);
    console.log('done!');
  } finally {
    await client.shutdown();
  }
}
