//set up db connection
const cassandra = require('cassandra-driver');
const TimeUuid = require('cassandra-driver').types.TimeUuid;

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
});

module.exports = {
  getReviews: function (req, res) {
    //shape the incoming request params
    const pageNum = req.query.page ? req.query.page : 1;
    const entriesPerPage = req.query.count ? req.query.count : 5;
    const product_id = req.query.product_id;
    var sortParam = 'id';
    if (req.query.sort === 'newest') {
      sortParam = 'date';
    } else if (req.query.sort === 'helpful') {
      sortParam = 'helpfulness';
    }
    //create database query
    const getReviewsQuery = `SELECT * FROM reviews_container.reviews_by_product_id WHERE product_id = ${product_id} ORDER BY ${sortParam} ASC;`;
    //query database
    client.execute(getReviewsQuery).then((resultsFromQuery) => {
      //shape response
      let resultsObj = {};
      resultsObj.product = req.query.product_id;
      resultsObj.page = pageNum;
      resultsObj.count = entriesPerPage;
      resultsObj.results = resultsFromQuery.rows;
      //send response
      res.send(resultsObj);
    });
  },
  getMetaData: function (req, res) {
    //define variables based on req inputs
    //query the database to get the reviews
    ////crunch the numbers to get the ratings
    //query the characteristics table to get that info
    //combine the two into an object
    //send back the object
  },
  postReview: function (req, res) {
    //shape params for query

    const id = TimeUuid.now();
    const body = req.body.body;
    const date = new Date();
    const helpfulness = 0;
    const photos = [];
    for (
      let photoIndex = 0;
      photoIndex < req.body.photos.length;
      photoIndex++
    ) {
      const photoId = TimeUuid.now();
      let tempPhotoObj = { id: photoId, url: photoIndex };
      photos.push(tempPhotoObj);
    }
    const finalPhotos = JSON.stringify(photos);
    const product_id = req.params.product_id;
    const rating = req.body.rating;
    const recommend = req.body.recommend;
    const reported = false;
    const response = 0;
    const reviewer_email = req.body.email;
    const reviewer_name = req.body.name;
    const summary = req.body.summary;
    //craft query
    const postQuery = `INSERT INTO reviews_container.reviews_by_product_id(id,body,date,helpfulness,photos,product_id,rating,recommend,reported,response,reviewer_email,reviewer_name,summary) VALUES (${id},${body},${date},${helpfulness},${finalPhotos},${product_id},${rating},${recommend},${reported},${response},${reviewer_email},${reviewer_name},${summary})`;
    //craft chars query
    //create the variables
    //create array for each characteristic in query
    //insert all of those into the database

    const charQuery = console.log('postQuery', postQuery);
    client.execute(postQuery).then(() => {
      //send response
      client.execute(charQuery).then(() => {
        res.send(200);
      });
    });
  },
  helpfulReview: function (req, res) {
    res.send('it worked');
    //update the row based on the req data
  },
  reportReview: function (req, res) {
    //update the row based on the req data
    res.send('it worked');
  },
};
