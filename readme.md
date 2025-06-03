# Enhanced Picture Elements Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub Release](https://img.shields.io/github/release/SEU_USUARIO/enhanced-picture-elements-card.svg)](https://github.com/SEU_USUARIO/enhanced-picture-elements-card/releases)

**🏠 Transforme sua planta baixa em um dashboard interativo profissional!**

Um componente customizado para Home Assistant que revoluciona o controle domótico com editor visual, switches modernos e recursos avançados.

---

## ✨ Recursos Principais

### 🎨 **Editor Visual Completo**
- 🖱️ **Drag & Drop**: Mova elementos visualmente
- ⚡ **Tempo Real**: Veja mudanças instantaneamente  
- 📋 **Auto YAML**: Gera configuração automaticamente

### 🔘 **Elementos Avançados**
- **🔲 Switches Modernos**: Design elegante com animações
- **🔶 Ícones Inteligentes**: Indicadores de estado dinâmicos
- **📝 Textos Dinâmicos**: Templates que se atualizam automaticamente
- **🔘 Botões de Ação**: Execute serviços e automações
- **🏷️ Captions PRO**: Gradientes, sombras, bordas personalizadas

### 🌟 **Recursos PRO**
- **🎭 Temas**: Dark, Glass, Neon, Minimal
- **👆 Gestos**: Controle por swipe
- **📊 Templates Avançados**: Acesso a estados/atributos
- **🔄 Auto-refresh**: Atualização automática
- **📱 Mobile-First**: Otimizado para todos dispositivos

---

## 📦 Instalação

### 🎯 Via HACS (Recomendado)

1. **Abra HACS** → **Frontend**
2. **Menu ⋮** → **Repositórios personalizados**
3. **URL**: `https://github.com/SEU_USUARIO/enhanced-picture-elements-card`
4. **Categoria**: "Lovelace"
5. **Instalar** → **Reiniciar HA**

### 📁 Manual

1. Baixe `enhanced-picture-elements-card-pro.js`
2. Coloque em `/config/www/`
3. Adicione aos recursos:

```yaml
lovelace:
  resources:
    - url: /local/enhanced-picture-elements-card-pro.js
      type: module
```

---

## 🚀 Uso Rápido

### 1️⃣ Adicionar Card
**Dashboard** → **Adicionar Card** → **Enhanced Picture Elements Card**

### 2️⃣ Configurar Visualmente
1. 📷 **Adicione imagem** de fundo
2. ➕ **Clique botões** para adicionar elementos  
3. 🖱️ **Arraste** para posicionar
4. ⚙️ **Configure** propriedades
5. 📋 **Copie** configuração final

### 3️⃣ Exemplo Básico

```yaml
type: custom:enhanced-picture-elements-card-pro
title: "Minha Casa"
image: "/local/planta-casa.png"
theme: "glass"
elements:
  - type: switch
    entity: switch.sala_principal
    style:
      left: "30%"
      top: "40%"
    caption:
      text: "Sala Principal"
      "--caption-color": "white"
      "--caption-background": "rgba(0,0,0,0.8)"
```

---

## 🎨 Exemplos

<details>
<summary>🏠 Casa Completa</summary>

```yaml
type: custom:enhanced-picture-elements-card-pro
title: "Casa - Controle Geral"
image: "/local/planta-completa.png"
theme: "glass"
animations: true
elements:
  # Sala
  - type: switch
    entity: light.sala_principal
    style: { left: "25%", top: "40%" }
    caption:
      text: "Sala"
      "--caption-background": "linear-gradient(45deg, #2196f3, #21cbf3)"

  # Modo Cinema
  - type: service-call
    service: script.modo_cinema
    style: { left: "35%", top: "60%" }
    caption: { text: "🎬 Cinema" }
    icon: "mdi:movie"
```

</details>

<details>
<summary>🌡️ Sensores</summary>

```yaml
type: custom:enhanced-picture-elements-card-pro
title: "Monitoramento"
auto_refresh: 30000
elements:
  - type: text
    template: "🌡️ {{states['sensor.temperatura'].state}}°C"
    style:
      left: "20%"
      top: "30%"
      "--text-background": "rgba(76, 175, 80, 0.8)"
```

</details>

<details>
<summary>👆 Com Gestos</summary>

```yaml
type: custom:enhanced-picture-elements-card-pro
gestures: true
gesture_actions:
  swipe-up:
    service: light.turn_on
    service_data: { entity_id: group.todas_luzes }
  swipe-down:
    service: light.turn_off  
    service_data: { entity_id: group.todas_luzes }
```

</details>

---

## 🎭 Temas

```yaml
theme: "default"  # ou dark, glass, neon, minimal
```

| Tema | Descrição |
|------|-----------|
| `default` | Tema padrão claro |
| `dark` | Tema escuro elegante |
| `glass` | Efeito glassmorphism |
| `neon` | Efeitos neon vibrantes |
| `minimal` | Design minimalista |

---

## 🛠️ Solução de Problemas

**Card não aparece:**
- ✅ Arquivo em `/config/www/`
- ✅ Recurso no `configuration.yaml`
- ✅ Reiniciar Home Assistant
- ✅ Limpar cache (Ctrl+F5)

**Imagem não carrega:**
- ✅ Imagem em `/config/www/`
- ✅ URL: `/local/nome-imagem.png`
- ✅ Tamanho máx 5MB

**Elementos não respondem:**
- ✅ Entidades existem
- ✅ IDs corretos
- ✅ Testar em Developer Tools

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 🤝 Contribuindo

- 🐛 [Reportar Bug](https://github.com/SEU_USUARIO/enhanced-picture-elements-card/issues)
- 💡 [Sugerir Feature](https://github.com/SEU_USUARIO/enhanced-picture-elements-card/issues)
- ⭐ **Dê uma estrela** se foi útil!

---

<div align="center">

**🏠 Feito com ❤️ para a comunidade Home Assistant**

*Transformando casas em lares inteligentes*

</div>
