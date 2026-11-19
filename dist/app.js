'use strict';

// Progressive enhancement: project summaries remain readable without JavaScript.
document.documentElement.classList.add('js');
document.querySelector('#year').textContent = new Date().getFullYear();

const navigation = document.querySelector('#navigation');
const menuToggle = document.querySelector('.menu-toggle');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuToggle.focus();
  }
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = filter !== 'all' && project.dataset.category !== filter;
      if (!project.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
  });
});

const projects = {
  autopilot: {
    title: 'Autopilot AI', category: 'CREATOR TOOLS / LOCAL AI', status: 'PERSONAL PROJECT · V0.5',
    intro: 'A local-first workspace for turning raw footage into reviewed video drafts.',
    sections: [
      ['The idea', 'Bring drafting, media review and video assembly into a deliberate workflow, while keeping costs and publishing decisions under the creator’s control.'],
      ['What it does', 'Channel-scoped media previews, scene candidates, explainable clip ranking, creator-written caption cards and approved local MP4 draft assembly. A Next.js interface connects to FastAPI, SQLite and FFmpeg.'],
      ['Where it stands', 'V0.5 is a local development project. Automatic speech transcription, YouTube uploading and production-ready authentication are not implemented. Its source repository is currently private.']
    ], tags: ['Next.js', 'TypeScript', 'FastAPI', 'SQLite', 'FFmpeg']
  },
  jarvis: {
    title: 'Project JARVIS', category: 'LOCAL COMPUTING / EXPERIMENT', status: 'EARLY EXPLORATION',
    intro: 'Exploring what a personal AI assistant can do on a laptop, close to its owner.',
    sections: [
      ['The question', 'What would an assistant look like if local ownership, practical hardware limits and extensible skills shaped the design from the start?'],
      ['The exploration', 'An early personal project on a Windows laptop, focused on learning how models, memory and modular capabilities fit together.'],
      ['Where it stands', 'This is an exploration, not a finished autonomous assistant. Local models still have context, capability and hardware limits; running locally does not make intelligence unlimited.']
    ], tags: ['Local AI', 'Windows', 'Personal assistant', 'Prototyping']
  },
  omnitrix: {
    title: 'Omnitrix Simulator', category: 'CREATIVE CODING / INTERFACE', status: 'PERSONAL FAN EXPERIMENT',
    intro: 'A playful interface experiment inspired by a familiar childhood gadget.',
    sections: [
      ['The idea', 'Translate the feeling of a physical transformation device into a browser interface and a set of watch-face visual experiments.'],
      ['The focus', 'Explore a compact circular interface, distinctive visual states and playful interaction. A small project where the interface itself is the experiment.'],
      ['Where it stands', 'A personal, unofficial fan-made simulator and visual study. It is not affiliated with the original franchise and does not claim a working smartwatch hardware integration.']
    ], tags: ['HTML', 'CSS', 'JavaScript', 'Interface experiment']
  }
};
const dialog = document.querySelector('#project-dialog');
let dialogOpener = null;
function openProject(key, opener) {
  const project = projects[key];
  if (!project) return;
  dialogOpener = opener;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-intro').textContent = project.intro;
  document.querySelector('#dialog-status').textContent = project.status;
  const content = document.querySelector('#dialog-content');
  content.replaceChildren();
  project.sections.forEach(([heading, copy]) => {
    const section = document.createElement('section');
    section.className = 'dialog-block';
    const h3 = document.createElement('h3'); h3.textContent = heading;
    const p = document.createElement('p'); p.textContent = copy;
    section.append(h3, p); content.append(section);
  });
  const tags = document.createElement('div'); tags.className = 'dialog-tags';
  project.tags.forEach(tag => { const item = document.createElement('span'); item.textContent = tag; tags.append(item); });
  content.append(tags);
  dialog.showModal(); document.body.classList.add('modal-open');
  document.querySelector('#close-dialog').focus();
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (dialogOpener?.isConnected) dialogOpener.focus();
});
document.querySelector('#dialog-contact').addEventListener('click', () => {
  dialog.close();
  // Override focus restoration for a deliberate transition to the contact section.
  requestAnimationFrame(() => document.querySelector('.email-link').focus({preventScroll:true}));
});

document.querySelector('#copy-email').addEventListener('click', async () => {
  const feedback = document.querySelector('#copy-feedback');
  try {
    await navigator.clipboard.writeText(document.querySelector('.email-link').textContent.trim());
    feedback.textContent = 'Email copied. Let’s build something.';
  } catch {
    feedback.textContent = 'Copy isn’t available here. Select the email address above, or click it to open your mail app.';
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-ready'); observer.unobserve(entry.target);
      }
    });
  }, {threshold: .08});
  document.querySelectorAll('.project, .about-grid, .approach-grid').forEach(element => observer.observe(element));
}
