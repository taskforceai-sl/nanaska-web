import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />
      <div className="hero__content">
        <span className="hero__badge">Leading CIMA Course Provider</span>
        <h1 className="hero__title">
          To Build Better&nbsp;
          <span className="hero__title-accent">Leaders</span>
          &nbsp;for the World
        </h1>
        <p className="hero__subtitle">
          Nanaska provides world-class CIMA tuition that combines expert
          instruction, cutting-edge resources, and dedicated student support to
          help you achieve your professional accounting qualifications.
        </p>
        <div className="hero__actions">
          <a href="#courses" className="hero__btn hero__btn--primary">
            Explore Courses
          </a>
          <a href="#about" className="hero__btn hero__btn--secondary">
            Learn More
          </a>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-number">5000+</span>
            <span className="hero__stat-label">Students</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">95%</span>
            <span className="hero__stat-label">Pass Rate</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">15+</span>
            <span className="hero__stat-label">Years Experience</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">50+</span>
            <span className="hero__stat-label">Expert Tutors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
