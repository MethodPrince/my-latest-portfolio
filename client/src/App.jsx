import { useState } from 'react';
import profilePhoto from './img_8594.jpg';

const projects = [
  {
    title: 'UMP Campus Navigation System',
    type: 'React Native / MongoDB',
    challenge: 'Students struggled to locate campus buildings and support offices quickly.',
    solution: 'Built a mobile app with map-based wayfinding, searchable venues, and structured campus data.',
    impact: 'Improved orientation speed for first-year students and reduced repetitive location queries.',
    stack: ['React Native', 'MongoDB', 'Node.js'],
    link: 'https://github.com/MethodPrince/App-Navigation-Labs.git'
  },
  {
    title: 'UMPCFERI Website',
    type: 'WordPress / React / SQL',
    challenge: 'The university needed a modern full-stack website with content management and dynamic student services.',
    solution: 'Built a hybrid full-stack solution using WordPress for CMS, React for interactive pages, and SQL for structured data.',
    impact: 'Delivered a responsive university website with easier content updates, faster information access, and improved user engagement.',
    stack: ['WordPress', 'React', 'SQL'],
    link: 'https://github.com/MethodPrince/umpcferi_website.git'
  },
  {
    title: 'EduLearning System',
    type: 'React / Node.js',
    challenge: 'Learners needed a centralized space for secure digital coursework and progress tracking.',
    solution: 'Developed a responsive platform with authentication, course modules, and role-based access.',
    impact: 'Enabled structured online learning with improved student-teacher content delivery.',
    stack: ['React', 'Express', 'MongoDB'],
    link: 'https://github.com/kayise-it/edu-learning.git'
  },
  {
    title: 'Car Rental System',
    type: 'Full-stack Web',
    challenge: 'Manual rental operations slowed bookings and increased data inconsistencies.',
    solution: 'Created a digital booking workflow with availability controls and customer record management.',
    impact: 'Reduced booking friction and streamlined rental processing for admins.',
    stack: ['JavaScript', 'Node.js', 'MongoDB'],
    link: 'https://github.com/MethodPrince/Car_rental_system.git'
  }
];

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'sending', message: 'Sending your message...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(form)
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const result = isJson
        ? await response.json()
        : {
            ok: false,
            error:
              'Contact service is unavailable. Please restart the dev server and try again.'
          };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to send your message right now.');
      }

      setForm({ name: '', email: '', message: '' });
      setSubmitState({ status: 'success', message: 'Message sent. I will reply by email soon.' });
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error.message || 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <div className="app-shell">
      <header className="hero fade-up">
        <div className="hero-copy-panel">
          <p className="eyebrow">Software Developer | ICT Graduate</p>
          <h1>Method Prince Mbowana</h1>
          <p className="hero-copy">
            I build reliable digital products for education and business workflows, combining clean frontend
            experiences with robust backend systems.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">View Projects</a>
            <a className="ghost-button" href="#contact">Hire Me</a>
          </div>
          <div className="social-links">
            <a href="https://github.com/MethodPrince" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/method-prince-0aa6002a5" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="profile-frame">
            <img className="profile-photo" src={profilePhoto} alt="Method Prince Mbowana" />
          </div>
          <div className="metrics-grid">
            <div>
              <p className="metric-value">8+</p>
              <p className="metric-label">Projects Delivered</p>
            </div>
            <div>
              <p className="metric-value">5</p>
              <p className="metric-label">Certifications</p>
            </div>
            <div>
              <p className="metric-value">2025</p>
              <p className="metric-label">Diploma Graduate</p>
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="section card fade-up delay-1">
        <h2>Professional Summary</h2>
        <p>
          Motivated and results-driven application developer with hands-on experience across web and mobile projects.
          I focus on practical, maintainable solutions that improve usability, reduce process friction, and support
          real operational goals.
        </p>
        <div className="highlight-grid">
          <article>
            <h3>What I Deliver</h3>
            <p>Full-stack applications, API integrations, and mobile-friendly interfaces built for production use.</p>
          </article>
          <article>
            <h3>How I Work</h3>
            <p>Structured problem analysis, rapid prototyping, and iterative improvement with measurable outcomes.</p>
          </article>
          <article>
            <h3>Current Focus</h3>
            <p>React, Node.js, MongoDB, and smarter user experiences for education and business systems.</p>
          </article>
        </div>
      </section>

      <section id="skills" className="section card fade-up delay-2">
        <h2>Technical Stack</h2>
        <div className="skills-grid">
          <div className="skill-block"><h3>Programming Languages</h3><p>JavaScript, Python, Java, PHP</p></div>
          <div className="skill-block"><h3>Frontend</h3><p>React, JavaScript, HTML, CSS</p></div>
          <div className="skill-block"><h3>Backend</h3><p>Node.js, Express, REST APIs</p></div>
          <div className="skill-block"><h3>Data</h3><p>MongoDB, SQL, Data Modeling</p></div>
          <div className="skill-block"><h3>Mobile</h3><p>React Native, Responsive UX</p></div>
          <div className="skill-block"><h3>Tools</h3><p>Git, GitHub, VS Code</p></div>
          <div className="skill-block"><h3>Professional</h3><p>Team Collaboration, Communication, Problem Solving</p></div>
        </div>
      </section>

      <section id="projects" className="section card fade-up delay-3">
        <h2>Featured Projects</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <p className="project-tag">{project.type}</p>
              <h3>{project.title}</h3>
              <p><strong>Challenge:</strong> {project.challenge}</p>
              <p><strong>Solution:</strong> {project.solution}</p>
              <p><strong>Impact:</strong> {project.impact}</p>
              <div className="chip-row">
                {project.stack.map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noreferrer">View repository</a>
            </article>
          ))}
        </div>
      </section>

      <section id="credentials" className="section card fade-up delay-4">
        <h2>Education & Credentials</h2>
        <div className="education-card">
          <div>
            <h3>University of Mpumalanga</h3>
            <p>Diploma in ICT in Application Development</p>
          </div>
          <span>Completed</span>
        </div>
        <ul className="cert-list">
          <li>IBM Data Science Tools</li>
          <li>IBM Data Science 101</li>
          <li>FNB App Academy Certificate</li>
          <li>Hackathon Participation (MAISH)</li>
          <li>Privacy for Students (Cybersecurity Awareness)</li>
        </ul>
      </section>

      <section id="contact" className="section card fade-up delay-5">
        <h2>Contact</h2>
        <p>Open to graduate roles, freelance projects, and collaborative product builds.</p>
        <form className="contact-form" onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

          <label htmlFor="message">Project Brief</label>
          <textarea id="message" name="message" rows="5" value={form.message} onChange={onChange} required />

          <button type="submit" className="primary-button" disabled={submitState.status === 'sending'}>
            {submitState.status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {submitState.status !== 'idle' ? (
            <p className={`form-status ${submitState.status}`}>{submitState.message}</p>
          ) : null}
        </form>
      </section>
    </div>
  );
}

export default App;
