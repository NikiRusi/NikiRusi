//  Custom cursor 
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
});

//  Nav scroll 
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

//  Scroll reveal 
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

//  Populate content from data.json 
fetch('sub/data.json')
  .then(res => res.json())
  .then(data => {

    // Hero
    document.querySelector('.hero-tag').textContent = data.hero.tag;
    const [first, last] = data.hero.name.split(' ');
    document.querySelector('.hero-name').innerHTML = `${first}<br><em>${last}</em>`;
    document.querySelector('.hero-desc').textContent = data.hero.description;
    document.querySelector('.hero-bg-text').textContent = first.toUpperCase();
    // About
    const aboutText = document.querySelector('.about-text');
    data.about.paragraphs.forEach(p => {
      const el = document.createElement('p');
      el.textContent = p;
      aboutText.appendChild(el);
    });

    // Projects
    const grid = document.querySelector('.projects-grid');
    grid.innerHTML = '';
    data.projects.forEach((proj, i) => {
      const delays = ['reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];
      const card = document.createElement('div');
      card.className = `project-card reveal ${delays[i] || 'reveal-delay-2'}`;
      card.innerHTML = `
        <div class="project-num">${String(i + 1).padStart(2, '0')}</div>
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div class="project-tags">${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      `;
      grid.appendChild(card);
      // Re-observe newly created cards
      observer.observe(card);
      card.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
      });
    });

    // Skills
    const skillsLayout = document.querySelector('.skills-layout');
    skillsLayout.innerHTML = '';
    const delays = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];
    data.skills.forEach((group, i) => {
      const div = document.createElement('div');
      div.className = `skill-group reveal ${delays[i] || ''}`;
      div.innerHTML = `
        <h4>${group.category}</h4>
        <ul>${group.items.map(item => `<li>${item}</li>`).join('')}</ul>
      `;
      skillsLayout.appendChild(div);
      observer.observe(div);
    });

    // Contact
    document.querySelector('.contact-links').innerHTML = data.contact.links
      .map(l => `<a href="${l.url}" class="contact-link" ${l.external ? 'target="_blank"' : ''}>${l.label}</a>`)
      .join('');

    // Footer
    document.querySelector('.footer-year').textContent = `© ${data.footer.year} ${data.footer.name}`;
    document.querySelector('.footer-location').textContent = data.footer.location;

    // Re-bind cursor hover on new contact links
    document.querySelectorAll('.contact-link').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  })
  .catch(err => console.warn('Could not load data.json:', err));