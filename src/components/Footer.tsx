
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white shadow-inner py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-focusflow-mediumgray text-sm">
              &copy; {currentYear} FocusFlow. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-focusflow-mediumgray hover:text-focusflow-blue text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
