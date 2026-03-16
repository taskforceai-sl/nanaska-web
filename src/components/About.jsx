import './About.css';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        {/* Left column – intro text */}
        <div className="about__col about__col--left">
          <span className="about__eyebrow">Who We Are</span>
          <h2 className="about__title">Empowering Future Finance Leaders</h2>
          <p className="about__body">
            Nanaska is a premier CIMA tuition provider committed to delivering
            exceptional education that combines academic rigour with real-world
            application. Since our founding, we have helped thousands of
            students unlock their potential and build rewarding careers in
            finance and management accounting.
          </p>
          <div className="about__features">
            {[
              { icon: '🎯', text: 'Personalised Tutoring' },
              { icon: '💻', text: 'Online & On-site Classes' },
              { icon: '📚', text: 'Comprehensive Study Materials' },
              { icon: '🤝', text: 'Dedicated Student Support' },
            ].map(({ icon, text }) => (
              <div key={text} className="about__feature">
                <span className="about__feature-icon">{icon}</span>
                <span className="about__feature-text">{text}</span>
              </div>
            ))}
          </div>
          <a href="#courses" className="about__btn">Explore Our Courses</a>
        </div>

        {/* Centre – student photo */}
        <div className="about__col about__col--center">
          <div className="about__img-wrap">
            <img
              src="https://www.nanaska.com/wp-content/uploads/2025/10/front-view-male-student-wearing-black-backpack-holding-copybooks-files-blue-wall-min-min-scaled-1.webp"
              alt="Nanaska student"
              className="about__student-img"
              loading="lazy"
            />
            <div className="about__img-badge">
              <span className="about__img-badge-number">95%</span>
              <span className="about__img-badge-label">Pass Rate</span>
            </div>
          </div>
        </div>

        {/* Right column – metrics + quote */}
        <div className="about__col about__col--right">
          <div className="about__metrics">
            {[
              { number: '5,000+', label: 'Graduates' },
              { number: '15+',    label: 'Years Experience' },
              { number: '20+',    label: 'Countries' },
            ].map(({ number, label }) => (
              <div key={label} className="about__metric">
                <span className="about__metric-number">{number}</span>
                <span className="about__metric-label">{label}</span>
              </div>
            ))}
          </div>
          <blockquote className="about__quote">
            <p className="about__quote-text">
              "Nanaska gave me the skills and confidence to pass all my CIMA
              exams first time. The support is truly world-class."
            </p>
            <footer className="about__quote-footer">— Sarah K., CGMA</footer>
          </blockquote>
          <div className="about__cta-group">
            <a href="#register" className="about__btn about__btn--accent">
              Register Now
            </a>
            <a href="#connect" className="about__btn about__btn--outline">
              Nanaska Connect
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
