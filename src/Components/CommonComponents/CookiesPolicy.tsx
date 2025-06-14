import React from 'react';

const CookiesPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>

      <p className="mb-4">
        We use <strong>strictly necessary cookies</strong> to keep you logged in
        and ensure the security of our platform. These cookies are{' '}
        <strong>HttpOnly</strong> and cannot be accessed by JavaScript.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        1. Strictly Necessary Cookies
      </h2>
      <p className="mb-4">
        These cookies are essential for the website to function properly. They
        enable core features such as user authentication and session management.
        No explicit consent is required for these cookies.
      </p>

      <table className="w-full text-left mb-6 border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Purpose</th>
            <th className="p-2 border-b">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b">
              <code>jwt</code>
            </td>
            <td className="p-2 border-b">
              Stores your session token to keep you authenticated across pages.
            </td>
            <td className="p-2 border-b">
              Expires in 10 years (Since we’re in a testing phase, this long
              expiry has been set to simplify tests.)
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mb-2">2. Other Cookies</h2>
      <p className="mb-4">
        If we introduce analytics or marketing cookies in the future, we will
        ask for your explicit consent via a banner before setting them.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. How to Disable Cookies</h2>
      <p className="mb-4">
        You can control or delete cookies at any time via your browser settings.
        For example:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Chrome:</strong> Settings &gt; Privacy and security &gt;
          Cookies and other site data
        </li>
        <li>
          <strong>Firefox:</strong> Settings &gt; Privacy & Security &gt;
          Cookies and Site Data
        </li>
        <li>
          <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website
          Data
        </li>
      </ul>
      <p className="mb-4">
        Please note disabling strictly necessary cookies may prevent you from
        logging in or using key features of the site.
      </p>
    </div>
  );
};

export default CookiesPolicy;
