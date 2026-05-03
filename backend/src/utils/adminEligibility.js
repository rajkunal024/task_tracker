const ADMIN_EMAIL_SUFFIX = "@raj.com";

const canBecomeAdmin = (email = "") => email.trim().toLowerCase().endsWith(ADMIN_EMAIL_SUFFIX);

module.exports = {
  ADMIN_EMAIL_SUFFIX,
  canBecomeAdmin
};
