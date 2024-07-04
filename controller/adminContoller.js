const pool = require('../DB/connectDb');

const addTrain=async(req,res)=>{
    try {
      const { train_number, total_seats, route } = req.body;
      if (!train_number || !total_seats || !route || !Array.isArray(route) || route.length === 0) {
        return res.status(400).send({ error: 'All fields are required' });
      }
      const trainResult = await pool.query(
        'INSERT INTO trains (train_number, total_seats, available_seats) VALUES ($1, $2, $3) RETURNING *',
        [train_number, total_seats, total_seats]
      );
      const train = trainResult.rows[0];

      for (let i = 0; i < route.length; i++) {
        const stationName = route[i];
        let stationResult = await pool.query('SELECT * FROM stations WHERE name = $1', [stationName]);
        let station = stationResult.rows[0];
  
        if (!station) {
          stationResult = await pool.query(
            'INSERT INTO stations (name) VALUES ($1) RETURNING *',
            [stationName]
          );
          station = stationResult.rows[0];
        }
  
        await pool.query(
          'INSERT INTO train_routes (train_id, station_id, stop_order) VALUES ($1, $2, $3)',
          [train.id, station.id, i]
        );
      }
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
}


const getAllTrain=async(req,res)=>{
    const result=await pool.query('Select * from trains');
    res.status(200).json(result.rows);
}



module.exports={addTrain,getAllTrain};