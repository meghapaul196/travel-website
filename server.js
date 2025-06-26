const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Import the CORS package
const app = express();
const PORT = 5500;

app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Allow requests from your frontend
    methods: ['GET', 'POST'],  // Allow specific methods
    allowedHeaders: ['Content-Type'],  // Allow specific headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const bookingsFile = path.join(__dirname, 'bookings.json');

// Load existing bookings
function loadBookings() {
    if (!fs.existsSync(bookingsFile)) {
        fs.writeFileSync(bookingsFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(bookingsFile));
}

// Save new booking
function saveBooking(newBooking) {
    const bookings = loadBookings();
    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

// Get all bookings
app.get('/api/bookings', (req, res) => {
    res.json(loadBookings());
});

// Add a new booking
app.post('/api/bookings', (req, res) => {
    const { name, email, date, message, city } = req.body;
    if (!name || !email || !date || !message || !city) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newBooking = { name, email, date, message, city };
    saveBooking(newBooking);
    res.json({ message: 'Booking successful!', booking: newBooking });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
