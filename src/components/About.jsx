import './About.css';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <div className="about__text">
          <span className="about__eyebrow">Who We Are</span>
          <h2 className="about__title">Empowering Future Finance Leaders</h2>
          <p className="about__body">
            Nanaska is a premier CIMA tuition provider committed to delivering
            exceptional education that combines academic rigour with real-world
            application. Since our founding, we have helped thousands of
            students unlock their potential and build rewarding careers in
            finance and management accounting.
          </p>
          <p className="about__body">
            Our team of experienced tutors and industry professionals work
            tirelessly to ensure every student receives personalised support,
            flexible learning options, and the best possible preparation for
            CIMA examinations.
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
          <a href="#courses" className="about__btn">
            Explore Our Courses
          </a>
        </div>

        <div className="about__visual">
          <div className="about__visual-card">
            <div className="about__visual-inner">
              <div className="about__metric">
                <span className="about__metric-number">5,000+</span>
                <span className="about__metric-label">Graduates</span>
              </div>
              <div className="about__divider" />
              <div className="about__metric">
                <span className="about__metric-number">95%</span>
                <span className="about__metric-label">Pass Rate</span>
              </div>
              <div className="about__divider" />
              <div className="about__metric">
                <span className="about__metric-number">15+</span>
                <span className="about__metric-label">Years</span>
              </div>
            </div>
            <p className="about__visual-caption">
              "Nanaska gave me the skills and confidence to pass all my CIMA
              exams first time."
            </p>
            <p className="about__visual-attribution">— Sarah K., CGMA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
