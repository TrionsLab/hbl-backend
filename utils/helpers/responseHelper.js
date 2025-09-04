exports.success = (res, data, message = "Success") => {
  return res.status(200).json({ message, data });
};

exports.error = (res, error, status = 500, message = "Error") => {
  return res.status(status).json({ message, error: error.message || error });
};
