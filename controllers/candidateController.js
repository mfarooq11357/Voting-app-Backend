const User = require('../models/user');
const Candidate = require('../models/candidate');

const checkAdminRole = async (userID) => {  
    try {
        const user = await User.findById(userID);
        if (user.role === 'admin') {
            return true;
        }
    } catch (err) {
        return false;
    }
}

const addCandidate = async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id)))
            return res.status(403).json({ message: 'user does not have admin role' });

        const data = req.body; // Assuming the request body contains the candidate data

        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        // console.log('data saved');
        res.status(200).json({ response: response });
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateCandidate = async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id))
            return res.status(403).json({ message: 'user does not have admin role' });

        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // console.log('candidate data updated');
        res.status(200).json(response);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteCandidate = async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id))
            return res.status(403).json({ message: 'user does not have admin role' });

        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // console.log('candidate deleted');
        res.status(200).json(response);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const voteCandidate = async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        if (user.role == 'admin') {
            return res.status(403).json({ message: 'admin is not allowed' });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        // console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getVoteCount = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });

        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            };
        });

        return res.status(200).json(voteRecord);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({});

        res.status(200).json(candidates);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    addCandidate,
    updateCandidate,
    deleteCandidate,
    voteCandidate,
    getVoteCount,
    getAllCandidates
}