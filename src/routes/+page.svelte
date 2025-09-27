<script lang="ts">
  import { onMount } from 'svelte';
  import { Moon, Sun, Eye, Download, Github, Linkedin, Mail, ExternalLink, Code } from 'lucide-svelte';
  
  let darkMode = $state(false);
  let currentSection = 'home';
  
  onMount(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkMode = true;
    }
    updateTheme();
  });
  
  function updateTheme() {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    updateTheme();
  }

  function scrollToSection(sectionId: string) {
    currentSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Projects data
  const projects = [
    {
      id: 1,
      title: 'Ruhrpottmetaller Corporate Website',
      description: 'Complete Design and Development of the corporate website for Ruhrpottmetaller, a metal recycling company in Germany. Features a modern, responsive design with custom animations and SEO optimization.',
      images: ['/RuhrpottmetallerMockup-1.png'],
      tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'SEO'],
      badge: 'Freelance Project',
      badgeColor: 'bg-success text-foreground-primary',
      liveUrl: '#',
      sourceUrl: null
    },
    {
      id: 2,
      title: 'GFOS Attendance Tracking App',
      description: 'Award-winning attendance management solution. 1st Place GFOS Innovationsaward 2024, 2nd Place 2025.',
      images: ['/placeholder.svg?height=300&width=500'],
      tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'REST API'],
      badge: '1st Place 2024',
      badgeColor: 'bg-warning text-foreground-primary',
      liveUrl: null,
      sourceUrl: '#'
    },
    {
      id: 3,
      title: 'Orbit – Safe Meetup App',
      description: 'Flutter concept app for discovering and joining small verified meetups like coffee chats or night walks. Features a custom dark design system, map view, and built-in safety tools.',
      images: ['/OrbitMockup-1.webp', '/OrbitMockup-2.webp', '/OrbitMockup-3.webp', '/OrbitMockup-4.webp', '/OrbitMockup-5.webp', '/OrbitMockup-6.webp', '/OrbitMockup-7.webp', '/OrbitMockup-8.webp', '/OrbitMockup-9.webp', '/OrbitMockup-10.webp', '/OrbitMockup-11.webp', '/OrbitMockup-12.webp',],
      tags: ['Flutter', 'Dart', 'Figma', 'Firebase'],
      badge: 'Mobile App',
      badgeColor: 'bg-violet-400 text-foreground-primary',
      liveUrl: '#',
      sourceUrl: null
    }
  ];

  let currentImageIndex: Record<number, number> = {};
  projects.forEach(p => currentImageIndex[p.id] = 0);

  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;

  function startDrag(event: TouchEvent | MouseEvent, projectId: number) {
    isDragging = true;
    startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  }

  function onDrag(event: TouchEvent | MouseEvent, projectId: number) {
    if (!isDragging) return;
    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    currentTranslate = currentX - startX;
  }

  function endDrag(projectId: number, imagesLength: number) {
    isDragging = false;
    if (currentTranslate < -50) {
      currentImageIndex[projectId] = (currentImageIndex[projectId] + 1) % imagesLength;
    } else if (currentTranslate > 50) {
      currentImageIndex[projectId] = (currentImageIndex[projectId] - 1 + imagesLength) % imagesLength;
    }
    currentTranslate = 0;
  }
  
  

  
  const colorPalette = [
    // ── BRAND ────────────────────────────────────────────────
    {
      name: 'Primary',
      hexLight: '#4F46E5',
      hexDark:  '#6366F1',
      oklchLight: 'oklch(0.555 0.186 264.4)',
      oklchDark:  'oklch(0.674 0.140 304.99)',
      color: 'bg-primary',
      usage: 'Core brand violet for buttons, links, and key actions.'
    },
    {
      name: 'Primary Hover',
      hexLight: '#5A54F0',
      hexDark:  '#7C83F5',
      oklchLight: 'oklch(0.523 0.196 264.4)',
      oklchDark:  'oklch(0.5758 0.1825 301.72)',
      color: 'bg-primary-hover',
      usage: 'Hover/focus state slightly increases chroma to signal interactivity.'
    },

    // ── ACCENTS ──────────────────────────────────────────────
    {
      name: 'Secondary',
      hexLight: '#0EA5E9',
      hexDark:  '#38BDF8',
      oklchLight: 'oklch(0.7974 0.1631 129.8)',
      oklchDark:  'oklch(0.8434 0.1287 128.71)',
      color: 'bg-secondary',
      usage: 'Accent for highlights, secondary buttons, or links.'
    },
    {
      name: 'Success',
      hexLight: '#10B981',
      hexDark:  '#34D399',
      oklchLight: 'oklch(0.7706 0.1167 152.52)',
      oklchDark:  'oklch(0.7143 0.1457 150.93)',
      color: 'bg-success',
      usage: 'Positive feedback and confirmation states.'
    },
    {
      name: 'Warning',
      hexLight: '#FBBF24',
      hexDark:  '#FACC15',
      oklchLight: 'oklch(0.8429 0.11 74.6)',
      oklchDark:  'oklch(0.80 0.17 85)',
      color: 'bg-warning',
      usage: 'Non-critical alerts and attention banners.'
    },
    {
      name: 'Error',
      hexLight: '#EF4444',
      hexDark:  '#F87171',
      oklchLight: 'oklch(0.65 0.22 30)',
      oklchDark:  'oklch(0.70 0.20 30)',
      color: 'bg-error',
      usage: 'Critical errors or destructive actions.'
    },

    // ── BACKGROUND ───────────────────────────────────────────
    {
      name: 'Background 1',
      hexLight: '#FFFFFF',
      hexDark:  '#0D0D0D',
      oklchLight: 'oklch(1 0 0)',
      oklchDark:  'oklch(0.1448 0 0)',
      color: 'bg-background-1',
      usage: 'Main surface background. Slightly lighter in light mode, slightly darker in dark mode to provide subtle depth.'
    },
    {
      name: 'Background 2',
      hexLight: '#FBFBFB',
      hexDark:  '#000000',
      oklchLight: 'oklch(0.985 0 0)',
      oklchDark:  'oklch(0 0 0)',
      color: 'bg-background-2',
      usage: 'Secondary surface background. Provides contrast against background-1 for cards, modals, and sections.'
    }
  ];

  // Technical expertise
  const expertise = {
    frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'SvelteKit', 'React'],
    backend: ['.NET Razor', 'PHP', 'SQL', 'Rust', 'Python'],
    tools: ['VS Code', 'Git', 'Figma', 'Neovim'],
    design: ['Figma', 'Photoshop', 'UI/UX', 'Design Systems']
  };

  const phrases = [
    "Enterprise UX",
    ".NET Razor",
    "SvelteKit",
    "Tailwind CSS",
    "TypeScript"
  ];

  let currentText = $state('');
  let phraseIndex = $state(0);
  let charIndex = $state(0);
  let isTyping = $state(true);

  $effect(() => {
    // If we're paused, do nothing
    if (!isTyping) return;

    const currentPhrase = phrases[phraseIndex];

    // If we're still typing
    if (charIndex < currentPhrase.length) {
      const id = setTimeout(() => {
        charIndex += 1;
        currentText = currentPhrase.substring(0, charIndex);
      }, 80);
      return () => clearTimeout(id);
    } 
    // Done typing → pause for 2s, then reset
    else {
      const id = setTimeout(() => {
        currentText = '';
        charIndex = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        // isTyping stays true - we just reset and continue
      }, 2000);
      return () => clearTimeout(id);
    }
  });
