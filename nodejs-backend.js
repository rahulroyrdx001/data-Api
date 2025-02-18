// // app.js
// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/fletnix', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // Models
// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     age: { type: Number, required: true }
// });

// const showSchema = new mongoose.Schema({
//     show_id: { type: String, required: true, unique: true },
//     type: String,
//     title: String,
//     director: String,
//     cast: String,
//     country: String,
//     date_added: String,
//     release_year: Number,
//     rating: String,
//     duration: String,
//     listed_in: String,
//     description: String
// });

// const User = mongoose.model('User', userSchema);
// const Show = mongoose.model('Show', showSchema);

// // Authentication Middleware
// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) {
//             throw new Error();
//         }

//         const decoded = jwt.verify(token, 'your-secret-key');
//         const user = await User.findOne({ email: decoded.email });

//         if (!user) {
//             throw new Error();
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };

// // Routes
// // Register
// app.post('/register', async (req, res) => {
//     try {
//         const { email, password, age } = req.body;
        
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).send({ error: 'Email already registered' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({
//             email,
//             password: hashedPassword,
//             age
//         });

//         await user.save();
//         res.status(201).send({ message: 'User created successfully' });
//     } catch (error) {
//         res.status(400).send({ error: error.message });
//     }
// });

// // Login
// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).send({ error: 'Invalid credentials' });
//         }

//         const token = jwt.sign(
//             { email: user.email, age: user.age },
//             'your-secret-key',
//             { expiresIn: '24h' }
//         );

//         res.send({ token });
//     } catch (error) {
//         res.status(400).send({ error: error.message });
//     }
// });

// // Get Shows with Pagination, Search, and Filters
// app.get('/shows', authMiddleware, async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 15;
//         const skip = (page - 1) * limit;

//         let query = {};

//         // Type filter
//         if (req.query.type) {
//             query.type = req.query.type;
//         }

//         // Search by title or cast
//         if (req.query.search) {
//             query.$or = [
//                 { title: new RegExp(req.query.search, 'i') },
//                 { cast: new RegExp(req.query.search, 'i') }
//             ];
//         }

//         // Age restriction
//         if (req.user.age < 18) {
//             query.rating = { $ne: 'R' };
//         }

//         const total = await Show.countDocuments(query);
//         const shows = await Show.find(query)
//             .skip(skip)
//             .limit(limit);

//         res.send({
//             shows,
//             total,
//             pages: Math.ceil(total / limit)
//         });
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

// // Get Show Details
// app.get('/shows/:id', authMiddleware, async (req, res) => {
//     try {
//         const show = await Show.findOne({ show_id: req.params.id });
//         if (!show) {
//             return res.status(404).send({ error: 'Show not found' });
//         }
//         res.send(show);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGO_URI = 'mongodb+srv://rroyedutech:jnEJRVGz9bf7r3Js@test-pro.igjon.mongodb.net/?retryWrites=true&w=majority&appName=Test-pro';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Show Model
const showSchema = new mongoose.Schema({
    show_id: { type: String, required: true, unique: true },
    type: String,
    title: String,
    director: String,
    cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: String,
    description: String
});

const Show = mongoose.model('Show', showSchema);

// Get Shows with Pagination, Search, and Filters
app.get('/shows', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;

        let query = {};

        // Type filter
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Search by title or cast
        if (req.query.search) {
            query.$or = [
                { title: new RegExp(req.query.search, 'i') },
                { cast: new RegExp(req.query.search, 'i') }
            ];
        }

        const total = await Show.countDocuments(query);
        const shows = await Show.find(query).skip(skip).limit(limit);

        res.send({
            shows,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get Show Details
app.get('/shows/:id', async (req, res) => {
    try {
        const show = await Show.findOne({ show_id: req.params.id });
        if (!show) {
            return res.status(404).send({ error: 'Show not found' });
        }
        res.send(show);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
