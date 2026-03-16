import './Courses.css';

const COURSE_LEVELS = [
  {
    id: 'certificate',
    level: 'Certificate Level',
    tag: 'Entry Point',
    tagColor: '#24ade3',
    icon: '🎓',
    description:
      'The Certificate Level is the ideal entry point into the CIMA qualification. It covers the fundamentals of finance, accounting, and business, providing a strong foundation for your professional journey.',
    subjects: [
      'Business Accounting',
      'Management Accounting',
      'Business Mathematics',
      'Corporate & Business Law',
    ],
    href: '#certificate',
  },
  {
    id: 'operational',
    level: 'Operational Level',
    tag: 'Foundation',
    tagColor: '#1b365d',
    icon: '📊',
    description:
      'The Operational Level builds on your foundational knowledge, developing core financial and management accounting competencies essential for day-to-day business decision-making.',
    subjects: [
      'Management Accounting',
      'Financial Reporting',
      'Business Finance',
      'Enterprise Operations',
    ],
    href: '#operational',
  },
  {
    id: 'management',
    level: 'Management Level',
    tag: 'Intermediate',
    tagColor: '#f5a623',
    icon: '📈',
    description:
      'At Management Level, you develop strategic analysis and decision-making skills, learning to manage resources effectively and advise on complex business challenges.',
    subjects: [
      'Advanced Management Accounting',
      'Advanced Financial Reporting',
      'Risk Management',
      'Enterprise Management',
    ],
    href: '#management',
  },
  {
    id: 'strategic',
    level: 'Strategic Level',
    tag: 'Advanced',
    tagColor: '#1b365d',
    icon: '🏆',
    description:
      'The Strategic Level is the pinnacle of the CIMA qualification. It focuses on high-level leadership, governance, and strategic decision-making that drives organizational success.',
    subjects: [
      'Strategic Management',
      'Strategic Financial Management',
      'Risk & Control Strategy',
      'Business Strategy',
    ],
    href: '#strategic',
  },
];

export default function Courses() {
  return (
    <section className="courses" id="courses">
      <div className="courses__container">
        <div className="courses__header">
          <span className="courses__eyebrow">What We Offer</span>
          <h2 className="courses__title">CIMA Qualification Levels</h2>
          <p className="courses__subtitle">
            Progress through the four levels of the CIMA qualification with
            Nanaska&apos;s expert guidance. Each level is designed to build your
            competencies and advance your career.
          </p>
        </div>

        <div className="courses__grid">
          {COURSE_LEVELS.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-card__icon">{course.icon}</div>
              <span
                className="course-card__tag"
                style={{ backgroundColor: course.tagColor }}
              >
                {course.tag}
              </span>
              <h3 className="course-card__title">{course.level}</h3>
              <p className="course-card__desc">{course.description}</p>
              <ul className="course-card__subjects">
                {course.subjects.map((sub) => (
                  <li key={sub} className="course-card__subject">
                    <span className="course-card__check">✓</span>
                    {sub}
                  </li>
                ))}
              </ul>
              <a href={course.href} className="course-card__link">
                View Syllabus →
              </a>
            </div>
          ))}
        </div>

        <div className="courses__cta">
          <a href="#register" className="courses__cta-btn">
            Register for a Course
          </a>
        </div>
      </div>
    </section>
  );
}
