import './Connect.css';

export default function Connect() {
  return (
    <section className="connect" id="connect">
      <div className="connect__container">
        <div className="connect__text">
          <span className="connect__eyebrow">Career Support</span>
          <h2 className="connect__title">Nanaska Connect</h2>
          <p className="connect__body">
            Nanaska Connect is our exclusive career-support service that bridges
            the gap between qualification and employment. We work with a broad
            network of employers and industry partners to help our graduates
            secure rewarding roles in finance, accounting, and management.
          </p>
          <ul className="connect__benefits">
            {[
              'Job placement assistance',
              'CV & interview coaching',
              'Access to exclusive employer network',
              'Career development workshops',
            ].map((item) => (
              <li key={item} className="connect__benefit">
                <span className="connect__bullet">▸</span>
                {item}
              </li>
            ))}
          </ul>
          <a href="#register" className="connect__btn">
            Join Nanaska Connect
          </a>
        </div>
        <div className="connect__graphic">
          <div className="connect__circle connect__circle--outer" />
          <div className="connect__circle connect__circle--mid" />
          <div className="connect__circle connect__circle--inner">
            <span>🔗</span>
            <p>Connect</p>
          </div>
        </div>
      </div>
    </section>
  );
}
