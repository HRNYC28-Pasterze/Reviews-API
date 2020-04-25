var router = require('express').Router();
var controller = require('./controller');

// Create route handlers for each of the 5 methods for reviews

router.get('/reviews/list', controller.getReviews);
router.get('/reviews/:product_id/meta', controller.getMetaData);
router.post('/reviews/:product_id', controller.postReview);
router.put('/reviews/helpful/:review_id', controller.helpfulReview);
router.put('/reviews/report/:review_id', controller.reportReview);

module.exports = router;
