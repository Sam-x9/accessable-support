# AccessAble — Online IT Student Support

Accessible, browser-based support request and guided navigation app for IT students and alumni.

## Features
- Four-step Smart Support Navigator with two ranked recommendations
- Four online support pathways
- Session request management and accessibility preferences
- Local browser storage and calendar export

## Hosting
Upload these files to the root of a GitHub repository and enable GitHub Pages from the main branch.

## Deployment boundary
Requests remain in the local browser. There is no live staff scheduling, authentication, video integration, or secure central database. Do not collect sensitive health details in this version.

## Appointment confirmation flow
Submit an appointment request on `book.html`. The app stores the request in localStorage, redirects to `confirmation.html?id=...`, and displays a receipt-style confirmation with a reference number, session details, pending status, and next steps. No emails or staff notifications are sent.
