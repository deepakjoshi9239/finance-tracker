import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2 hover:underline"><a href="/">Home</a></li>
            <li className="mb-2 hover:underline"><a href="/dashboard"> Dashboard</a></li>
            <li className="mb-2 hover:underline"><a href="/budgeting">Budgeting</a></li>
            <li className="mb-2 hover:underline"><a href="/expense-tracking">Expense-tracking</a></li>
            <li className="mb-2 hover:underline"><a href="/savings-goals">Savings-goals</a></li>
            <li className="mb-2 hover:underline"><a href="/reports">Reports</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <p className="mb-2">Email: info@example.com</p>
          <p className="mb-2">Phone: +1 234 567 890</p>
          <p>Location: 123 Finance Ave, Money City</p>
        </div>

        {/* Social Media Icons */}
        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-2xl hover:text-blue-500" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-2xl hover:text-blue-400" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl hover:text-pink-500" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-2xl hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center mt-8">
        <p className="text-sm">&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
