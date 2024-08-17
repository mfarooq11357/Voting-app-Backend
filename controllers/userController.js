const User = require('./../models/user');
const { generateToken } = require('./../jwt');

const signup = async (req, res) => {
    try {
        const data = req.body;

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate ID Card Number must have exactly 12 digits
        if (!/^\d{13}$/.test(data.IDCardNumber)) {
            return res.status(400).json({ error: 'ID Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same ID Card Number already exists
        const existingUser1 = await User.findOne({ IDCardNumber: data.IDCardNumber });
        if (existingUser1) {
            return res.status(400).json({ error: 'User with the same ID Card Number already exists' });
        }
        const existingUser2 = await User.findOne({ email: data.email });
        if (existingUser2) {
            return res.status(400).json({ error: 'User with the same email already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        //  console.log('data saved');

        const payload = { id: response.id };
        const token = generateToken(payload);

        res.status(200).json({ response, token });
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const login = async (req, res) => {
    try {
        // Validate request body
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // Validate user and password
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Email or Password' });
        }

        // Generate token
        const payload = { id: user.id };
        const token = generateToken(payload);

        // Send token as response
        return res.json({ token, role: user.role });
    } catch (err) {
        // Log error and send 500 status
        // console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-role -password');;
        res.status(200).json({ user });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();

        // console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    signup,
    login,
    getProfile,
    updatePassword
};
