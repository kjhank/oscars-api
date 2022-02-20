exports.root = async (req, res, next) => {
  res.json({ healthCheck: '✅' });
};
