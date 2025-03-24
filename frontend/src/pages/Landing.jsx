import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, LinkIcon, CopyIcon, CheckIcon } from 'lucide-react';
import {useNavigate} from "react-router-dom"

const faqItems = [
  {
    index: 1,
    title: "What is this project about?",
    answer: "This is a URL shortener project that demonstrates how to build a web application that transforms long URLs into short, manageable links using React and modern web technologies."
  },
  {
    index: 2,
    title: "What technologies are used in this project?",
    answer: "This project is built with React, Tailwind CSS,Shadcn UI components and Nodejs . It uses React Router for navigation and demonstrates responsive design patterns and state management."
  },
  {
    index: 3,
    title: "Can I fork or contribute to this project?",
    answer: "Yes! This project is open for contributions and learning purposes. Feel free to fork the repository, submit pull requests, or use it as a learning resource for your own projects."
  },
  {
    index: 4,
    title: "How does the URL shortening work technically?",
    answer: "The URL shortener works by taking a long URL, generating a unique short code, and storing this mapping in a database. When someone visits the short URL, the application retrieves the original URL and redirects them."
  },
  {
    index: 5,
    title: "What features are demonstrated in this project?",
    answer: "This project demonstrates responsive UI design, form handling, conditional rendering, component composition, and modern React patterns. It also showcases how to build a practical web utility with clean architecture."
  }
];
const features = [
  {
    title: "Link Analytics",
    description: "Track clicks, geographic data and referrers for all your shortened links.",
    icon: "📊"
  },
  {
    title: "Custom Links",
    description: "Create branded, memorable URLs that reinforce your identity.",
    icon: "✏️"
  },
  {
    title: "QR Codes",
    description: "Generate QR codes for your shortened links instantly.",
    icon: "📱"
  },
  {
    title: "Link Management",
    description: "Organize, edit and manage all your links from one dashboard.",
    icon: "🔗"
  }
];

const Landing = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleShorten = (e) => {
    e.preventDefault();

    navigate(`/auth?createNew=${url}`)
    
    // setShortened('https://shrtn.er/abc123');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortened);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            URL Shortener for <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Everyone</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform long, complex URLs into short, manageable links that are easier to share and track.
          </p>
        </div>

        {/* URL Shortener Input */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <form onSubmit={handleShorten} className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input 
                      type="url" 
                      placeholder="Paste your long URL here..." 
                      className="pl-10 bg-gray-800 border-gray-700 focus:border-blue-500"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Shorten URL <ArrowRightIcon className="ml-2" size={16} />
                  </Button>
                </div>

                {shortened && (
                  <div className="flex items-center mt-4 p-3 rounded-md bg-gray-800 border border-gray-700">
                    <p className="text-blue-400 flex-grow">{shortened}</p>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                    >
                      {copied ? (
                        <CheckIcon className="text-green-500" size={16} />
                      ) : (
                        <CopyIcon size={16} />
                      )}
                      <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-gray-900 border-gray-800 transform hover:scale-105 transition-transform">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto rounded-lg">
            {faqItems.map((item, index) => (
              <div 
                key={item.index}
                className="mb-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-800"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <svg 
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-40 pb-4' : 'max-h-0'}`}
                >
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to shorten your URLs?</h2>
            <p className="text-lg mb-6">Create an account for free and unlock additional features.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">Sign Up Free</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">Learn More</Button>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Landing;