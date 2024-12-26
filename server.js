const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const JWT_SECRET ="450a720a7f5274394d3972e9ccb95a8f40e671a1b6ccd6593209e89fa8658ea41ff646d096c2cf1173b981c428dd485b783a5a984663252c9c2b76f8cbfe224b";

app.use(bodyParser.json());
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'janhavi',
    password: 'janhavi@31',
    database: 'equip9',
    port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, mobileNumber, password } = req.body;
    console.log('Request received:', req.body);

    if (!firstName || !lastName || !mobileNumber || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const sqlCheckUser = `SELECT * FROM users WHERE mobile_number = ?`;
    db.query(sqlCheckUser, [mobileNumber], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error.' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Mobile number already registered. Please login.' });
        }
    

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (first_name, last_name, mobile_number, password) VALUES (?, ?, ?, ?)`;
        db.query(sql, [firstName, lastName, mobileNumber, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Registration failed. Please try again.' });
            }
            console.log('User registered successfully:', result);
            res.status(200).json({ message: 'Registration successful!' });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});
});


app.get('/api/user/:id', (req, res) => {
    const sql = `CALL select_user(?)`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

app.put('/api/user/:id', (req, res) => {
    const { firstName, lastName, mobileNumber } = req.body;
    const sql = `CALL update_user(?, ?, ?, ?, ?)`;
    db.query(sql, [req.params.id, firstName, lastName, mobileNumber, 'system'], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('User Updated Successfully!');
    });
});

app.delete('/api/user/:id', (req, res) => {
    const sql = `CALL delete_user(?)`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('User Deleted Successfully!');
    });
});

app.post('/api/login', (req, res) => {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Mobile number and password are required.' });
    }

    const sql = `SELECT * FROM users WHERE mobile_number = ?`;
    db.query(sql, [mobileNumber], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid mobile number or password.' });
        }

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid mobile number or password.' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful!',
            token,
            firstName: user.first_name,
            lastName: user.last_name,
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));