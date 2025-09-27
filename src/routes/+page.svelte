<script lang="ts">
  import { onMount } from 'svelte';
  
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
  
  // Tech stack data
  const techStack = [
    { name: 'Enterprise UX|', color: 'text-blue-9' },
    { name: 'React', color: 'text-blue-9' },
    { name: 'TypeScript', color: 'text-blue-9' },
    { name: 'Tailwind CSS', color: 'text-blue-9' },
    { name: 'SvelteKit', color: 'text-blue-9' },
    { name: '.NET Razor', color: 'text-blue-9' },
    { name: 'PHP', color: 'text-blue-9' },
    { name: 'SQL', color: 'text-blue-9' },
    { name: 'Rust', color: 'text-blue-9' },
    { name: 'Python', color: 'text-blue-9' },
    { name: 'VS Code', color: 'text-blue-9' },
    { name: 'Git', color: 'text-blue-9' },
    { name: 'Figma', color: 'text-blue-9' },
    { name: 'Neovim', color: 'text-blue-9' },
    { name: 'Photoshop', color: 'text-blue-9' },
    { name: 'UI/UX', color: 'text-blue-9' },
    { name: 'Design Systems', color: 'text-blue-9' }
  ];
  
  // Projects data
  const projects = [
    {
      id: 1,
      title: 'HR Time Management Dashboard',
      description: 'Complete redesign of legacy HR time tracking system for enterprise clients. Led UI/UX consistency review and implementation.',
      image: '/placeholder.svg?height=300&width=500',
      tags: ['.NET Razor', 'Tailwind CSS', 'JavaScript', 'SQL'],
      badge: 'Enterprise Project',
      badgeColor: 'bg-green-7 text-white',
      liveUrl: '#',
      sourceUrl: null
    },
    {
      id: 2,
      title: 'GFOS Attendance Tracking App',
      description: 'Award-winning attendance management solution. 1st Place GFOS Innovationsaward 2024, 2nd Place 2025.',
      image: '/placeholder.svg?height=300&width=500',
      tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'REST API'],
      badge: '1st Place 2024',
      badgeColor: 'bg-amber-7 text-white',
      liveUrl: null,
      sourceUrl: '#'
    },
    {
      id: 3,
      title: 'Enterprise UI Component Library',
      description: 'Scalable design system for HRTime applications. Ensures pixel-perfect consistency across all platforms.',
      image: '/placeholder.svg?height=300&width=500',
      tags: ['React', 'TypeScript', 'Storybook', 'Figma'],
      badge: 'Design System',
      badgeColor: 'bg-purple-7 text-white',
      liveUrl: '#',
      sourceUrl: null
    }
  ];
  
  // Color palette for design system
  const colorPalette = [
    { name: 'Primary', hex: '#4F46E5', color: 'bg-[#4F46E5]' },
    { name: 'Secondary', hex: '#0EA5E9', color: 'bg-[#0EA5E9]' },
    { name: 'Success', hex: '#10B981', color: 'bg-[#10B981]' },
    { name: 'Background', hex: '#FFFFFF', color: 'bg-white border border-grey-4' }
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
        // isTyping stays true — we just reset and continue
      }, 2000);
      return () => clearTimeout(id);
    }
  });
</script>

