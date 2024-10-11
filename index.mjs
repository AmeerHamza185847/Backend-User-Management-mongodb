import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';

const PORT = 8000;
const app = express();

app.use(cors());

// middleware for JSON
app.use(express.json());

// MongoDB connection string (replace <your_connection_string> with your own)
const mongoUri = 'mongodb://localhost:27017/user_management';

// connect to mongoDb database
mongoose.connect(mongoUri, {
}).then(() => {
    console.log("successfully connected to mongoDb");
}).catch((err) => {
    console.log('error connecting to database', err.message);
});

// create and define a user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
});

// create User model
const User = mongoose.model('User', userSchema);


// fetching all users GET request
app.get('/api/users', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(201).json({ message: "All users successfully fetched!", allUsers: allUsers });
    } catch (error) {
        console.error("Error in fetching users ", error.message);
    }
})

// adding new users POST request
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age })
        await newUser.save();
        res.status(201).json({ message: "User added successfully!", newUser: newUser });
    } catch (error) {
        console.log("Error adding user ", error.message);
    }
})

// updating a user PUT request
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        )
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: "User updated successfully!", updatedUser: updatedUser });

    } catch (error) {
        console.error("Error updating user ", error.message);
    }
})

// Deleting user DELETE request
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletesdUser = await User.findByIdAndDelete(req.params.id);
        if (!deletesdUser) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        else {
            res.status(200).json({ message: "User deleted successfully!", deletesdUser: deletesdUser });
        }
    } catch (error) {
        console.error("Error deleting user ", error.message);
    }
})

app.listen(PORT, (req, res) => {
    console.log(`Server is listening at PORT ${PORT}`);
})