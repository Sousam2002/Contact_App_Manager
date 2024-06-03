// Function to set a cookie
export const setCookie = (name, value, expirationDays) => {
    const cookieValue = encodeURIComponent(value) + (expirationDays ? `; expires=${expirationDays}` : '');
    document.cookie = `${name}=${cookieValue}; path=/`;
  };
  
  // Function to check if a cookie exists
export const checkCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName] = cookie.split('=');
      if (cookieName.trim() === name) {
        return true;
      }
    }
    return false;
  };
  
  // Function to get the value of a cookie
export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };
  