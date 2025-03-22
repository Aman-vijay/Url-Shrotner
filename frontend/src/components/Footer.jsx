import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 py-4 px-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-center">
                <p className="text-white text-center font-medium">
                    Made with <span className="animate-pulse inline-block">💖</span> by Aman Vijay
                </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500"></div>
        </footer>
    );
};

export default Footer;