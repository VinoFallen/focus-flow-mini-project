
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 md:py-20 px-4 sm:px-6 bg-focusflow-gray">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-focusflow-darkgray mb-6">
              Stay Focused. Crush Your Tasks.
            </h1>
            <p className="text-lg md:text-xl text-focusflow-mediumgray mb-8 max-w-3xl mx-auto">
              FocusFlow helps students organize tasks, track progress, and meet deadlines effectively.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto bg-focusflow-blue hover:bg-focusflow-blue/90 text-white px-8 py-2 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full sm:w-auto border-focusflow-blue text-focusflow-blue hover:bg-focusflow-gray px-8 py-2 text-lg">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use FocusFlow?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg text-center">
                <div className="mx-auto bg-focusflow-blue/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#33C3F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <path d="m9 16 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Task Management</h3>
                <p className="text-focusflow-mediumgray">
                  Create, organize, and prioritize your tasks all in one place.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-lg text-center">
                <div className="mx-auto bg-focusflow-blue/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#33C3F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Interface</h3>
                <p className="text-focusflow-mediumgray">
                  No complicated features - just the essentials for student productivity.
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-lg text-center">
                <div className="mx-auto bg-focusflow-blue/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#33C3F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Deadline Reminders</h3>
                <p className="text-focusflow-mediumgray">
                  Never miss an assignment deadline with visual priority markers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <section className="py-12 md:py-16 px-4 sm:px-6 bg-focusflow-blue text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to boost your productivity?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join FocusFlow today and take control of your academic workload.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-focusflow-blue hover:bg-gray-100 px-8 py-2 text-lg">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
