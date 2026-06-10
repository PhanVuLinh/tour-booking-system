const authService = require("./auth.service");

module.exports.register = async (req, res) => {
  const result = await authService.register(req.body);

  res.json(result);
};
