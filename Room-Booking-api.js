const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

const rooms = [];
const bookings = [];

// Task 1: Create a Room
app.post('/createRoom', (req, res) => {
    const { roomName, seats, amenities, pricePerHour } = req.body;

    const newRoom = {
        roomName,
        seats,
        amenities,
        pricePerHour,
        bookings: []
    };

    rooms.push(newRoom);

    res.status(201).json({ message: 'Room created successfully', room: newRoom });
});

// Task 2: Book a Room
app.post('/bookRoom', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    const room = rooms.find(room => room.roomName === roomId);

    if (!room) {
        res.status(404).send('Room not found');
        return;
    }

    const newBooking = {
        customerName,
        date,
        startTime,
        endTime,
        bookingId: bookings.length + 1,
        bookingDate: new Date(),
        bookingStatus: 'Booked'
    };

    room.bookings.push(newBooking);
    bookings.push(newBooking);

    res.status(201).json({ message: 'Room booked successfully', booking: newBooking });
});

// Task 3: List all Rooms with Booked Data
app.get('/listRooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookedData = room.bookings.map(booking => ({
            roomName: room.roomName,
            bookedStatus: booking.bookingStatus,
            customerName: booking.customerName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        }));

        return { roomName: room.roomName, bookedData };
    });

    res.json(roomsWithBookings);
});

// Task 4: List all Customers with Booked Data
app.get('/listCustomers', (req, res) => {
    const customersWithBookings = bookings.map(booking => ({
        customerName: booking.customerName,
        roomName: booking.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
    }));

    res.json(customersWithBookings);
});

// Task 5: List how many times a customer has booked the room
app.get('/customerBookingCount/:customerName', (req, res) => {
    const customerName = req.params.customerName;

    const customerBookingCount = bookings.filter(booking => booking.customerName === customerName).length;

    res.json({ customerName, bookingCount: customerBookingCount });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
