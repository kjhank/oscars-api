exports.adminBoard = (req, res) => res.status(200).send('This is admin\'s content');
exports.allAccess = (req, res) => res.status(200).send('This is public content');
exports.userBoard = (req, res) => res.status(200).send('This is users\' content');