<div class="min-h-screen bg-background-1 text-grey-10 font-sans">
  <nav class="fixed top-0 left-0 right-0 z-50 bg-background-1/80 backdrop-blur-md border-b border-grey-4">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <button 
          onclick={() => scrollToSection('home')} 
          class="text-xl font-semibold text-blue-9 hover:text-blue-8 transition-colors"
        >
          Miguel Cadeddu
        </button>
        
        <div class="hidden md:flex items-center space-x-8">
          <button onclick={() => scrollToSection('home')} class="text-grey-9 hover:text-blue-9 transition-colors" aria-label="Home">Home</button>
          <button onclick={() => scrollToSection('projects')} class="text-grey-9 hover:text-blue-9 transition-colors" aria-label="Projects">Projects</button>
          <button onclick={() => scrollToSection('about')} class="text-grey-9 hover:text-blue-9 transition-colors" aria-label="About">About</button>
          <button onclick={() => scrollToSection('contact')} class="text-grey-9 hover:text-blue-9 transition-colors" aria-label="Contact">Contact</button>
          <button onclick={() => scrollToSection('design')} class="text-grey-9 hover:text-blue-9 transition-colors" aria-label="Design">Design</button>
        </div>
        
        <button 
          onclick={toggleDarkMode}
          class="p-2 rounded-lg bg-grey-2 hover:bg-grey-3 transition-colors"
          aria-label="Toggle dark mode"
        >
          {#if darkMode}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </nav>

  <section id="home" class="pt-24 pb-16 px-6">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-5xl md:text-7xl font-bold text-blue-9 mb-6 text-balance">
        Hi, I'm Miguel
      </h1>
      
      <p class="text-xl md:text-2xl text-grey-8 mb-8 max-w-4xl mx-auto text-balance">
        Fullstack Engineer & UI/UX Designer building smarter HR tools
      </p>
      
      <p class="text-lg text-grey-7 mb-12 max-w-3xl mx-auto text-pretty">
        Redesigning legacy systems at HRTime Software | GFOS Innovationsaward Winner (1st Place 2024, 2nd Place 2025) | CS Student @ Hochschule Bochum
      </p>
      
      <div class="bg-grey-2 rounded-lg p-6 mb-12 max-w-2xl mx-auto border border-grey-4">
        <div class="flex items-center mb-4">
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-7"></div>
            <div class="w-3 h-3 rounded-full bg-amber-7"></div>
            <div class="w-3 h-3 rounded-full bg-green-7"></div>
          </div>
          <span class="ml-4 text-sm text-grey-7 font-mono">tech-stack</span>
        </div>
        
        <div class="text-left font-mono text-sm">
            <div>
            <span class="text-grey-7">></span> 
            {currentText}
            <span 
                class="ml-0.5 inline-block w-0.5 h-4 bg-blue-9 animate-pulse"
                aria-hidden="true"
            ></span>
            </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onclick={() => scrollToSection('projects')}
          class="px-8 py-3 bg-blue-9 text-white rounded-lg hover:bg-blue-8 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Projects
        </button>
        
        <button class="px-8 py-3 border border-grey-4 text-grey-9 rounded-lg hover:bg-grey-2 transition-colors flex items-center gap-2" aria-label="Download CV">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CV
        </button>
      </div>
      
      <div class="flex justify-center space-x-6 mt-8">
        <a href="https://www.linkedin.com/in/miguelcadeddu/" class="text-grey-7 hover:text-blue-9 transition-colors" aria-label="LinkedIn">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="https://github.com/miguelcadeddu" class="text-grey-7 hover:text-blue-9 transition-colors" aria-label="GitHub">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/miguelcadeddu/" class="text-grey-7 hover:text-blue-9 transition-colors" aria-label="Instagram">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </div>
  </section>

  <section id="projects" class="py-16 px-6 bg-background-2">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-blue-9 mb-6 text-balance">
          Featured Projects & Real-World Impact
        </h2>
        <p class="text-xl text-grey-8 max-w-3xl mx-auto text-pretty">
          Enterprise-grade applications and award-winning solutions built with modern technologies and design principles.
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each projects as project}
          <div class="bg-background-1 rounded-lg border border-grey-4 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
              <img 
                src={project.image || "/placeholder.svg"} 
                alt={project.title}
                class="w-full h-48 object-cover"
              />
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-xs font-medium rounded-full {project.badgeColor}">
                  {project.badge}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-semibold text-grey-10 mb-3 text-balance">
                {project.title}
              </h3>
              
              <p class="text-grey-8 mb-4 text-pretty">
                {project.description}
              </p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                {#each project.tags as tag}
                  <span class="px-3 py-1 text-xs bg-blue-9 text-white rounded-full">
                    {tag}
                  </span>
                {/each}
              </div>
              
              <div class="flex gap-3">
                {#if project.liveUrl}
                  <a 
                    href={project.liveUrl}
                    class="flex items-center gap-2 px-4 py-2 bg-blue-9 text-white rounded-lg hover:bg-blue-8 transition-colors text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live
                  </a>
                {/if}
                
                {#if project.sourceUrl}
                  <a 
                    href={project.sourceUrl}
                    class="flex items-center gap-2 px-4 py-2 border border-grey-4 text-grey-9 rounded-lg hover:bg-grey-2 transition-colors text-sm"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Source
                  </a>
                {/if}
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
        <h2 class="text-4xl md:text-5xl font-bold text-blue-9 mb-6 text-balance">
          About Me
        </h2>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div class="text-center lg:text-left">
          <div class="inline-block relative mb-6">
            <div class="w-48 h-48 bg-blue-9 rounded-lg flex items-center justify-center mx-auto lg:mx-0">
              <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 lg:left-4 lg:transform-none">
              <span class="px-3 py-1 bg-green-7 text-white text-sm rounded-full flex items-center gap-2">
                <div class="w-2 h-2 bg-white rounded-full"></div>
                Fachabitur 1.5 Average
              </span>
            </div>
          </div>
          
          <div class="space-y-4 text-grey-8">
            <p class="text-pretty">
              I'm a student full-stack engineer at <strong class="text-grey-10">HRTime Software</strong>, where I lead UI/UX overhauls for enterprise HR platforms. I review designs, gather customer feedback, and ensure pixel-perfect consistency across all applications.
            </p>
            
            <p class="text-pretty">
              Currently pursuing my Bachelor's in Computer Science at <strong class="text-grey-10">Hochschule Bochum</strong> while delivering award-winning solutions that impact thousands of enterprise users daily.
            </p>
            
            <div class="pt-4">
              <p class="text-sm text-grey-7">
                <strong>Previous Experience:</strong> 4-week internship at GFOS (March 2024)
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-2xl font-semibold text-blue-9 mb-8">Technical Expertise</h3>
          
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-grey-7 uppercase tracking-wide mb-3">FRONTEND</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.frontend as tech}
                  <span class="px-3 py-1 bg-blue-9 text-white text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-grey-7 uppercase tracking-wide mb-3">BACKEND</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.backend as tech}
                  <span class="px-3 py-1 bg-blue-9 text-white text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-grey-7 uppercase tracking-wide mb-3">TOOLS</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.tools as tech}
                  <span class="px-3 py-1 bg-blue-9 text-white text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-grey-7 uppercase tracking-wide mb-3">DESIGN</h4>
              <div class="flex flex-wrap gap-2">
                {#each expertise.design as tech}
                  <span class="px-3 py-1 bg-blue-9 text-white text-sm rounded-full">{tech}</span>
                {/each}
              </div>
            </div>
          </div>
          
          <div class="mt-8 p-6 bg-grey-2 rounded-lg border border-grey-4">
            <h4 class="text-lg font-semibold text-grey-10 mb-2">PHILOSOPHY</h4>
            <blockquote class="text-grey-8 italic text-pretty">
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
        <h2 class="text-4xl md:text-5xl font-bold text-blue-9 mb-6 text-balance">
          Design System
        </h2>
        <p class="text-xl text-grey-8 max-w-3xl mx-auto text-pretty">
          All UI components built for scalability and consistency — tested across HRTime's internal applications.
        </p>
      </div>
      
       Color Palette 
      <div class="mb-12">
        <h3 class="text-2xl font-semibold text-blue-9 mb-8">Professional Color Palette</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          {#each colorPalette as color}
            <div class="text-center">
              <div class="w-full h-24 rounded-lg mb-3 {color.color}"></div>
              <h4 class="font-medium text-grey-10 mb-1">{color.name}</h4>
              <p class="text-sm text-grey-7">{color.hex}</p>
            </div>
          {/each}
        </div>
      </div>
      
      <div>
        <h3 class="text-2xl font-semibold text-blue-9 mb-8">Component Library</h3>
        
        <div class="flex flex-wrap gap-4 mb-8">
          <button class="px-6 py-3 bg-blue-9 text-white rounded-lg hover:bg-blue-8 transition-colors">
            Primary
          </button>
          <button class="px-6 py-3 bg-blue-9 text-white rounded-lg hover:bg-blue-8 transition-colors">
            Secondary
          </button>
          <button class="px-6 py-3 border border-grey-4 text-grey-9 rounded-lg hover:bg-grey-2 transition-colors">
            Outline
          </button>
          <button class="px-6 py-3 text-grey-7 hover:text-grey-9 transition-colors">
            Ghost
          </button>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-background-1 p-6 rounded-lg border border-grey-4">
            <h4 class="text-lg font-semibold text-grey-10 mb-3">Enterprise Card</h4>
            <p class="text-grey-8 text-pretty">
              Consistent card styling with subtle shadows and rounded corners for professional applications.
            </p>
          </div>
          
          <div class="bg-blue-1 p-6 rounded-lg border border-blue-4">
            <h4 class="text-lg font-semibold text-blue-9 mb-3">Featured Card</h4>
            <p class="text-blue-8 text-pretty">
              Highlighted variant for important content and call-to-action sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="py-16 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-blue-9 mb-6 text-balance">
        Let's Build Something Amazing
      </h2>
      
      <p class="text-xl text-grey-8 mb-12 max-w-2xl mx-auto text-pretty">
        Ready to create enterprise-grade solutions that make a real impact? Let's discuss your next project.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <a 
          href="mailto:miguel@example.com"
          class="px-8 py-3 bg-blue-9 text-white rounded-lg hover:bg-blue-8 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Get In Touch
        </a>
        
        <a 
          href="https://www.linkedin.com/in/miguelcadeddu/"
          class="px-8 py-3 border border-grey-4 text-grey-9 rounded-lg hover:bg-grey-2 transition-colors flex items-center gap-2"
          aria-label="LinkedIn"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
      
      <div class="text-grey-7">
        <p>Currently available for freelance projects and full-time opportunities</p>
      </div>
    </div>
  </section>

  <footer class="py-8 px-6 border-t border-grey-4 bg-background-2">
    <div class="max-w-6xl mx-auto text-center">
      <p class="text-grey-7">
        © 2025 Miguel Cadeddu. Built with Svelte 5 and Tailwind CSS.
      </p>
    </div>
  </footer>
</div>
