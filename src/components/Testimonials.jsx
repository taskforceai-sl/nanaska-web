import { useState, useEffect, useRef, useCallback } from 'react';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    id: 1, name: 'Sarah K.', title: 'CGMA, Finance Manager',
    initials: 'SK', color: '#24ade3',
    quote: 'Nanaska was instrumental in helping me pass all my CIMA exams on the first attempt. The tutors are incredibly knowledgeable and the study materials are top-notch.',
  },
  {
    id: 2, name: 'Michael T.', title: 'Management Accountant',
    initials: 'MT', color: '#f5a623',
    quote: 'The personalised support from Nanaska made all the difference. They helped me understand complex financial concepts in a way that made sense for real-world application.',
  },
  {
    id: 3, name: 'Priya N.', title: 'Strategic Finance Director',
    initials: 'PN', color: '#24ade3',
    quote: 'I cannot recommend Nanaska enough. Their structured approach and experienced tutors helped me achieve my CIMA qualification faster than I thought possible.',
  },
  {
    id: 4, name: 'James O.', title: 'Financial Controller',
    initials: 'JO', color: '#f5a623',
    quote: 'The Nanaska Connect programme was a game-changer for my career. Not only did I gain qualifications, but I also landed my dream job through their network.',
  },
  {
    id: 5, name: 'Aisha M.', title: 'Cost & Compliance Analyst',
    initials: 'AM', color: '#24ade3',
    quote: 'From the Certificate Level all the way to Strategic, Nanaska was with me every step of the way. Outstanding support and incredible study resources.',
  },
  {
    id: 6, name: 'David L.', title: 'Treasury Manager',
    initials: 'DL', color: '#f5a623',
    quote: 'Flexible online classes, expert tutors, and a supportive community — Nanaska has it all. I passed my Strategic Level exams with flying colours.',
  },
  {
    id: 7, name: 'Nina R.', title: 'Senior Financial Analyst',
    initials: 'NR', color: '#24ade3',
    quote: 'Channa\'s case study sessions are simply unmatched. His ability to break down complex scenarios into clear strategies gave me the confidence I needed on exam day.',
  },
  {
    id: 8, name: 'Omar B.', title: 'CFO, Tech Startup',
    initials: 'OB', color: '#f5a623',
    quote: 'Studying with Nanaska from overseas was seamless. The online platform is excellent and the tutors are always available to answer questions — highly recommended.',
  },
];

const VISIBLE = 3;
const INTERVAL = 5000;

export default function Testimonials() {
  const [startIdx, setStartIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const timerRef = useRef(null);
  const count = TESTIMONIALS.length;

  const go = useCallback((dir) => {
    setAnimDir(dir);
    setStartIdx((prev) =>
      dir === 'next'
        ? (prev + 1) % count
        : (prev - 1 + count) % count
    );
    setTimeout(() => setAnimDir(null), 400);
  }, [count]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go('next'), INTERVAL);
  }, [go]);

  useEffect(() => {
    timerRef.current = setInterval(() => go('next'), INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [go]);

  const visible = Array.from({ length: VISIBLE }, (_, i) => TESTIMONIALS[(startIdx + i) % count]);

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

        <div className={`testimonials__track testimonials__track--${animDir || 'idle'}`}>
          {visible.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-card__quote">&ldquo;</div>
              <p className="testimonial-card__text">{t.quote}</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__avatar" style={{ backgroundColor: t.color }}>
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

        <div className="testimonials__controls">
          <button
            className="testimonials__arrow"
            aria-label="Previous testimonial"
            onClick={() => { go('prev'); resetTimer(); }}
          >
            &#8249;
          </button>
          <div className="testimonials__dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot${i === startIdx ? ' testimonials__dot--active' : ''}`}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => { setStartIdx(i); resetTimer(); }}
              />
            ))}
          </div>
          <button
            className="testimonials__arrow"
            aria-label="Next testimonial"
            onClick={() => { go('next'); resetTimer(); }}
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
