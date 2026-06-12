import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-background border-t border-border py-6 px-6">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-muted-foreground text-center font-medium">
                    Made with care by Aman Vijay
                </p>
                <p className="text-muted-foreground">&copy; {new Date().getFullYear()} URL Shortener. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