</script>

<div class="min-h-screen bg-background-1 text-foreground-contrast font-sans">
  <nav class="fixed top-0 left-0 right-0 z-50 bg-background-1/80 backdrop-blur-md border-b border-border">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <button 
          onclick={() => scrollToSection('home')} 
          class="text-xl font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Miguel Cadeddu
        </button>
        
        <div class="hidden md:flex items-center space-x-8">
          <button onclick={() => scrollToSection('home')} class="text-foreground-muted hover:text-primary transition-colors" aria-label="Home">Home</button>
          <button onclick={() => scrollToSection('projects')} class="text-foreground-muted hover:text-primary transition-colors" aria-label="Projects">Projects</button>
          <button onclick={() => scrollToSection('about')} class="text-foreground-muted hover:text-primary transition-colors" aria-label="About">About</button>
          <button onclick={() => scrollToSection('contact')} class="text-foreground-muted hover:text-primary transition-colors" aria-label="Contact">Contact</button>
          <button onclick={() => scrollToSection('design')} class="text-foreground-muted hover:text-primary transition-colors" aria-label="Design">Design</button>
        </div>
        
        <button 
          onclick={toggleDarkMode}
          class="p-2 rounded-radius bg-grey-alpha-1 hover:bg-grey-alpha-2 transition-colors"
          aria-label="Toggle dark mode"
        >
          {#if darkMode}
            <Sun class="w-5 h-5" />
          {:else}
            <Moon class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  </nav>

  <section id="home" class="pt-24 pb-16 px-6">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">
        Hi, I'm Miguel
      </h1>
      
      <p class="text-xl md:text-2xl text-foreground-muted mb-8 max-w-4xl mx-auto text-balance">
        Fullstack Engineer & UI/UX Designer building smarter HR tools
      </p>
      
      <p class="text-lg text-foreground-muted mb-12 max-w-3xl mx-auto text-pretty">
        Redesigning legacy systems at HRTime Software | GFOS Innovationsaward Winner (1st Place 2024, 2nd Place 2025) | CS Student @ Hochschule Bochum
      </p>
      
      <div class="bg-grey-alpha-1 rounded-radius p-6 mb-12 max-w-2xl mx-auto border border-border">
        <div class="flex items-center mb-4">
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-destructive"></div>
            <div class="w-3 h-3 rounded-full bg-warning"></div>
            <div class="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <span class="ml-4 text-sm text-foreground-muted font-mono">tech-stack</span>
        </div>
        
        <div class="text-left font-mono text-sm">
            <div>
            <span class="text-primary">></span> 
            {currentText}
            <span 
                class="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse"
                aria-hidden="true"
            ></span>
            </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onclick={() => scrollToSection('projects')}
          class="px-8 py-3 bg-primary text-foreground-primary rounded-radius hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <Eye class="w-5 h-5" />
          View Projects
        </button>
        
        <button class="px-8 py-3 border border-border text-foreground-muted rounded-radius hover:bg-grey-alpha-1 transition-colors flex items-center gap-2" aria-label="Download CV">
          <Download class="w-5 h-5" />
          Download CV
        </button>
      </div>
      
      <div class="flex justify-center space-x-6 mt-8">
        <a href="https://github.com/azur1337" class="text-foreground-muted hover:text-primary transition-colors" aria-label="Githubds ">
          <Github class="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/in/azurdev/" class="text-foreground-muted hover:text-primary transition-colors" aria-label="LinkedIn">
          <Linkedin class="w-6 h-6" />
        </a>
        <a href="mailto:miguel@example.com" class="text-foreground-muted hover:text-primary transition-colors" aria-label="Mail">
           <Mail class="w-6 h-6" />
        </a>
      </div>
    </div>
  </section>

  <section class="py-16 px-6 bg-background-2">
    <div class="max-w-6xl mx-auto">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each projects as project (project.id)}
          <div class="bg-background-1 rounded-radius border border-border overflow-hidden">
            <!-- Image Carousel -->
            <div 
              class="relative overflow-hidden w-full h-48 cursor-grab"
              onmousedown={(e) => startDrag(e, project.id)}
              onmousemove={(e) => onDrag(e, project.id)}
              onmouseup={() => endDrag(project.id, project.images.length)}
              onmouseleave={() => isDragging && endDrag(project.id, project.images.length)}
              ontouchstart={(e) => startDrag(e, project.id)}
              ontouchmove={(e) => onDrag(e, project.id)}
              ontouchend={() => endDrag(project.id, project.images.length)}
            >
              <div
                class="flex w-full h-full transition-transform duration-300"
                style="transform: translateX(calc(-{currentImageIndex[project.id]} * 100% + {currentTranslate}px));"
              >
                {#each project.images as img, idx}
                  <img 
                    src={img} 
                    alt={project.title + ' image ' + (idx + 1)}
                    class="w-full flex-shrink-0 h-48 object-contain bg-grey-alpha-1 pointer-events-none"
                  />
                {/each}
              </div>

              <!-- Badge -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-xs font-medium rounded-full {project.badgeColor}">
                  {project.badge}
                </span>
              </div>

              <!-- Dots -->
              {#if project.images.length > 1}
                <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {#each project.images as _, idx}
                    <button
                      type="button"
                      class="w-3 h-3 rounded-full transition-colors"
                      class:bg-primary={currentImageIndex[project.id] === idx}
                      class:bg-grey-alpha-1={currentImageIndex[project.id] !== idx}
                      onclick={() => currentImageIndex[project.id] = idx}
                      aria-label={`Go to image ${idx + 1}`}
                    ></button>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Project Content -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-foreground-contrast mb-3">{project.title}</h3>
              <p class="text-foreground-muted mb-4">{project.description}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                {#each project.tags as tag}
                  <span class="px-3 py-1 text-xs bg-primary text-foreground-primary rounded-full">{tag}</span>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>


  <section id="about" class="py-16 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
          About Me
        </h2>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div class="text-center lg:text-left">
          <div class="inline-block relative mb-6">
            <div class="w-48 h-48 bg-primary rounded-radius flex items-center justify-center mx-auto lg:mx-0">
              <svg class="w-24 h-24 text-foreground-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 lg:left-4 lg:transform-none">
              <span class="px-3 py-2 bg-success text-foreground-primary text-sm rounded-full flex items-center gap-4">
                <div class="w-2 h-2 bg-foreground-contrast animate-pulse rounded-full"></div>
                Fachabitur 1.5 Average
              </span>
            </div>
          </div>
          
          <div class="space-y-4 text-foreground-muted">
            <p class="text-pretty">
              I'm a student full-stack engineer at <strong class="text-foreground-contrast">HRTime Software</strong>, where I lead UI/UX overhauls for enterprise HR platforms. I review designs, gather customer feedback, and ensure pixel-perfect consistency across all applications.
            </p>
            
            <p class="text-pretty">
              Currently pursuing my Bachelor's in Computer Science at <strong class="text-foreground-contrast">Hochschule Bochum</strong> while delivering award-winning solutions that impact thousands of enterprise users daily.
            </p>
            
            <div class="pt-4">
              <p class="text-sm text-foreground-muted">
                <strong>Previous Experience:</strong> 4-week internship at GFOS (March 2024)
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-2xl font-semibold text-primary mb-8">Technical Expertise</h3>
          
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-3">FRONTEND</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.frontend as tech}
                  <span class="px-3 py-1 bg-primary hover:bg-primary-hover text-foreground-primary text-sm rounded-full cursor-default">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-3">BACKEND</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.backend as tech}
                  <span class="px-3 py-1 bg-primary text-foreground-primary text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-3">TOOLS</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.tools as tech}
                  <span class="px-3 py-1 bg-primary text-foreground-primary text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-foreground-muted uppercase tracking-wide mb-3">DESIGN</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.design as tech}
                  <span class="px-3 py-1 bg-primary text-foreground-primary text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
          </div>
          
          <div class="mt-8 p-6 bg-grey-alpha-1 rounded-radius border border-border">
            <h4 class="text-lg font-semibold text-foreground-contrast mb-2">PHILOSOPHY</h4>
            <blockquote class="text-foreground-muted italic text-pretty">
              "Every pixel matters. Consistency is key. User experience drives business success."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="design" class="py-16 px-6 bg-background-2">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
          Design System
        </h2>
        <p class="text-xl text-foreground-muted max-w-3xl mx-auto text-pretty">
          Built on a modern <span class="font-semibold text-primary">OKLCH</span> color strategy for perceptual accuracy
          and scalable components. Every token is engineered with predictable lightness and chroma steps for
          flawless hover, active, and dark-mode behavior.
        </p>
      </div>

      <!-- 🌈 Advanced Color Palette -->
      <div class="mb-12">
        <h3 class="text-2xl font-semibold text-primary mb-8">OKLCH Color Palette</h3>
        <p class="text-foreground-muted mb-8 max-w-3xl mx-auto text-pretty">
          Colors are defined in <code class="text-primary">oklch(L C H)</code>, giving
          <strong>L</strong>ightness, <strong>C</strong>hroma, and <strong>H</strong>ue direct control.
          Interactive states tweak <em>C</em> or <em>L</em> to signal hover/active without changing perceived brightness.
          <br><br>
          Unlike standard <code>LCH</code>, <code>OKLCH</code> is perceptually uniform - equal steps in lightness and chroma appear consistent to the human eye, making it ideal for accessible UI design and dark/light mode transitions.
        </p>


        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {#each colorPalette as color}
            <div class="text-center">
              <!-- Color swatch -->
              <div
                class="w-full h-24 rounded-radius mb-3 border border-border hover:scale-105 transition-transform duration-150"
                style="background-color: {darkMode ? color.oklchDark : color.oklchLight}"
                title={`Light: ${color.oklchLight}\nDark: ${color.oklchDark}`}
              ></div>

              <!-- Color name & hex -->
              <h4 class="font-medium text-foreground-contrast mb-1">{color.name}</h4>
              <p class="text-sm text-foreground-muted mb-1">
                {darkMode ? color.hexDark : color.hexLight}
              </p>

              <!-- OKLCH values -->
              <p class="text-xs text-foreground-muted whitespace-pre-line">
                LCH: {darkMode ? color.oklchDark : color.oklchLight}
              </p>

              <!-- Usage description -->
              <p class="text-xs text-foreground-muted mt-1">{color.usage}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- ⚡ Component Library -->
      <div>
        <h3 class="text-2xl font-semibold text-primary mb-8">Component Library</h3>

        <p class="text-foreground-muted mb-8 max-w-3xl mx-auto text-pretty">
          Interactive states use chroma-stepped tokens. Hover increases saturation while
          active/pressed slightly darkens the lightness, keeping contrast stable and WCAG compliant.
        </p>

        <div class="flex flex-wrap gap-4 mb-8">
          <button class="px-6 py-3 bg-primary text-foreground-primary rounded-radius hover:bg-primary-hover transition-colors">
            Primary
          </button>
          <button class="px-6 py-3 bg-secondary text-foreground-primary rounded-radius hover:bg-secondary-hover transition-colors">
            Secondary
          </button>
          <button class="px-6 py-3 border border-border text-foreground-muted hover:text-foreground-contrast rounded-radius hover:bg-grey-1 transition-colors">
            Outline
          </button>
          <button class="px-6 py-3 text-foreground-muted hover:text-foreground-contrast transition-colors">
            Ghost
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-background-1 p-6 rounded-radius border border-border">
            <h4 class="text-lg font-semibold text-foreground-contrast mb-3">Enterprise Card</h4>
            <p class="text-foreground-muted text-pretty">
              Uses <code class="text-primary">--grey</code> scale in OKLCH for perfectly even lightness steps,
              ensuring consistent shadows across light/dark modes.
            </p>
          </div>

          <div class="bg-primary/20 p-6 rounded-radius border border-primary">
            <h4 class="text-lg font-semibold text-primary mb-3">Featured Card</h4>
            <p class="text-primary text-pretty">
              Demonstrates chroma-boosted primary with a constant lightness hover effect for
              eye-catching CTAs that remain accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>




  <section id="contact" class="py-16 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">
        Let's Build Something Amazing
      </h2>
      
      <p class="text-xl text-foreground-muted mb-12 max-w-2xl mx-auto text-pretty">
        Ready to create enterprise-grade solutions that make a real impact? Let's discuss your next project.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <a 
          href="mailto:miguel@example.com"
          class="px-8 py-3 bg-primary text-foreground-primary rounded-radius hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Get In Touch
        </a>
        
        <a 
          href="https://www.linkedin.com/in/miguelcadeddu/"
          class="px-8 py-3 border border-border text-foreground-muted rounded-radius hover:bg-grey-alpha-1 transition-colors flex items-center gap-2"
          aria-label="LinkedIn"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
      
      <div class="text-foreground-muted">
        <p>Currently available for freelance projects and full-time opportunities</p>
      </div>
    </div>
  </section>

  <footer class="py-8 px-6 border-t border-border bg-background-2">
    <div class="max-w-6xl mx-auto text-center">
      <p class="text-foreground-muted">
        © 2025 Miguel Cadeddu. Built with Svelte 5 and Tailwind CSS.
      </p>
    </div>
  </footer>
</div>
