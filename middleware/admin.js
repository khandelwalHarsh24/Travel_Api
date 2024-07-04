
module.exports = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  // console.log(apiKey);
  // console.log(process.env.ADMIN_API_KEY);
  if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
    next();
  } else {
    res.status(403).send({ error: 'Forbidden' });
  }
};
