export const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const error = (res, message = 'Internal Server Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null
  });
};
