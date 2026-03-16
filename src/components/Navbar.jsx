import { useState } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  {
    label: 'Courses',
    href: '#courses',
    dropdown: [
      { label: 'Certificate Level', href: '#certificate' },
      { label: 'Operational Level', href: '#operational' },
      { label: 'Management Level', href: '#management' },
      { label: 'Strategic Level', href: '#strategic' },
    ],
  },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <a href="#home" className="navbar__logo">
          <span className="navbar__logo-nanaska">NAN</span>
          <span className="navbar__logo-accent">ASKA</span>
        </a>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <li
                key={link.label}
                className="navbar__item navbar__item--dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a href={link.href} className="navbar__link">
                  {link.label} <span className="navbar__caret">▾</span>
                </a>
                <ul className={`navbar__dropdown ${dropdownOpen ? 'navbar__dropdown--visible' : ''}`}>
                  {link.dropdown.map((sub) => (
                    <li key={sub.label}>
                      <a href={sub.href} className="navbar__dropdown-link">
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.label} className="navbar__item">
                <a href={link.href} className="navbar__link">
                  {link.label}
                </a>
              </li>
            )
          )}
          <li className="navbar__item">
            <a href="#login" className="navbar__link navbar__link--btn">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
