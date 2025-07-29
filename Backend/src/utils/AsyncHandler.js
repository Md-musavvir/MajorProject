const AsyncHandler = (IncomingRequest) => async (req, res, next) => {
  try {
    await IncomingRequest(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export default AsyncHandler;
