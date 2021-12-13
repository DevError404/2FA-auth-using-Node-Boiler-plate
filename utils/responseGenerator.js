exports.getResponse = function (status, msg, isShown, records) {
  var response = {
    status: status,
    message: msg,
    isShown: isShown,
    data: records,
  };
  return response;
};
