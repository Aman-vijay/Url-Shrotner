import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LinkIcon } from "lucide-react";
import logo from "../assets/url-logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md py-4 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="logo">
                    <Link to="/" className="text-2xl text-white font-bold hover:opacity-90 transition-all">
                        <img src={logo} alt="URL Shortener" className="h-14" />
                    </Link>
                </div>

                {/* Mobile menu Button */}
                <Button
                    className="md:hidden text-gray-300 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </Button>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li><Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Home</Link></li>
                       
                        <li><Link to="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Dashboard</Link></li>
                    </ul>
                </nav>

                <div className="hidden md:flex space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={user.avatar || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LinkIcon className="mr-2 w-4 h-4" />
                                    <Link to="/dashboard" className=" ">

                                    My Links
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400" onClick={handleLogout}>
                                    <LogOut className="mr-2 w-4 h-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/auth" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 shadow-lg mt-4 py-3 px-4 absolute left-0 right-0 z-20">
                    <ul className="space-y-3">
                        <li><Link to="/" className="block text-gray-300 py-2 hover:text-blue-400 font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
    
                        <li><Link to="/dashboard" className="block text-gray-300 py-2 hover:text-blue-400 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                        <li className="border-t border-gray-700 pt-3 mt-3 flex">
                            {user ? (
                                <Button className="w-full text-center py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}>
                                    Logout
                                </Button>
                            ) : (
                                <Link to="/auth" className="w-full text-center py-2 text-blue-400 border border-blue-500 rounded-lg font-medium"
                                    onClick={() => setIsMenuOpen(false)}>
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
