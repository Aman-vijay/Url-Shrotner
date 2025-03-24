import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <p className="text-white text-center font-medium">
                    Made with <span className="animate-pulse inline-block">💖</span> by Aman Vijay
                </p>
                <p className="text-white">&copy; {new Date().getFullYear()} URL Shortener. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
