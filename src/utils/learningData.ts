interface TimelineItemData {
  title: string
  content?: string
  video?: string
  dotColor: 'secondary' | 'primary'
}

interface LearningData {
  SCRUM: TimelineItemData[]
  PMBOK: TimelineItemData[]
}

// Array de datos de la timeline
export const learningData: LearningData = {
  SCRUM: [
    {
      title: 'Introducción a Scrum',
      content:
        'Scrum es un marco de trabajo ágil diseñado para facilitar la colaboración en proyectos complejos. Permite organizar el trabajo en ciclos cortos llamados sprints, lo cual optimiza la entrega continua de valor a través de la mejora constante y la adaptación a los cambios.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Conceptos Fundamentales de Scrum',
      video: 'https://www.youtube.com/embed/sLexw-z13Fo',
      dotColor: 'secondary'
    },
    {
      title: 'Roles en Scrum',
      content:
        'En Scrum, cada rol tiene funciones específicas que contribuyen al éxito del proyecto. El Product Owner representa los intereses del negocio, el Scrum Master facilita el proceso y asegura que el equipo siga las prácticas ágiles, y el Equipo de Desarrollo crea el producto.',
      dotColor: 'primary'
    },
    {
      title: 'Eventos en Scrum',
      content:
        'Los eventos de Scrum estructuran el trabajo y promueven la transparencia y la inspección. Estos incluyen la Planificación del Sprint, las reuniones diarias o Daily Standups, la Revisión del Sprint y la Retrospectiva del Sprint, que ayudan a mantener el enfoque y a mejorar continuamente el proceso.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Ciclo de un Sprint',
      video: 'https://www.youtube.com/embed/7yIZOOXZjaU',
      dotColor: 'secondary'
    },
    {
      title: 'Artefactos en Scrum',
      content:
        'Scrum cuenta con artefactos clave que garantizan la transparencia y el progreso. El Product Backlog es una lista priorizada de características y tareas, el Sprint Backlog contiene los elementos seleccionados para el sprint, y el Incremento es el resultado funcional que el equipo entrega al final de cada sprint.',
      dotColor: 'primary'
    },
    {
      title: 'Priorización y Adaptación',
      content:
        'Una de las principales ventajas de Scrum es su capacidad para adaptarse rápidamente a los cambios. La priorización continua del Product Backlog y las retrospectivas permiten que el equipo ajuste el rumbo del proyecto para maximizar el valor entregado y adaptarse a nuevas necesidades.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Ejemplos Prácticos de Equipos usando Scrum',
      video: 'https://www.youtube.com/embed/N6uXuaVRoY8',
      dotColor: 'secondary'
    },
    {
      title: 'Desafíos y Beneficios de Scrum',
      content:
        'Scrum ofrece numerosos beneficios, como mayor colaboración, adaptabilidad y enfoque en la entrega de valor. Sin embargo, también presenta desafíos, como la necesidad de disciplina y compromiso del equipo, y el reto de ajustar las prácticas ágiles a diferentes tipos de proyecto.',
      dotColor: 'primary'
    },
    {
      title: 'Conclusión',
      content:
        'Scrum es una metodología poderosa que permite a los equipos trabajar de forma efectiva y adaptable en entornos de alta complejidad. Su éxito depende de la comunicación, la transparencia y el compromiso del equipo, elementos que, cuando se aplican correctamente, facilitan una entrega continua de valor y mejora constante en el proyecto.',
      dotColor: 'primary'
    }
  ],
  PMBOK: [
    {
      title: 'Introducción a PMBOK',
      content:
        'PMBOK es un marco de gestión de proyectos desarrollado por el Project Management Institute (PMI). Su objetivo es proporcionar un conjunto estándar de mejores prácticas para ayudar a los equipos en la planificación, ejecución y cierre de proyectos complejos de manera eficaz.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Fundamentos de PMBOK',
      video: 'https://www.youtube.com/embed/ru6mmukL_6A',
      dotColor: 'secondary'
    },
    {
      title: 'Áreas de Conocimiento en PMBOK',
      content:
        'PMBOK abarca 10 áreas de conocimiento esenciales para la gestión de proyectos: integración, alcance, tiempo, costo, calidad, recursos humanos, comunicación, riesgo, adquisiciones y stakeholders. Estas áreas son pilares para estructurar el proyecto y asegurar el cumplimiento de sus objetivos.',
      dotColor: 'primary'
    },
    {
      title: 'Procesos de PMBOK',
      content:
        'Cada área de conocimiento en PMBOK se desglosa en procesos que abarcan desde la planificación y ejecución hasta el control y cierre. Estos procesos permiten a los equipos seguir un enfoque estructurado que mejora la eficiencia y la probabilidad de éxito del proyecto.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Áreas de Conocimiento en PMBOK',
      video: 'https://www.youtube.com/embed/IWxfAwS18Mc',
      dotColor: 'secondary'
    },
    {
      title: 'Ciclo de Vida del Proyecto según PMBOK',
      content:
        'PMBOK define el ciclo de vida de un proyecto en cinco fases: Inicio, Planificación, Ejecución, Monitoreo y Control, y Cierre. Cada fase representa un conjunto de actividades necesarias para llevar el proyecto desde la concepción hasta su finalización exitosa.',
      dotColor: 'primary'
    },
    {
      title: 'Adaptabilidad y Mejora Continua',
      content:
        'PMBOK enfatiza la importancia de la mejora continua y la adaptabilidad del plan del proyecto para cumplir con los requisitos cambiantes del entorno. Este enfoque garantiza que el proyecto se ajuste según las necesidades sin perder el control sobre los objetivos.',
      dotColor: 'primary'
    },
    {
      title: 'Video: Implementación Práctica de PMBOK',
      video: 'https://www.youtube.com/embed/Og7iI31kwPQ',
      dotColor: 'secondary'
    },
    {
      title: 'Beneficios y Desafíos de PMBOK',
      content:
        'PMBOK proporciona una base sólida para la gestión de proyectos al ofrecer una guía exhaustiva y estandarizada. Sin embargo, puede ser un desafío adaptar todos los procesos a proyectos más pequeños o de naturaleza más dinámica, donde se requiere flexibilidad.',
      dotColor: 'primary'
    },
    {
      title: 'Conclusión',
      content:
        'PMBOK es una herramienta invaluable en la gestión de proyectos, especialmente en contextos complejos y de gran escala. Su enfoque sistemático y basado en buenas prácticas ayuda a los equipos a gestionar los proyectos de forma controlada, maximizando la probabilidad de éxito.',
      dotColor: 'primary'
    }
  ]
}
