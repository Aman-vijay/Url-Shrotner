import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, LinkIcon, BarChart3, PenLine, QrCode, Layers, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";


const faqItems = [
  {
    index: 1,
    title: "How do I shorten a URL?",
    answer: "Paste your long link into the box above, sign in, and your short link is created instantly. You can add a custom path so it's easy to remember and share."
  },
  {
    index: 2,
    title: "Can I track how many people click my links?",
    answer: "Yes. Every link has a dashboard with total clicks, clicks per day, and a breakdown by location and device type — all updated as people click."
  },
  {
    index: 3,
    title: "Can I make a custom short link?",
    answer: "Absolutely. When you create a link you can choose your own custom path, like yourbrand.com/offer, as long as it's not already taken."
  },
  {
    index: 4,
    title: "Do short links work on any device?",
    answer: "Yes. Short links work everywhere — desktop, mobile, and in print or QR codes. You can also generate a QR code for any link you create."
  },
  {
    index: 5,
    title: "Can I delete a link after I create it?",
    answer: "Yes. You can delete any link from your dashboard at any time, and we'll confirm before anything is removed."
  }
];

const features = [
  {
    title: "Link Analytics",
    description: "Track clicks, geographic data and referrers for all your shortened links.",
    icon: BarChart3
  },
  {
    title: "Custom Links",
    description: "Create branded, memorable URLs that reinforce your identity.",
    icon: PenLine
  },
  {
    title: "QR Codes",
    description: "Generate QR codes for your shortened links instantly.",
    icon: QrCode
  },
  {
    title: "Link Management",
    description: "Organize, edit and manage all your links from one dashboard.",
    icon: Layers
  }
];

const Landing = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

const {user} = useAuth();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleShorten = (e) => {
    e.preventDefault();

    navigate(`/auth?createNew=${encodeURIComponent(url)}`)
    localStorage.setItem("redirectUrl",url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance">
            URL Shortener for <span className="text-primary">Everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform long, complex URLs into short, manageable links that are easier to share and track.
          </p>
        </div>

        {/* URL Shortener Input */}
        <div className="max-w-3xl mx-auto mb-20">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <form onSubmit={handleShorten} className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                    <Input 
                      type="url" 
                      placeholder="Paste your long URL here..." 
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Shorten URL <ArrowRightIcon className="ml-2" size={16} aria-hidden="true" />
                  </Button>
                </div>
                {!user && (
                  <p className="text-sm text-muted-foreground text-center">
                    You'll be asked to sign in so we can save and track your link.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="bg-card border-border hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4">
                      <Icon size={28} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-balance">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto rounded-lg">
            {faqItems.map((item, index) => (
              <div 
                key={item.index}
                className="mb-4 bg-card border border-border rounded-lg overflow-hidden transition-colors duration-300 hover:bg-secondary/60"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-panel-${item.index}`}
                  id={`faq-trigger-${item.index}`}
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                    aria-hidden="true"
                  />
                </button>
                <div 
                  id={`faq-panel-${item.index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.index}`}
                  className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-48 pb-4' : 'max-h-0'}`}
                >
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
        <div className="py-16 text-center">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">Ready to shorten your URLs?</h2>
            <p className="text-lg text-muted-foreground mb-6">Create a free account and start sharing shorter links in minutes.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </div>
        )
      }
      </div>
    </div>
  );
};

export default Landing;
