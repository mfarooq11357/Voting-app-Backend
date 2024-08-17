// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');
// const {jwtAuthMiddleware, generateToken} = require('../jwt');
// const Candidate = require('../models/candidate');

const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../jwt');
const candidateController = require('../controllers/candidateController');

// POST route to add a candidate
router.post('/', jwtAuthMiddleware, candidateController.addCandidate);

// PUT route to update a candidate
router.put('/:candidateID', jwtAuthMiddleware, candidateController.updateCandidate);



// DELETE route to delete a candidate
router.delete('/:candidateID', jwtAuthMiddleware, candidateController.deleteCandidate);

// POST route to vote for a candidate
router.post('/vote/:candidateID', jwtAuthMiddleware, candidateController.voteCandidate);

// Public route - does not require token to get vote count
router.get('/votecount', candidateController.getVoteCount);

// GET route to get list of all candidates with only name and party fields
router.get('/', candidateController.getAllCandidates);

module.exports = router;






