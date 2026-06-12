import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LinkIcon } from "lucide-react";
import logo from "../assets/url-logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";  

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between py-3">
                <div className="logo">
                    <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                        <img src={logo} alt="URL Shortener" className="h-10" />
                    </Link>
                </div>

                {/* Mobile menu Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden text-muted-foreground focus:outline-none"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="md:hidden">
                        <DropdownMenuItem>
                            <Link to="/" className="w-full">Home</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/dashboard" className="w-full">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user ? (
                            <DropdownMenuItem className="text-destructive" onClick={() => setConfirmLogout(true)}>
                                Logout
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                <Link to="/auth" className="w-full">Login</Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Desktop Navigation */}
                <nav className="hidden md:block" aria-label="Main navigation">
                    <ul className="flex space-x-8">
                        <li><Link to="/" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Home</Link></li>
                        <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Dashboard</Link></li>
                    </ul>
                </nav>

                <div className="hidden md:flex space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger aria-label="Account menu">
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={`${user.name || user.username || "User"}'s avatar`} />
                                    <AvatarFallback>{user.name?.[0] || user.username?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LinkIcon className="mr-2 w-4 h-4" aria-hidden="true" />
                                    <Link to="/dashboard" className="">
                                    My Links
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setConfirmLogout(true)}>
                                    <LogOut className="mr-2 w-4 h-4" aria-hidden="true" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild>
                            <Link to="/auth">Login</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Logout confirmation */}
            <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You'll need to sign in again to manage your links. This won't delete any of your links.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmLogout(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            onClick={() => { setConfirmLogout(false); handleLogout(); }}
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    );
};

export default Header;
