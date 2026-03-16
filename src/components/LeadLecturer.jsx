import './LeadLecturer.css';

export default function LeadLecturer() {
  return (
    <section className="lecturer" id="lecturer">
      <div className="lecturer__container">
        <div className="lecturer__img-col">
          <div className="lecturer__img-wrap">
            <img
              src="https://www.nanaska.com/wp-content/uploads/2021/03/Lead-Lecturer-home-page-.jpg"
              alt="Channa Gunawardana – Lead Lecturer"
              className="lecturer__img"
              loading="lazy"
            />
            <div className="lecturer__img-accent" />
          </div>
        </div>

        <div className="lecturer__body">
          <span className="lecturer__eyebrow">Our Lead Lecturer</span>
          <h2 className="lecturer__name">Channa Gunawardana</h2>
          <div className="lecturer__credentials">
            <span className="lecturer__badge">CIMA Fellow</span>
            <span className="lecturer__badge">CA Sri Lanka</span>
            <span className="lecturer__badge">MBA Finance</span>
            <span className="lecturer__badge">PhD (Candidate)</span>
          </div>
          <p className="lecturer__bio">
            Channa Gunawardana, CEO of a public listed company in Sri Lanka, is a fellow
            member of CIMA UK and CA Sri Lanka. He holds a Bachelor&apos;s degree in
            Accountancy and Financial Management from the University of Sri Jayewardenepura
            and an MBA in Finance from the University of Southern Queensland, Australia.
            He is currently pursuing a PhD at Management and Science University, Malaysia.
          </p>
          <p className="lecturer__bio">
            With 21 years of lecturing experience, he is renowned as the&nbsp;
            <strong>CIMA case study specialist</strong>, having produced over&nbsp;
            <strong>95% of CIMA Sri Lanka prize winners</strong>, including global prize
            winners over the last decade. He is also a member of the&nbsp;
            <strong>CIMA Global Council</strong>.
          </p>
          <div className="lecturer__stats">
            {[
              { number: '21+', label: 'Years Lecturing' },
              { number: '95%', label: 'Prize Winners' },
              { number: '10+', label: 'Global Winners' },
            ].map(({ number, label }) => (
              <div key={label} className="lecturer__stat">
                <span className="lecturer__stat-number">{number}</span>
                <span className="lecturer__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
