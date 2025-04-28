import { useState, useEffect } from 'react';

export default function useCSRFToken() {
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          setCookieValue(decodeURIComponent(cookie.substring(10)));
          break;
        }
      }
    }
  }, []);

  return cookieValue;
}

