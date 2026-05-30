const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

export const normalizeEmail = (value = "") => value.trim().toLowerCase();

export const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "");

export const validateEmail = (value = "") => {
  const email = value.trim();

  if (!email) {
    return "Email is required.";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Enter a valid email address.";
  }

  return "";
};

export const validatePassword = (value = "") => {
  if (!value) {
    return "Password is required.";
  }

  if (!PASSWORD_REGEX.test(value)) {
    return "Use at least 8 characters with at least 1 letter and 1 number.";
  }

  return "";
};

export const validatePhone = (value = "") => {
  const phone = value.trim();

  if (!phone) {
    return "Phone number is required.";
  }

  if (!PHONE_REGEX.test(phone)) {
    return "Enter a valid phone number with 7 to 15 digits.";
  }

  return "";
};

export const findDuplicateContact = (contacts = [], formData, selectedContactId = null) => {
  const normalizedEmail = normalizeEmail(formData.email);
  const normalizedPhone = normalizePhone(formData.phone);

  return contacts.find((contact) => {
    if (contact._id === selectedContactId) {
      return false;
    }

    const sameEmail = normalizeEmail(contact.email) === normalizedEmail;
    const samePhone = normalizePhone(contact.phone) === normalizedPhone;

    return sameEmail || samePhone;
  });
};
