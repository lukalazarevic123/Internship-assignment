const { Router } = require('express');

const router = Router();

const registerController = require('../controller/registerController');
const voteController = require('../controller/voteController');
const blockchainController = require('../controller/blockchainController');


router.route('/register').post(registerController.register);
router.route('/vote').post(voteController.regularVote);
router.route('/winning-candidates').get(blockchainController.winningCandidates);


module.exports = router;