import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button} from "@/components/ui/button"
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'
import { LinkIcon } from 'lucide-react'
import logo from "../assets/url-logo.svg";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = false;

    return (
        <header className=" bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md py-4 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="logo">
                <Link to="/" className="text-2xl text-white font-bold bg-gradient-to-r from-blue-400 to-indigo-300  bg-clip-text hover:opacity-90 transition-all">
                <img src={logo} alt="URL Shortener" className="h-14 " /></Link>
                </div>

                
                {/* Mobile menu Button*/}
                <Button
                    className="md:hidden text-gray-300 focus:outline-none" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                        <li>
                            <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link to="/create" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Shorten URL</Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Dashboard</Link>
                        </li>
                    </ul>
                </nav>
                
                <div className="hidden md:flex space-x-4">
                    {!user ?
                    <div className="hidden md:flex space-x-4">
                    <Link to="/auth" className="px-4 py-2 text-white font-medium hover:text-blue-300 transition-colors">Login</Link>
                    <Link to="/auth" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow transition-all">Sign Up</Link>
                    </div>
                    :(
                        <DropdownMenu>
  <DropdownMenuTrigger><Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Aman Vj</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuItem> <LinkIcon className='ml-2 w-4 h-2'/>Link</DropdownMenuItem>
    <DropdownMenuItem className="text-red-400 ">
    <LogOut className='ml-2 w-4 h-4'/>
        Logout </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

                    )
}
                </div>
            </div>
            
            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 shadow-lg mt-4 py-3 px-4 absolute left-0 right-0 z-20">
                    <ul className="space-y-3">
                        <li><Link to="/" className="block text-gray-300 py-2 hover:text-blue-400 font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/create" className="block text-gray-300 py-2 hover:text-blue-400 font-medium" onClick={() => setIsMenuOpen(false)}>Shorten URL</Link></li>
                        <li><Link to="/dashboard" className="block text-gray-300 py-2 hover:text-blue-400 font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                        <li className="border-t border-gray-700 pt-3 mt-3 flex space-x-3">
                            <Link to="/auth" className="block w-1/2 text-center py-2 text-blue-400 border border-blue-500 rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/auth" className="block w-1/2 text-center py-2 bg-blue-600 text-white rounded-lg font-medium" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Header