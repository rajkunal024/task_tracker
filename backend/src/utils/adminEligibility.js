const ApiError = require("./ApiError");

const assertAdminKey = (adminKey) => {
  if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
    throw new ApiError(403, "Invalid admin key. Permission denied.");
  }
};

module.exports = {
  assertAdminKey
};
