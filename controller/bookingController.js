const pool = require('../DB/connectDb');

const getSeatAvailability=async(req,res)=>{
    try {
      const { source, destination } = req.body;
  
      // Validate the input
      if (!source || !destination) {
        return res.status(400).send({ error: 'Source and destination are required' });
      }
  
      // Find the source and destination stations
      const sourceResult = await pool.query('SELECT * FROM stations WHERE name = $1', [source]);
      const destinationResult = await pool.query('SELECT * FROM stations WHERE name = $1', [destination]);
  
      if (sourceResult.rows.length === 0 || destinationResult.rows.length === 0) {
        return res.status(404).send({ error: 'Source or destination station not found' });
      }
  
      const sourceStation = sourceResult.rows[0];
      const destinationStation = destinationResult.rows[0];
  
      // Get trains that have both source and destination in their routes in correct order
      const trainsResult = await pool.query(`
        SELECT t.*, tr1.stop_order as source_order, tr2.stop_order as destination_order
        FROM trains t
        JOIN train_routes tr1 ON t.id = tr1.train_id
        JOIN train_routes tr2 ON t.id = tr2.train_id
        WHERE tr1.station_id = $1 AND tr2.station_id = $2 AND tr1.stop_order < tr2.stop_order
      `, [sourceStation.id, destinationStation.id]);
  
      res.send({ trains: trainsResult.rows });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
}


const bookSeat=async(req,res)=>{
    try {
        const { train_id, source, destination } = req.body;
        const user_id = req.user.id;
    
        // Validate the input
        if (!train_id || !source || !destination) {
          return res.status(400).send({ error: 'All fields are required' });
        }
    
        // Find the source and destination stations
        const sourceResult = await pool.query('SELECT * FROM stations WHERE name = $1', [source]);
        const destinationResult = await pool.query('SELECT * FROM stations WHERE name = $1', [destination]);
    
        if (sourceResult.rows.length === 0 || destinationResult.rows.length === 0) {
          return res.status(404).send({ error: 'Source or destination station not found' });
        }
    
        const sourceStation = sourceResult.rows[0];
        const destinationStation = destinationResult.rows[0];
    
        // Check if the train has available seats
        const trainResult = await pool.query('SELECT * FROM trains WHERE id = $1', [train_id]);
        const train = trainResult.rows[0];
    
        if (!train) {
          return res.status(404).send({ error: 'Train not found' });
        }
    
        if (train.available_seats <= 0) {
          return res.status(400).send({ error: 'No available seats' });
        }
    
        // Check if the train has both source and destination in its route in correct order
        const routeResult = await pool.query(`
          SELECT tr1.stop_order as source_order, tr2.stop_order as destination_order
          FROM train_routes tr1
          JOIN train_routes tr2 ON tr1.train_id = tr2.train_id
          WHERE tr1.train_id = $1 AND tr1.station_id = $2 AND tr2.station_id = $3 AND tr1.stop_order < tr2.stop_order
        `, [train_id, sourceStation.id, destinationStation.id]);
    
        if (routeResult.rows.length === 0) {
          return res.status(400).send({ error: 'Invalid route' });
        }
    
        // Book the seat
        await pool.query('BEGIN');
        await pool.query('UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1', [train_id]);
        const bookingResult = await pool.query(`
          INSERT INTO bookings (user_id, train_id, source_station_id, destination_station_id) 
          VALUES ($1, $2, $3, $4) RETURNING *
        `, [user_id, train_id, sourceStation.id, destinationStation.id]);
        await pool.query('COMMIT');
    
        res.status(201).send({ message: 'Seat booked successfully', booking: bookingResult.rows[0] });
      } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).send({ error: err.message });
      }
}

const bookingDetails=async(req,res)=>{
    try {
        const { id } = req.params;
        const user_id = req.user.id;
    
        const result = await pool.query(`
          SELECT b.*, t.train_number, s1.name as source_station, s2.name as destination_station
          FROM bookings b
          JOIN trains t ON b.train_id = t.id
          JOIN stations s1 ON b.source_station_id = s1.id
          JOIN stations s2 ON b.destination_station_id = s2.id
          WHERE b.id = $1 AND b.user_id = $2
        `, [id, user_id]);
    
        if (result.rows.length === 0) {
          return res.status(404).send({ error: 'Booking not found' });
        }
    
        res.send({ booking: result.rows[0] });
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
}

module.exports={getSeatAvailability,bookSeat,bookingDetails}