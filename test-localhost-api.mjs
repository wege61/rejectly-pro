import fs from 'fs';
fetch('http://localhost:3000/api/cv/extract-photo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // We would need a valid session cookie to bypass the auth check, but the route requires it.
    // Instead of bypassing auth, I will temporarily disable auth check in the route to test.
  },
  body: JSON.stringify({ documentId: '36f0db80-5d84-4de5-a7b6-27e590616681' })
}).catch(console.error);
