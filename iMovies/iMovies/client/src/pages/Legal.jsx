import React from 'react';
import { Link } from 'react-router-dom';

export function Privacy() {
  return <div className="page-wrap legal-page"><span className="eyebrow">iMOVIES POLICIES</span><h1>Privacy <em>policy.</em></h1><p className="muted">Development template · review and update before launch</p>
    <h2>Information we collect</h2><p>This development application may store account name, email address, a password hash, watchlist items, reviews, and booking records. Never enter sensitive information into a development environment.</p>
    <h2>How information is used</h2><p>Account information supports sign-in, saved films, reviews, and booking management. In a production deployment, update this section to describe actual processors, analytics, retention periods, and support operations.</p>
    <h2>Cookies and security</h2><p>Authentication uses an HTTP-only session cookie. Production deployment requires HTTPS, reviewed cookie settings, CSRF protections appropriate to the deployment, access controls, and secure secret management.</p>
    <h2>Third-party services</h2><p>Movie data, payment processing, and email may rely on third-party providers when configured. Their identities and applicable privacy terms must be listed before launch.</p>
    <h2>Your choices and contact</h2><p>Replace this section with a real process for access, correction, deletion, retention, and privacy requests, plus the responsible business contact and applicable jurisdiction.</p>
    <p>This is a starter template, not legal advice or a claim of compliance. Have it reviewed and tailor it to the actual service before accepting public users.</p><Link to="/" className="text-link">Back to iMovies</Link>
  </div>;
}

export function Terms() {
  return <div className="page-wrap legal-page"><span className="eyebrow">iMOVIES POLICIES</span><h1>Terms and <em>conditions.</em></h1><p className="muted">Development template · review and update before launch</p>
    <h2>Development service</h2><p>This application is a development build. Movie and showtime entries may be sample data and do not represent a confirmed real-world cinema listing.</p>
    <h2>Accounts</h2><p>Users are responsible for maintaining access to their account. The service owner must publish the actual eligibility, acceptable-use, suspension, and account-closure rules before launch.</p>
    <h2>Bookings and payments</h2><p>This starter does not process real payments or issue confirmed tickets. A production service must clearly display final prices, taxes and fees, booking confirmation rules, cancellation eligibility, refund timing, and payment-provider details before a customer pays.</p>
    <h2>Availability and changes</h2><p>Real showtimes, seat availability, and cinema details must be verified with the relevant operator. Do not treat development sample data as an offer to sell tickets.</p>
    <h2>Contact and governing terms</h2><p>Before launch, insert the actual operator identity, customer support contact, governing law, dispute process, limitation clauses, and any mandatory consumer disclosures.</p>
    <p>This is a starter template, not legal advice. Have qualified counsel review the final terms for the business and jurisdiction.</p><Link to="/" className="text-link">Back to iMovies</Link>
  </div>;
}
