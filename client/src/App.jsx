import { useEffect, useRef, useState } from 'react';
import profilePhoto from './img_8594.jpg';

const projects = [
  {
    title: 'CodeDojo Arcade',
    type: 'Gamified AI-Assisted Learning Platform',
    challenge: 'First-year students can get stuck learning programming without someone available to help right away.',
    solution: 'Created a platform for step-by-step Python and Java learning, automatic code grading, and Sensei AI hints that guide students without giving away solutions. Students can also turn PDF notes into summaries, flashcards, and quizzes, while lecturers track class progress, identify difficult lessons, export reports, and send announcements.',
    impact: 'Combines coding practice, personalized study tools, and gamified progress with lecturer insights, reducing the need to mark coding tasks manually.',
    stack: ['Python', 'Java', 'AI-assisted learning', 'Gamification'],
    link: 'https://ai-learning-assistant-two-gamma.vercel.app/login',
    linkText: 'Visit live app'
  },
  {
    title: 'NEXORA — Next-Generation Intelligent Home Automation',
    type: 'Real-Time Smart Home System',
    challenge: 'Homeowners need a smarter way to monitor and control connected devices, sensors, and home automation.',
    solution: 'Developed a FastAPI backend with environment-based configuration, health checks, real-time WebSockets, and PostgreSQL persistence using SQLAlchemy and Alembic. Optional MQTT integration supports physical-device commands, state, sensor readings, and availability. API-managed simulated lights, fans, and curtains persist state and broadcast updates; the project also includes a web dashboard, an Android-first Expo app, and NORA, an AI assistant.',
    impact: 'Brings device control, monitoring, automation, and AI assistance together. Physical ESP32 hardware is not included or tested.',
    stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'WebSockets', 'MQTT', 'Expo'],
    link: 'https://github.com/MethodPrince/NEXORA-Real-Time-Intelligent-Smart-Home-System.git'
  },
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

const getApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return '/api';
};

const CONTACT_FORM_NAME = 'portfolio-contact';

const encodeFormBody = (payload) =>
  Object.entries(payload)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

const postWithTimeout = async (url, options, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const submitWithNetlifyForm = async (form) => {
  const payload = {
    'form-name': CONTACT_FORM_NAME,
    name: form.name,
    email: form.email,
    message: form.message,
    'bot-field': ''
  };

  const response = await postWithTimeout(
    '/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodeFormBody(payload)
    },
    6000
  );

  if (!response.ok) {
    throw new Error('Unable to send your message right now. Please try again.');
  }

  return { ok: true };
};

const submitWithApi = async (form) => {
  const apiUrl = getApiUrl();
  const response = await postWithTimeout(
    `${apiUrl}/contact`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(form)
    },
    8000
  );

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const result = isJson
    ? await response.json()
    : {
        ok: false,
        error: 'Contact service is unavailable. Please restart the dev server and try again.'
      };

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Unable to send your message right now.');
  }

  return result;
};

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });
  const [selectedProject, setSelectedProject] = useState(null);
  const projectDialogRef = useRef(null);

  useEffect(() => {
    const dialog = projectDialogRef.current;
    if (!dialog) {
      return;
    }

    if (selectedProject && !dialog.open) {
      dialog.showModal();
    } else if (!selectedProject && dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: 'sending', message: 'Sending your message...' });

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      setSubmitState({
        status: 'error',
        message: 'Please fill in your name, email, and message.'
      });
      return;
    }

    try {
      if (import.meta.env.PROD) {
        await submitWithNetlifyForm(payload);
      } else {
        await submitWithApi(payload);
      }

      setForm({ name: '', email: '', message: '' });
      setSubmitState({ status: 'success', message: 'Message sent. I will reply by email soon.' });
    } catch (error) {
      const isTimeoutError = error?.name === 'AbortError';
      setSubmitState({
        status: 'error',
        message: isTimeoutError
          ? 'Sending took too long. Please try again in a moment.'
          : error.message || 'Failed to send message. Please try again later.'
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
            <a className="ghost-button" href="/Method-Prince-Mbowana-CV.pdf" download>
              Download CV
            </a>
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
              <p className="metric-value">NQF 7</p>
              <p className="metric-label">Advanced Diploma</p>
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
              <p className="project-summary">{project.challenge}</p>
              <div className="chip-row">
                {project.stack.slice(0, 4).map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
              <div className="project-card-actions">
                <button type="button" className="project-more-button" onClick={() => setSelectedProject(project)}>
                  More details
                </button>
                <a href={project.link} target="_blank" rel="noreferrer">
                  {project.linkText || 'View repository'}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <dialog
        ref={projectDialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject ? (
          <div className="project-dialog-content">
            <button
              type="button"
              className="project-dialog-close"
              onClick={() => projectDialogRef.current?.close()}
              aria-label="Close project details"
            >
              Close
            </button>
            <p className="project-tag">{selectedProject.type}</p>
            <h2 id="project-dialog-title">{selectedProject.title}</h2>
            <p><strong>Challenge:</strong> {selectedProject.challenge}</p>
            <p><strong>Solution:</strong> {selectedProject.solution}</p>
            <p><strong>Impact:</strong> {selectedProject.impact}</p>
            <div className="chip-row">
              {selectedProject.stack.map((item) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
            <a href={selectedProject.link} target="_blank" rel="noreferrer">
              {selectedProject.linkText || 'View repository'}
            </a>
          </div>
        ) : null}
      </dialog>

      <section id="credentials" className="section card fade-up delay-4">
        <h2>Education & Credentials</h2>
        <div className="education-card">
          <div>
            <h3>University of Mpumalanga</h3>
            <p>Advanced Diploma in ICT in Application Development (NQF Level 7)</p>
          </div>
          <span>Completed</span>
        </div>
        <div className="education-card">
          <div>
            <h3>University of Mpumalanga</h3>
            <p>Diploma in ICT in Application Development (NQF Level 6)</p>
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
        <div className="contact-details">
          <p><strong>Phone:</strong> <a href="tel:+27726173997">072 617 3997</a></p>
          <p><strong>Email:</strong> <a href="mailto:princembowana013@gmail.com">princembowana013@gmail.com</a></p>
          <p><strong>Relocation:</strong> Willing to relocate</p>
        </div>
        <form
          className="contact-form"
          name={CONTACT_FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
          <input type="hidden" name="bot-field" />

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
