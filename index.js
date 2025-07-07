/**
 * EDGE MACHINE - Script Completo para Página Inicial
 * 
 * Funcionalidades:
 * 1. Menu mobile responsivo com acessibilidade
 * 2. Sistema de tema claro/escuro persistente
 * 3. FAQ Accordion com respostas totalmente ocultas inicialmente
 * 4. Efeitos hover otimizados
 * 5. Botão "voltar ao topo" inteligente
 * 6. Animações performáticas
 * 7. Carregamento otimizado de recursos
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração inicial
  const config = {
    theme: {
      current: null,
      toggle: document.getElementById('theme-toggle'),
      storageKey: 'edge-machine-theme'
    },
    mobileMenu: {
      isOpen: false,
      button: document.querySelector('.mobile-menu-button'),
      menu: document.querySelector('.mobile-menu')
    },
    scroll: {
      backToTop: document.getElementById('back-to-top'),
      threshold: 300,
      scrollBehavior: 'smooth'
    },
    faq: {
      items: document.querySelectorAll('.faq-item')
    }
  };

  // ==================== GERENCIAMENTO DE TEMA ====================
  function initTheme() {
    // Verifica preferência do usuário ou sistema
    const preferredTheme = localStorage.getItem(config.theme.storageKey) || 
                         (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    // Aplica o tema
    applyTheme(preferredTheme);
    
    // Configura o toggle
    if (config.theme.toggle) {
      config.theme.toggle.addEventListener('click', toggleTheme);
      updateThemeIcon(preferredTheme);
    }
    
    // Observa mudanças no sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(config.theme.storageKey)) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(config.theme.storageKey, theme);
    config.theme.current = theme;
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    const newTheme = config.theme.current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function updateThemeIcon(theme) {
    if (!config.theme.toggle) return;
    
    const icon = config.theme.toggle.querySelector('i');
    if (!icon) return;
    
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    config.theme.toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'
    );
  }

  // ==================== MENU MOBILE ====================
  function initMobileMenu() {
    if (!config.mobileMenu.button || !config.mobileMenu.menu) return;
    
    // Evento de toggle
    config.mobileMenu.button.addEventListener('click', toggleMobileMenu);
    
    // Fecha ao clicar em links
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Fecha ao clicar fora ou pressionar ESC
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
  }

  function toggleMobileMenu() {
    config.mobileMenu.isOpen = !config.mobileMenu.isOpen;
    
    config.mobileMenu.button.setAttribute('aria-expanded', config.mobileMenu.isOpen);
    config.mobileMenu.menu.classList.toggle('active', config.mobileMenu.isOpen);
    document.body.style.overflow = config.mobileMenu.isOpen ? 'hidden' : '';
    
    // Anima o ícone
    config.mobileMenu.button.classList.toggle('active', config.mobileMenu.isOpen);
  }

  function closeMobileMenu() {
    if (!config.mobileMenu.isOpen) return;
    toggleMobileMenu();
  }

  function handleClickOutside(e) {
    if (config.mobileMenu.isOpen && 
        !config.mobileMenu.menu.contains(e.target) && 
        !config.mobileMenu.button.contains(e.target)) {
      closeMobileMenu();
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && config.mobileMenu.isOpen) {
      closeMobileMenu();
    }
  }

  // ==================== SCROLL E ANIMAÇÕES ====================
  function initScrollFeatures() {
    // Botão "voltar ao topo"
    if (config.scroll.backToTop) {
      window.addEventListener('scroll', throttle(handleScroll, 100));
      config.scroll.backToTop.addEventListener('click', scrollToTop);
    }
    
    // Observador de elementos para animações
    initIntersectionObserver();
  }

  function handleScroll() {
    const isVisible = window.pageYOffset > config.scroll.threshold;
    config.scroll.backToTop?.classList.toggle('visible', isVisible);
  }

  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: config.scrollBehavior
    });
  }

  function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observa elementos que devem ser animados
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }

  // ==================== FAQ ACCORDION ====================
  function initFAQAccordion() {
    if (!config.faq.items || config.faq.items.length === 0) return;
    
    config.faq.items.forEach(item => {
      const button = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (!button || !answer) return;
      
      // Configura estado inicial
      button.setAttribute('aria-expanded', 'false');
      answer.hidden = true;
      answer.style.maxHeight = '0';
      
      // Adiciona eventos
      button.addEventListener('click', () => toggleFAQItem(item, button, answer));
    });
  }

  function toggleFAQItem(item, button, answer) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Fecha todos os outros itens primeiro (comportamento de accordion)
    if (!isExpanded) {
      closeAllFAQItems();
    }
    
    // Alterna o item atual
    button.setAttribute('aria-expanded', !isExpanded);
    answer.hidden = isExpanded;
    
    if (isExpanded) {
      answer.style.maxHeight = '0';
      item.classList.remove('active');
    } else {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      item.classList.add('active');
    }
  }

  function closeAllFAQItems() {
    config.faq.items.forEach(item => {
      const button = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (button && answer) {
        button.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
        answer.style.maxHeight = '0';
        item.classList.remove('active');
      }
    });
  }

  // ==================== INTERAÇÕES ====================
  function initHoverEffects() {
    // Cards de destaques
    document.querySelectorAll('.highlight-card')?.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;
      
      card.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
      card.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
    });
    
    // Cards de depoimentos
    document.querySelectorAll('.testimonial-card')?.forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-5px)');
      card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
    
    // Botões
    document.querySelectorAll('.btn')?.forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
      btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
    });
  }

  // ==================== PERFORMANCE ====================
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  function preloadCriticalResources() {
    const resources = [
      'logohorizontal.png',
      'assets/ebook-destaque.jpg',
      'assets/ferramenta-destaque.jpg',
      'assets/webinar-destaque.jpg',
      'assets/cliente1.jpg',
      'assets/cliente2.jpg',
      'assets/cliente3.jpg'
    ];
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // ==================== INICIALIZAÇÃO ====================
  function init() {
    // Performance
    preloadCriticalResources();
    
    // Features
    initTheme();
    initMobileMenu();
    initScrollFeatures();
    initFAQAccordion();
    initHoverEffects();
    
    console.log('EDGE MACHINE - Página inicial carregada com sucesso');
  }

  // Inicia tudo
  init();
});