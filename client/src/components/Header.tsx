import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const textStyle = {
    wordBreak: "keep-all" as const,
    overflowWrap: "break-word" as const,
  };

  return (
    <header
      className={`bg-navy text-white sticky top-0 z-50 shadow-md transition-all duration-300 ${scrolled ? "py-1" : "py-2"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}navy_logo.png`}
            alt="대한민국 해군로고"
            className="h-10 md:h-14"
            style={{
              display: "block",
              objectFit: "contain",
              width: "auto",
            }}
          />
        </a>
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <a
            href="#overview"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            개요
          </a>
          <a
            href="#programs"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            교육 프로그램
          </a>
          <a
            href="#schedule"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            교육 일정
          </a>
          <a
            href="#instructors"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            강사진 소개
          </a>
          <a
            href="#application"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            신청 절차
          </a>
          <a
            href="#faq"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            FAQ (자주 묻는 질문)
          </a>
          <a
            href="#resources"
            className="hover:text-gold-light transition text-sm lg:text-base px-1"
            style={textStyle}
          >
            자료실
          </a>
        </nav>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden bg-navy-dark text-white overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          boxShadow: isMenuOpen ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <div className="container mx-auto px-4 py-1 flex flex-col">
          <a
            href="#overview"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            개요
          </a>
          <a
            href="#programs"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            교육 프로그램
          </a>
          <a
            href="#schedule"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            교육 일정
          </a>
          <a
            href="#instructors"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            강사진 소개
          </a>
          <a
            href="#application"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            신청 절차
          </a>
          <a
            href="#faq"
            className="py-2.5 border-b border-navy-light hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            FAQ (자주 묻는 질문)
          </a>
          <a
            href="#resources"
            className="py-2.5 hover:text-gold-light transition font-medium text-sm"
            onClick={closeMenu}
            style={textStyle}
          >
            자료실
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
