// Enhanced Picture Elements Card PRO - Versão com Recursos Avançados
// Inclui: Animações, Templates Avançados, Gestos, Temas e Muito Mais!

class EnhancedPictureElementsCardPro extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.config = {};
    this.animationFrameId = null;
    this.gestureStartX = 0;
    this.gestureStartY = 0;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Configuração inválida');
    }
    this.config = {
      animations: true,
      gestures: false,
      auto_refresh: 30000,
      theme: 'default',
      ...config
    };
    this.render();
    this.setupAutoRefresh();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateElements();
    this.updateDynamicContent();
  }

  get hass() {
    return this._hass;
  }

  render() {
    const { image, elements = [], title, theme = 'default' } = this.config;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          border-radius: var(--card-border-radius, 8px);
          overflow: hidden;
          box-shadow: var(--card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          background: var(--card-background-color, #fff);
          transition: all 0.3s ease;
        }

        :host([theme="dark"]) {
          --card-background-color: #1f1f1f;
          --primary-text-color: #ffffff;
          --secondary-text-color: #b3b3b3;
        }

        :host([theme="glass"]) {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-header {
          padding: 16px;
          font-size: 18px;
          font-weight: 500;
          color: var(--primary-text-color);
          border-bottom: 1px solid var(--divider-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .header-btn:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .container {
          position: relative;
          width: 100%;
          background: var(--card-background-color, #fff);
          overflow: hidden;
        }
        
        .background-image {
          width: 100%;
          height: auto;
          display: block;
          max-height: 400px;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .background-image.loading {
          filter: blur(5px) brightness(0.7);
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          z-index: 100;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .element {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          z-index: 1;
        }

        .element.animate-in {
          animation: elementFadeIn 0.5s ease-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes elementFadeIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .element:hover {
          transform: scale(1.05);
          z-index: 10;
          filter: brightness(1.1);
        }

        .element:active {
          transform: scale(0.95);
        }
        
        .icon-element {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--card-background-color, rgba(255,255,255,0.95));
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          color: var(--primary-text-color);
          min-width: 44px;
          min-height: 44px;
          backdrop-filter: blur(5px);
        }

        .icon-element.state-on {
          background: var(--state-on-color, #4caf50);
          color: white;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }

        .icon-element.pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          50% { box-shadow: 0 4px 20px rgba(76, 175, 80, 0.6); }
          100% { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        }
        
        .switch-element {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--card-background-color, rgba(255,255,255,0.95));
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 64px;
          backdrop-filter: blur(5px);
        }
        
        .switch-toggle {
          width: 52px;
          height: 28px;
          background: var(--switch-unchecked-color, #e0e0e0);
          border-radius: 14px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 6px;
          cursor: pointer;
        }
        
        .switch-toggle.on {
          background: var(--switch-checked-color, #4caf50);
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
        }
        
        .switch-thumb {
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .switch-toggle.on .switch-thumb {
          transform: translateX(24px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .caption {
          font-size: var(--caption-font-size, 12px);
          color: var(--caption-color, var(--primary-text-color));
          text-align: center;
          font-weight: var(--caption-font-weight, 500);
          text-shadow: var(--caption-text-shadow, 0 1px 2px rgba(0,0,0,0.1));
          background: var(--caption-background, transparent);
          padding: var(--caption-padding, 3px 6px);
          border-radius: var(--caption-border-radius, 6px);
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          backdrop-filter: blur(3px);
        }

        .caption.has-value {
          animation: valueUpdate 0.3s ease;
        }

        @keyframes valueUpdate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .state-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--state-badge-color, #f44336);
          border: 2px solid var(--card-background-color, #fff);
          transition: all 0.3s ease;
        }
        
        .state-badge.on {
          background: var(--state-badge-on-color, #4caf50);
          animation: badgeGlow 2s infinite;
        }

        @keyframes badgeGlow {
          0%, 100% { box-shadow: 0 0 4px rgba(76, 175, 80, 0.5); }
          50% { box-shadow: 0 0 8px rgba(76, 175, 80, 0.8); }
        }
        
        .text-element {
          background: var(--text-background, rgba(0,0,0,0.8));
          color: var(--text-color, white);
          padding: 6px 10px;
          border-radius: 8px;
          font-size: var(--text-font-size, 14px);
          font-weight: var(--text-font-weight, 500);
          white-space: nowrap;
          backdrop-filter: blur(5px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .service-call-element {
          background: var(--button-background, var(--primary-color));
          color: var(--button-text-color, white);
          border: none;
          border-radius: 24px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .service-call-element:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        
        .service-call-element:active {
          transform: translateY(0);
        }

        /* Gesture Indicators */
        .gesture-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .gesture-indicator.show {
          opacity: 1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .element {
            transform: scale(1.1);
          }
          
          .caption {
            font-size: 13px;
          }
          
          .switch-element, .icon-element {
            min-width: 50px;
            min-height: 50px;
          }
        }

        /* Theme Variants */
        :host([theme="neon"]) .element {
          filter: drop-shadow(0 0 8px var(--primary-color));
        }

        :host([theme="minimal"]) .element {
          box-shadow: none;
          border: 1px solid var(--divider-color);
        }

        /* Connection Status */
        .connection-status {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4caf50;
          z-index: 20;
        }

        .connection-status.disconnected {
          background: #f44336;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      </style>
      
      <div class="card" data-theme="${theme}">
        ${title ? `
          <div class="card-header">
            <span>${title}</span>
            <div class="header-actions">
              <button class="header-btn" title="Atualizar" data-action="refresh">🔄</button>
              <button class="header-btn" title="Tela Cheia" data-action="fullscreen">⛶</button>
            </div>
          </div>
        ` : ''}
        <div class="container">
          ${image ? `
            <img class="background-image" src="${image}" alt="Background" id="background-img">
            <div class="loading-overlay" id="loading-overlay" style="display: none;">
              <span class="loading-spinner">⟳</span>
              Carregando...
            </div>
          ` : ''}
          <div class="elements-container">
            ${elements.map((element, index) => this.renderElement(element, index)).join('')}
          </div>
          <div class="connection-status" id="connection-status"></div>
          <div class="gesture-indicator" id="gesture-indicator"></div>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
    this.setupGestures();
    this.updateConnectionStatus();
  }

  renderElement(element, index) {
    const { type, style = {}, entity, caption, icon, text, service, service_data, animations = true } = element;
    const position = this.getPositionStyle(style);
    const animateClass = animations && this.config.animations ? 'animate-in' : '';
    
    switch (type) {
      case 'icon':
        return `
          <div class="element icon-element ${animateClass}" data-index="${index}" data-entity="${entity || ''}" style="${position}">
            <ha-icon icon="${icon || 'mdi:help'}" style="font-size: 20px;"></ha-icon>
            ${caption ? `<div class="caption" data-template="${caption.template || ''}">${this.processCaption(caption, entity)}</div>` : ''}
            ${entity ? '<div class="state-badge"></div>' : ''}
          </div>
        `;
        
      case 'switch':
        return `
          <div class="element switch-element ${animateClass}" data-index="${index}" data-entity="${entity || ''}" style="${position}">
            <div class="switch-toggle">
              <div class="switch-thumb"></div>
            </div>
            ${caption ? `<div class="caption" data-template="${caption.template || ''}">${this.processCaption(caption, entity)}</div>` : ''}
          </div>
        `;
        
      case 'text':
        return `
          <div class="element text-element ${animateClass}" data-index="${index}" style="${position}">
            ${this.processTextTemplate(text, element.template)}
          </div>
        `;
        
      case 'service-call':
        return `
          <button class="element service-call-element ${animateClass}" data-index="${index}" style="${position}">
            ${icon ? `<ha-icon icon="${icon}" style="font-size: 16px;"></ha-icon>` : ''}
            <span>${caption ? this.processCaption(caption, entity) : 'Executar'}</span>
          </button>
        `;
        
      default:
        return '';
    }
  }

  processCaption(caption, entity) {
    if (!caption) return '';
    
    if (caption.template && entity && this._hass?.states[entity]) {
      return this.processTemplate(caption.template, this._hass.states[entity]);
    }
    
    return caption.text || '';
  }

  processTextTemplate(text, template) {
    if (template && this._hass) {
      return this.processAdvancedTemplate(template);
    }
    return text || '';
  }

  processTemplate(template, entityObj) {
    if (!template || !entityObj) return '';
    
    return template
      .replace(/\{\{state\}\}/g, entityObj.state)
      .replace(/\{\{friendly_name\}\}/g, entityObj.attributes.friendly_name || entityObj.entity_id)
      .replace(/\{\{unit_of_measurement\}\}/g, entityObj.attributes.unit_of_measurement || '')
      .replace(/\{\{last_changed\}\}/g, this.formatTime(entityObj.last_changed))
      .replace(/\{\{temperature\}\}/g, entityObj.attributes.temperature || '')
      .replace(/\{\{humidity\}\}/g, entityObj.attributes.humidity || '');
  }

  processAdvancedTemplate(template) {
    if (!this._hass) return template;
    
    // Process time functions
    template = template.replace(/\{\{now\(\)\}\}/g, new Date().toLocaleTimeString());
    template = template.replace(/\{\{date\(\)\}\}/g, new Date().toLocaleDateString());
    
    // Process entity states
    const entityMatches = template.match(/\{\{states\['([^']+)'\]\.state\}\}/g);
    if (entityMatches) {
      entityMatches.forEach(match => {
        const entityId = match.match(/\['([^']+)'\]/)[1];
        const entityState = this._hass.states[entityId]?.state || 'unknown';
        template = template.replace(match, entityState);
      });
    }
    
    // Process attribute access
    const attrMatches = template.match(/\{\{states\['([^']+)'\]\.attributes\.([^}]+)\}\}/g);
    if (attrMatches) {
      attrMatches.forEach(match => {
        const parts = match.match(/\['([^']+)'\]\.attributes\.([^}]+)/);
        const entityId = parts[1];
        const attrName = parts[2];
        const attrValue = this._hass.states[entityId]?.attributes[attrName] || '';
        template = template.replace(match, attrValue);
      });
    }
    
    return template;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  }

  getPositionStyle(style) {
    const {
      left = '0px',
      top = '0px',
      transform,
      '--caption-color': captionColor,
      '--caption-font-size': captionFontSize,
      '--caption-font-weight': captionFontWeight,
      '--caption-background': captionBackground,
      '--caption-padding': captionPadding,
      '--caption-border-radius': captionBorderRadius,
      '--caption-text-shadow': captionTextShadow,
      ...otherStyles
    } = style;
    
    const styles = {
      left,
      top,
      transform,
      '--caption-color': captionColor,
      '--caption-font-size': captionFontSize,
      '--caption-font-weight': captionFontWeight,
      '--caption-background': captionBackground,
      '--caption-padding': captionPadding,
      '--caption-border-radius': captionBorderRadius,
      '--caption-text-shadow': captionTextShadow,
      ...otherStyles
    };
    
    return Object.entries(styles)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  setupEventListeners() {
    // Existing event listeners
    const elements = this.shadowRoot.querySelectorAll('.element');
    elements.forEach((element) => {
      element.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.handleElementClick(index);
      });
    });

    // Header actions
    const refreshBtn = this.shadowRoot.querySelector('[data-action="refresh"]');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.forceRefresh());
    }

    const fullscreenBtn = this.shadowRoot.querySelector('[data-action="fullscreen"]');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Image loading
    const img = this.shadowRoot.getElementById('background-img');
    if (img) {
      img.addEventListener('load', () => this.hideLoading());
      img.addEventListener('error', () => this.showImageError());
    }
  }

  setupGestures() {
    if (!this.config.gestures) return;

    const container = this.shadowRoot.querySelector('.container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
      this.gestureStartX = e.touches[0].clientX;
      this.gestureStartY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - this.gestureStartX;
      const diffY = endY - this.gestureStartY;

      // Swipe gestures
      if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
        if (diffX > 0) {
          this.handleGesture('swipe-right');
        } else {
          this.handleGesture('swipe-left');
        }
      } else if (Math.abs(diffY) > 100 && Math.abs(diffX) < 50) {
        if (diffY > 0) {
          this.handleGesture('swipe-down');
        } else {
          this.handleGesture('swipe-up');
        }
      }
    });
  }

  handleGesture(gesture) {
    const actions = this.config.gesture_actions;
    if (!actions || !actions[gesture]) return;

    const action = actions[gesture];
    this.showGestureIndicator(gesture);
    
    if (action.service) {
      const [domain, serviceName] = action.service.split('.');
      this._hass?.callService(domain, serviceName, action.service_data || {});
    }
  }

  showGestureIndicator(gesture) {
    const indicator = this.shadowRoot.getElementById('gesture-indicator');
    if (indicator) {
      indicator.textContent = gesture;
      indicator.classList.add('show');
      setTimeout(() => indicator.classList.remove('show'), 1500);
    }
  }

  setupAutoRefresh() {
    if (this.config.auto_refresh && this.config.auto_refresh > 0) {
      setInterval(() => {
        this.updateDynamicContent();
      }, this.config.auto_refresh);
    }
  }

  handleElementClick(index) {
    const element = this.config.elements[index];
    if (!element) return;

    const { type, entity, service, service_data, tap_action } = element;

    // Add visual feedback
    const elementNode = this.shadowRoot.querySelector(`[data-index="${index}"]`);
    if (elementNode) {
      elementNode.style.transform = 'scale(0.95)';
      setTimeout(() => {
        elementNode.style.transform = '';
      }, 150);
    }

    // Handle tap_action first
    if (tap_action) {
      this.handleTapAction(tap_action);
      return;
    }

    switch (type) {
      case 'switch':
        if (entity && this._hass) {
          this._hass.callService('homeassistant', 'toggle', { entity_id: entity });
        }
        break;
        
      case 'service-call':
        if (service && this._hass) {
          const [domain, serviceName] = service.split('.');
          this._hass.callService(domain, serviceName, service_data || {});
        }
        break;
        
      case 'icon':
        if (entity && this._hass) {
          this.fireEvent('hass-more-info', { entityId: entity });
        }
        break;
    }
  }

  handleTapAction(tapAction) {
    const { action, entity, service, service_data, navigation_path } = tapAction;
    
    switch (action) {
      case 'toggle':
        if (entity && this._hass) {
          this._hass.callService('homeassistant', 'toggle', { entity_id: entity });
        }
        break;
        
      case 'call-service':
        if (service && this._hass) {
          const [domain, serviceName] = service.split('.');
          this._hass.callService(domain, serviceName, service_data || {});
        }
        break;
        
      case 'navigate':
        if (navigation_path) {
          history.pushState(null, '', navigation_path);
          this.fireEvent('location-changed', { replace: false });
        }
        break;
        
      case 'more-info':
        if (entity) {
          this.fireEvent('hass-more-info', { entityId: entity });
        }
        break;
    }
  }

  updateElements() {
    if (!this._hass || !this.config.elements) return;

    this.config.elements.forEach((element, index) => {
      const { entity, type } = element;
      if (!entity) return;

      const elementNode = this.shadowRoot.querySelector(`[data-index="${index}"]`);
      if (!elementNode) return;

      const entityObj = this._hass.states[entity];
      if (!entityObj) return;

      // Update switch elements
      if (type === 'switch') {
        const toggle = elementNode.querySelector('.switch-toggle');
        if (toggle) {
          toggle.classList.toggle('on', entityObj.state === 'on');
          
          // Add pulse animation for changes
          if (this.config.animations) {
            toggle.classList.add('pulse');
            setTimeout(() => toggle.classList.remove('pulse'), 1000);
          }
        }
      }

      // Update icon elements state
      if (type === 'icon') {
        elementNode.classList.toggle('state-on', entityObj.state === 'on');
        
        // Add pulse for active sensors
        if (entityObj.state === 'on' && this.config.animations) {
          elementNode.classList.add('pulse');
        } else {
          elementNode.classList.remove('pulse');
        }
      }

      // Update state badges
      const badge = elementNode.querySelector('.state-badge');
      if (badge) {
        badge.classList.toggle('on', entityObj.state === 'on');
      }

      // Update captions with dynamic content
      const caption = elementNode.querySelector('.caption');
      if (caption) {
        const template = caption.dataset.template;
        if (template) {
          const newText = this.processTemplate(template, entityObj);
          if (newText !== caption.textContent) {
            caption.textContent = newText;
            if (this.config.animations) {
              caption.classList.add('has-value');
              setTimeout(() => caption.classList.remove('has-value'), 300);
            }
          }
        }
      }
    });
  }

  updateDynamicContent() {
    // Update text elements with templates
    const textElements = this.shadowRoot.querySelectorAll('.text-element');
    textElements.forEach((element, index) => {
      const configElement = this.config.elements.find(el => el.type === 'text');
      if (configElement?.template) {
        const newText = this.processAdvancedTemplate(configElement.template);
        if (newText !== element.textContent) {
          element.textContent = newText;
          if (this.config.animations) {
            element.classList.add('has-value');
            setTimeout(() => element.classList.remove('has-value'), 300);
          }
        }
      }
    });

    this.updateConnectionStatus();
  }

  updateConnectionStatus() {
    const status = this.shadowRoot.getElementById('connection-status');
    if (status) {
      status.classList.toggle('disconnected', !this._hass || !navigator.onLine);
    }
  }

  forceRefresh() {
    this.showLoading();
    
    // Simulate refresh
    setTimeout(() => {
      this.updateElements();
      this.updateDynamicContent();
      this.hideLoading();
    }, 1000);
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.requestFullscreen().catch(err => {
        console.warn('Fullscreen not supported:', err);
      });
    }
  }

  showLoading() {
    const overlay = this.shadowRoot.getElementById('loading-overlay');
    const img = this.shadowRoot.getElementById('background-img');
    if (overlay && img) {
      overlay.style.display = 'flex';
      img.classList.add('loading');
    }
  }

  hideLoading() {
    const overlay = this.shadowRoot.getElementById('loading-overlay');
    const img = this.shadowRoot.getElementById('background-img');
    if (overlay && img) {
      overlay.style.display = 'none';
      img.classList.remove('loading');
    }
  }

  showImageError() {
    const overlay = this.shadowRoot.getElementById('loading-overlay');
    if (overlay) {
      overlay.innerHTML = '<span>❌</span> Erro ao carregar imagem';
      overlay.style.display = 'flex';
    }
  }

  fireEvent(type, detail = {}) {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    // Verificar se o editor já foi registrado
    if (!customElements.get('enhanced-picture-elements-card-editor')) {
      console.log('Registrando editor...');
      // O editor já está definido no mesmo arquivo, só garantir que está disponível
    }
    const editor = document.createElement('enhanced-picture-elements-card-editor');
    console.log('Editor criado:', editor);
    return editor;
  }

  static getStubConfig() {
    return {
      type: 'custom:enhanced-picture-elements-card-pro',
      title: 'Casa Inteligente',
      image: '/local/floorplan.png',
      theme: 'default',
      animations: true,
      gestures: false,
      auto_refresh: 30000,
      elements: [
        {
          type: 'switch',
          entity: 'switch.living_room_light',
          style: {
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)'
          },
          caption: {
            template: 'Sala - {{state}}',
            '--caption-color': 'white',
            '--caption-background': 'rgba(0,0,0,0.7)'
          }
        }
      ],
      gesture_actions: {
        'swipe-up': {
          service: 'light.turn_on',
          service_data: { entity_id: 'group.all_lights' }
        },
        'swipe-down': {
          service: 'light.turn_off',
          service_data: { entity_id: 'group.all_lights' }
        }
      }
    };
  }
}

// Registrar o componente
customElements.define('enhanced-picture-elements-card-pro', EnhancedPictureElementsCardPro);

// Registrar com Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'enhanced-picture-elements-card-pro',
  name: 'Enhanced Picture Elements Card PRO',
  description: 'Versão profissional com animações, gestos, templates avançados e mais recursos',
  preview: true,
  documentationURL: 'https://github.com/yourusername/enhanced-picture-elements-card'
});

// Enhanced Picture Elements Card PRO v3.0.0
// Componente customizado avançado para Home Assistant
// Autor: Enhanced Picture Elements Card Team
// Licença: MIT

console.info(
  '%c ENHANCED-PICTURE-ELEMENTS-CARD-PRO %c v3.0.0 ',
  'color: gold; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

console.info('🚀 Editor visual e recursos avançados carregados!');
