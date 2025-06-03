# Enhanced Picture Elements Card

Um card customizado avançado para Home Assistant que estende o `picture-elements` com editor visual e recursos profissionais.

## ✨ Recursos

- 🎨 **Editor Visual** - Configure elementos arrastando e soltando
- 🔘 **Switches Modernos** - Design elegante com animações
- 📝 **Captions Avançados** - Personalização completa de textos
- 🎭 **Múltiplos Temas** - Dark, Glass, Neon, Minimal
- 👆 **Suporte a Gestos** - Controle por swipe
- 📱 **Design Responsivo** - Otimizado para mobile

## 📦 Instalação

Após instalar via HACS:

1. Adicione um novo card
2. Procure por "Enhanced Picture Elements Card"
3. Use o editor visual para configurar

## 💡 Exemplo

```yaml
type: custom:enhanced-picture-elements-card-pro
title: "Minha Casa"
image: "/local/floorplan.png"
elements:
  - type: switch
    entity: switch.living_room_light
    style:
      left: "50%"
      top: "30%"
    caption:
      text: "Sala"
```

## 🔗 Links

- [Documentação Completa](https://github.com/SEU_USUARIO/enhanced-picture-elements-card)
- [Exemplos e Tutoriais](https://github.com/SEU_USUARIO/enhanced-picture-elements-card#exemplos)
- [Reportar Issues](https://github.com/SEU_USUARIO/enhanced-picture-elements-card/issues)
