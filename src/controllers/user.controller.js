exports.adminBoard = (req, res) => res.status(200).send({ message: 'auth.adminContent' });
exports.allAccess = (req, res) => res.status(200).send({ message: 'auth.publicContent' });
exports.userBoard = (req, res) => res.status(200).send({ message: 'auth.userContent' });
