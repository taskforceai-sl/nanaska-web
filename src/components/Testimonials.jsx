import './Testimonials.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah K.',
    title: 'CGMA, Finance Manager',
    initials: 'SK',
    color: '#24ade3',
    quote:
      'Nanaska was instrumental in helping me pass all my CIMA exams on the first attempt. The tutors are incredibly knowledgeable and the study materials are top-notch.',
  },
  {
    id: 2,
    name: 'Michael T.',
    title: 'Management Accountant',
    initials: 'MT',
    color: '#1b365d',
    quote:
      'The personalised support from Nanaska made all the difference. They helped me understand complex financial concepts in a way that made sense for real-world application.',
  },
  {
    id: 3,
    name: 'Priya N.',
    title: 'Strategic Finance Director',
    initials: 'PN',
    color: '#f5a623',
    quote:
      'I cannot recommend Nanaska enough. Their structured approach and experienced tutors helped me achieve my CIMA qualification faster than I thought possible.',
  },
  {
    id: 4,
    name: 'James O.',
    title: 'Financial Controller',
    initials: 'JO',
    color: '#24ade3',
    quote:
      'The Nanaska Connect programme was a game-changer for my career. Not only did I gain qualifications, but I also landed my dream job through their network.',
  },
  {
    id: 5,
    name: 'Aisha M.',
    title: 'Cost & Compliance Analyst',
    initials: 'AM',
    color: '#1b365d',
    quote:
      'From the Certificate Level all the way to Strategic, Nanaska was with me every step of the way. Outstanding support and incredible study resources.',
  },
  {
    id: 6,
    name: 'David L.',
    title: 'Treasury Manager',
    initials: 'DL',
    color: '#f5a623',
    quote:
      'Flexible online classes, expert tutors, and a supportive community — Nanaska has it all. I passed my Strategic Level exams with flying colours.',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <span className="testimonials__eyebrow">Student Stories</span>
          <h2 className="testimonials__title">What Our Students Say</h2>
          <p className="testimonials__subtitle">
            Thousands of students have transformed their careers with Nanaska.
            Here&apos;s what some of them have to say.
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-card__quote">&ldquo;</div>
              <p className="testimonial-card__text">{t.quote}</p>
              <div className="testimonial-card__footer">
                <div
                  className="testimonial-card__avatar"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__title">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
