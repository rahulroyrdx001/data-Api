// // import-data.js
// const csv = require('csv-parser');
// const fs = require('fs');
// const mongoose = require('mongoose');

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/fletnix', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // Show Model (same as in app.js)
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

// const Show = mongoose.model('Show', showSchema);

// // Import function
// async function importData() {
//     try {
//         // Clear existing data
//         await Show.deleteMany({});
//         console.log('Cleared existing data');

//         const results = [];

//         // Read CSV and process data
//         fs.createReadStream('netflix_data.csv')
//             .pipe(csv())
//             .on('data', (data) => results.push(data))
//             .on('end', async () => {
//                 try {
//                     await Show.insertMany(results);
//                     console.log(`Successfully imported ${results.length} shows`);

//                     // Create indexes
//                     await Show.collection.createIndex({ title: 'text', cast: 'text' });
//                     await Show.collection.createIndex({ type: 1 });
//                     await Show.collection.createIndex({ rating: 1 });

//                     console.log('Created indexes');
//                     mongoose.connection.close();
//                 } catch (error) {
//                     console.error('Error importing data:', error);
//                     mongoose.connection.close();
//                 }
//             });
//     } catch (error) {
//         console.error('Error:', error);
//         mongoose.connection.close();
//     }
// }

// importData();

const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rroyedutech:jnEJRVGz9bf7r3Js@test-pro.igjon.mongodb.net/?retryWrites=true&w=majority&appName=Test-pro';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

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

// Import function
async function importData() {
    try {
        // Clear existing data
        await Show.deleteMany({});
        console.log('Cleared existing data');

        const results = [];

        // Read CSV and process data
        fs.createReadStream('netflix.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    await Show.insertMany(results);
                    console.log(`Successfully imported ${results.length} shows`);

                    // Create indexes
                    await Show.collection.createIndex({ title: 'text', cast: 'text' });
                    await Show.collection.createIndex({ type: 1 });
                    await Show.collection.createIndex({ rating: 1 });

                    console.log('Created indexes');
                    mongoose.connection.close();
                } catch (error) {
                    console.error('Error importing data:', error);
                    mongoose.connection.close();
                }
            });
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

importData();
