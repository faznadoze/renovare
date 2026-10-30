export interface ReWordItem {
  verb: string;
  root: string;
  meaning: string;
  stageTitle: string;
  description: string;
  patientMoment: string;
  specialistName: string;
  specialistRole: string;
  roleBadge: string;
  imageSrc: string;
  highlights: string[];
}

export interface ConcernProtocol {
  id: string;
  concernLabel: string;
  areaTag: string;
  headline: string;
  editorialTouch: string;
  summary: string;
  recommendedProtocol: string;
  sessionDuration: string;
  sensations: string;
  synergyItems: string[];
  imageSrc: string;
  imageAlt: string;
  whatsappMessage: string;
}

export interface TreatmentItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  duration: string;
  recovery: string;
  mechanism: string;
  forWhom: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  whatsappText: string;
}

export interface SpecialistProfile {
  id: string;
  name: string;
  role: string;
  registry: string;
  specialtyFocus: string;
  quote: string;
  bio: string;
  ritualStep: string;
  imageSrc: string;
  imageAlt: string;
  photoPlaceholderNote: string;
  technologies?: string[];
  focusAreas?: string[];
}

export interface FirstSessionStep {
  stepName: string;
  duration: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface FaqItem {
  topic: string;
  question: string;
  answer: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
}

export interface GoogleReviewItem {
  id: string;
  author: string;
  initials: string;
  relativeTime: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

export const GOOGLE_REVIEWS_SHARE_URL = 'https://share.google/YdnqmBDjgpDi7BISm';

export const WHATSAPP_NUMBER = '5531993112715';
export const WHATSAPP_DISPLAY = '(31) 99311-2715';
export const CLINIC_ADDRESS = 'Rua do Rosário, 1181 — Bairro Angola, Betim - MG';
export const CLINIC_HOURS = 'Segunda a Sábado, das 08h às 19h30';

export function buildWhatsAppUrl(customMessage: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customMessage)}`;
}

export const RE_WORDS: ReWordItem[] = [
  {
    verb: 'renovar',
    root: 'novar',
    meaning: 'Há 6 anos renovando olhares com naturalidade e precisão.',
    stageTitle: 'Cílios & Sobrancelhas',
    description:
      'Graduada em Estética, Lídia Beatriz dedica-se há 6 anos a renovar olhares através do design de sobrancelhas e extensão de cílios, valorizando a expressão real de cada rosto.',
    patientMoment: 'Beleza do Olhar · Lídia Beatriz',
    specialistName: 'Lídia Beatriz',
    specialistRole: 'Graduada em Estética · 6 anos de experiência',
    roleBadge: 'Esteticista',
    imageSrc: './assets/people/prof-lidia-beatriz.webp',
    highlights: ['Design de sobrancelhas personalizado', 'Extensão e realce natural dos cílios'],
  },
  {
    verb: 'redescobrir',
    root: 'descobrir',
    meaning: 'Seus traços naturais livres de excessos e marcas.',
    stageTitle: 'Harmonização Facial, Microvasos & Celulite',
    description:
      'Protocolos personalizados para redescobrir a leveza da sua pele e a harmonia do seu rosto e corpo, tratando microvasos, celulite e contornos faciais com equilíbrio e sutileza.',
    patientMoment: 'Estética Facial & Vascular · Daniella Diniz',
    specialistName: 'Daniella Diniz',
    specialistRole: 'Especialista em Harmonização, Microvasos e Celulite',
    roleBadge: 'Harmonização',
    imageSrc: './assets/people/specialist-2.jpg',
    highlights: ['Harmonização facial sem exageros', 'Tratamento para microvasos e celulite'],
  },
  {
    verb: 'reconectar',
    root: 'conectar',
    meaning: 'Mente, emoções e autoestima no mesmo compasso.',
    stageTitle: 'Psicologia Clínica & Hipnose Moderna',
    description:
      'Com método psicológico integrativo (Hipnose moderna, Regressão consciente, Reprocessamento mental e 7healings), auxilia no cuidado de estresse, depressão, pânico, fobias, abandono, traumas, impotência, raiva e tristeza.',
    patientMoment: 'Saúde Emocional · Aparecida Silva',
    specialistName: 'Aparecida Silva',
    specialistRole: 'Psicóloga · Hipnose Moderna & 7healings',
    roleBadge: 'Psicóloga',
    imageSrc: './assets/people/prof-aparecida-silva.webp',
    highlights: [
      'Estresse, depressão, pânico e fobias',
      'Superação de traumas, abandono, raiva e tristeza',
    ],
  },
  {
    verb: 'reanimar',
    root: 'animar',
    meaning: 'A vitalidade da pele, dos fios e do contorno despertada.',
    stageTitle: 'Tecnologias Faciais, Capilares & Corporais',
    description:
      'Através de Microagulhamento Facial e Capilar, Depilação a Laser, Corrente Russa e Ultrassom, atua no rejuvenescimento da pele, redução de manchas e cicatrizes, crescimento capilar, flacidez muscular e redução de medidas.',
    patientMoment: 'Alta Tecnologia Estética · Priscila Couto',
    specialistName: 'Priscila Couto',
    specialistRole: 'Profissional da Estética e Estudante de Biomedicina',
    roleBadge: 'Esteticista',
    imageSrc: './assets/people/pri-capa.jpg',
    highlights: [
      'Microagulhamento facial/capilar e Depilação a Laser',
      'Corrente Russa, Ultrassom e definição corporal',
    ],
  },
  {
    verb: 'reascender',
    root: 'ascender',
    meaning: 'O cuidado diário que ilumina a textura e o viço da pele.',
    stageTitle: 'Estética Integrativa & Cosmética',
    description:
      'Graduada em Estética e Cosmética, Bruna Diniz conduz protocolos de cuidado dermocosmético, preparo e revitalização tecidual que devolvem o viço, a maciez e a saúde cutânea.',
    patientMoment: 'Estética & Cosmética · Bruna Diniz',
    specialistName: 'Bruna Diniz',
    specialistRole: 'Graduada em Estética e Cosmética',
    roleBadge: 'Esteticista',
    imageSrc: './assets/people/prof-bruna-diniz.webp',
    highlights: ['Protocolos estéticos e cosméticos personalizados', 'Vitalidade, textura e saúde da pele'],
  },
  {
    verb: 'resgatar',
    root: 'sgatar',
    meaning: 'Sua saúde integral acompanhada com rigor médico.',
    stageTitle: 'Medicina Clínica & Saúde da Família',
    description:
      'Formado em 2021 pela Faculdade de Minas em Belo Horizonte, o Dr. Adriano Castro possui quatro anos de experiência em saúde da família, urgência e clínica médica, garantindo segurança integral em cada jornada.',
    patientMoment: 'Cuidado Médico · Dr. Adriano Castro',
    specialistName: 'Dr. Adriano Castro',
    specialistRole: 'Médico Clínico · Saúde da Família',
    roleBadge: 'Médico Clínico',
    imageSrc: './assets/people/prof-adriano-castro.webp',
    highlights: ['Formado pela FAMINAS-BH em 2021', '4 anos em saúde da família e clínica médica'],
  },
];

export const CONCERN_PROTOCOLS: ConcernProtocol[] = [
  {
    id: 'gordura-localizada',
    concernLabel: 'Gordura resistente ao treino',
    areaTag: 'Abdômen, flancos, costas e culote',
    headline: 'Redução seletiva de medidas sem cirurgia.',
    editorialTouch: 'contorno esculpido com respeito ao seu biotipo',
    summary:
      'Mesmo mantendo boa alimentação e rotina ativa, certas regiões acumulam células adiposas resistentes. Atuamos com resfriamento controlado e lipólise assistida para remodelar o contorno onde o exercício sozinho não alcança.',
    recommendedProtocol: 'Criolipólise de Placas + Remodelação Pós-Crio',
    sessionDuration: '60 a 90 minutos por região',
    sensations: 'Resfriamento gradual seguido de massagem reabilitadora confortável',
    synergyItems: [
      'Avaliação de prega adiposa milimétrica antes da aplicação',
      'Manta protetora individual certificada pela ANVISA',
      'Acompanhamento de 30, 60 e 90 dias com registro fotográfico clínico',
    ],
    imageSrc: './assets/people/treatment-crio.jpg',
    imageAlt: 'Paciente em atendimento estético de alta precisão na clínica Renovare',
    whatsappMessage:
      'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação para gordura localizada (Criolipólise).',
  },
  {
    id: 'estufamento-retencao',
    concernLabel: 'Abdômen distendido e retenção',
    areaTag: 'Região abdominal e cintura',
    headline: 'Leveza imediata e cintura mais definida.',
    editorialTouch: 'leveza visível desde o primeiro toque',
    summary:
      'Quando o incômodo mistura retenção hídrica, lentidão linfática e depósito adiposo abdominal, nosso protocolo combina desintoxicação tecidual, ativos termogênicos e tecnologias de contorno.',
    recommendedProtocol: 'Protocolo Seca-Barriga Renovare',
    sessionDuration: '50 minutos por sessão',
    sensations: 'Alívio imediato da pressão abdominal e sensação de corpo mais leve',
    synergyItems: [
      'Drenagem linfática mecânica e manual de alta precisão',
      'Ativação microcirculatória e estímulo lipolítico combinado',
      'Orientações práticas de rotina anti-inflamatória pós-sessão',
    ],
    imageSrc: './assets/people/treatment-secabarriga.jpg',
    imageAlt: 'Terapia manual e protocolo remodelador corporal realizado por especialista',
    whatsappMessage:
      'Olá! Vim pelo site da Renovare e quero conhecer o protocolo Seca-Barriga e redução de retenção.',
  },
  {
    id: 'emagrecimento-integrado',
    concernLabel: 'Perda de peso com firmeza',
    areaTag: 'Corpo inteiro e saúde metabólica',
    headline: 'Redução de medidas preservando o tônus.',
    editorialTouch: 'cuidar do todo para revelar sua melhor forma',
    summary:
      'Emagrecer sem suporte estético muitas vezes deixa a pele flácida e o contorno sem definição. Nosso protocolo integra acompanhamento multidisciplinar e tecnologias que sustentam o tecido enquanto você reduz medidas.',
    recommendedProtocol: 'Protocolo de Emagrecimento Integrativo Renovare',
    sessionDuration: 'Ciclo personalizado de 6 a 12 semanas',
    sensations: 'Progresso constante com energia preservada e pele firme',
    synergyItems: [
      'Bioimpedância e mapeamento corporal completo na consulta inicial',
      'Sessões semanais combinando lipólise, firmeza dérmica e estímulo metabólico',
      'Suporte direto da equipe pelo WhatsApp durante toda a jornada',
    ],
    imageSrc: './assets/people/treatment-emagrecimento.jpg',
    imageAlt: 'Cuidado integrativo corporal com óleos e ativos dermocosméticos em cabine',
    whatsappMessage:
      'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação para o Protocolo de Emagrecimento Integrativo.',
  },
  {
    id: 'flacidez-textura',
    concernLabel: 'Firmeza da pele e contorno',
    areaTag: 'Pós-emagrecimento, pós-gestação ou maturidade',
    headline: 'Colágeno ativo e sustentação natural.',
    editorialTouch: 'pele viva, densa e luminosa sem exageros',
    summary:
      'Para quem sente a pele mais fina ou com perda de sustentação após oscilações de peso, associamos estímulos térmicos e bioestimuladores que acordam a produção natural de colágeno.',
    recommendedProtocol: 'Reestruturação Dérmica & Bioestímulo Integrado',
    sessionDuration: '50 minutos por sessão',
    sensations: 'Aquecimento profundo e agradável com efeito tensor progressivo',
    synergyItems: [
      'Diagnóstico da elasticidade dérmica antes de definir a tecnologia',
      'Associação inteligente com os protocolos corporais e faciais da clínica',
      'Resultados naturais que amadurecem a cada semana',
    ],
    imageSrc: './assets/people/hero-woman-glow.jpg',
    imageAlt: 'Procedimento de revitalização e firmeza da pele na clínica Renovare',
    whatsappMessage:
      'Olá! Vim pelo site da Renovare e gostaria de agendar uma avaliação para firmeza e qualidade da pele.',
  },
];

export const TREATMENTS: TreatmentItem[] = [
  {
    id: 'criolipolise',
    name: 'Criolipólise de Alta Precisão',
    subtitle: 'Remodelação seletiva por resfriamento controlado',
    badge: 'Gordura Localizada',
    duration: '60–90 min',
    recovery: 'Retorno imediato',
    mechanism:
      'Atua diretamente nas células de gordura resistentes por meio de resfriamento seletivo e seguro, desencadeando a eliminação fisiológica gradual ao longo das semanas seguintes sem danificar a pele ou músculos.',
    forWhom: 'Ideal para dobras resistentes no abdômen, flancos, costas, interno de coxas e braços.',
    highlights: [
      'Planejamento de marcação individualizado para harmonizar a silhueta',
      'Associação com protocolo pós-crio exclusivo para acelerar a resposta',
      'Procedimento não invasivo com retorno imediato às atividades em Betim',
    ],
    imageSrc: './assets/people/treatment-crio.jpg',
    imageAlt: 'Paciente recebendo cuidado estético especializado em cabine climatizada',
    imageCaption: 'Protocolo conduzido com manta certificada pela ANVISA e acompanhamento de 90 dias',
    whatsappText:
      'Olá! Quero saber como funciona a avaliação para Criolipólise na Renovare.',
  },
  {
    id: 'seca-barriga',
    name: 'Protocolo Seca-Barriga',
    subtitle: 'Sinergia drenante, termogênica e remodeladora',
    badge: 'Contorno & Leveza',
    duration: '50 min',
    recovery: 'Alívio no 1º dia',
    mechanism:
      'Combina manobras especializadas, dermocosméticos de alta permeação e tecnologias de lipólise para reduzir o estufamento abdominal, melhorar o trânsito linfático e afinar a linha da cintura.',
    forWhom: 'Para quem sente o abdômen pesado, inchado ao longo do dia ou com contorno pouco definido.',
    highlights: [
      'Sensação de leveza e redução de retenção já nas primeiras sessões',
      'Estímulo simultâneo da microcirculação e da oxigenação do tecido',
      'Protocolo ajustado semana a semana conforme a resposta do seu corpo',
    ],
    imageSrc: './assets/people/treatment-secabarriga.jpg',
    imageAlt: 'Mãos de especialista aplicando manobras remodeladoras e drenagem corporal',
    imageCaption: 'Associação de terapia manual dermato-funcional e ativos termogênicos',
    whatsappText:
      'Olá! Quero agendar minha avaliação para o Protocolo Seca-Barriga na Renovare.',
  },
  {
    id: 'emagrecimento',
    name: 'Protocolo de Emagrecimento Renovare',
    subtitle: 'Jornada integrativa de redução de medidas e saúde estética',
    badge: 'Corpo Inteiro',
    duration: 'Ciclo 6–12 sem.',
    recovery: 'Acompanhamento VIP',
    mechanism:
      'Um acompanhamento estruturado que une ciência estética, controle de inflamação tecidual e suporte próximo para que o emagrecimento aconteça de forma sustentável e preservando o tônus da pele.',
    forWhom: 'Para mulheres que buscam reduzir medidas de forma consistente, sem efeito sanfona e sem padrões irreais.',
    highlights: [
      'Avaliação inicial com mapeamento completo de composição e metas reais',
      'Cronograma integrado de tecnologias em cabine no Bairro Angola',
      'Cuidado ético: foco em saúde, vitalidade e reconhecimento no espelho',
    ],
    imageSrc: './assets/people/treatment-emagrecimento.jpg',
    imageAlt: 'Atendimento integrativo de bem-estar e remodelação corporal na Renovare',
    imageCaption: 'Jornada acompanhada de perto pela nossa equipe multidisciplinar em Betim',
    whatsappText:
      'Olá! Gostaria de agendar uma avaliação para o Protocolo de Emagrecimento da Renovare.',
  },
];

export const SPECIALISTS: SpecialistProfile[] = [
  {
    id: 'priscila-couto',
    name: 'Priscila Couto',
    role: 'Profissional da Estética e Estudante de Biomedicina',
    registry: 'Microagulhamento · Laser · Eletroterapia Avançada',
    specialtyFocus:
      'Rejuvenescimento da pele, redução de manchas e cicatrizes, crescimento capilar, flacidez muscular e redução de medidas',
    technologies: [
      'Microagulhamento Facial',
      'Microagulhamento Capilar',
      'Depilação a Laser',
      'Corrente Russa',
      'Ultrassom',
    ],
    focusAreas: [
      'Rejuvenescimento da pele',
      'Redução de manchas e cicatrizes',
      'Estímulo ao crescimento capilar',
      'Melhora da flacidez muscular',
      'Definição corporal',
      'Redução de medidas',
    ],
    quote: '“Protocolos integrados com tecnologia de padrão ouro para remodelar, firmar e revitalizar.”',
    bio: 'Atua no planejamento e execução de protocolos com Microagulhamento Facial e Capilar, Depilação a Laser, Corrente Russa e Ultrassom, focados em rejuvenescimento da pele, redução de manchas e cicatrizes, estímulo capilar, melhora da flacidez muscular, definição corporal e redução de medidas.',
    ritualStep: 'Estética Avançada & Biomedicina',
    imageSrc: './assets/people/doctor-priscila.webp',
    imageAlt: 'Priscila Couto — Profissional da Estética na Clínica Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
  {
    id: 'adriano-castro',
    name: 'Dr. Adriano Castro',
    role: 'Médico Clínico · Saúde da Família e Clínica Médica',
    registry: 'Formado em 2021 pela Faculdade de Minas (FAMINAS-BH)',
    specialtyFocus: 'Atendimento em saúde da família, urgência e médico clínico há 4 anos',
    focusAreas: [
      'Saúde da Família',
      'Clínica Médica Geral',
      'Atendimento de Urgência',
      'Segurança e Rigor Clínico',
    ],
    quote: '“Cuidar da estética começa pelo respeito integral à saúde e à história clínica de cada paciente.”',
    bio: 'Formado em 2021 pela Faculdade de Minas em Belo Horizonte, possui quatro anos de experiência consolidada em atendimento de saúde da família, urgência e clínica médica, garantindo acompanhamento e segurança integral a cada paciente.',
    ritualStep: 'Medicina Clínica & Saúde Integral',
    imageSrc: './assets/people/prof-adriano-castro.webp',
    imageAlt: 'Dr. Adriano Castro — Médico Clínico da Clínica Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
  {
    id: 'aparecida-silva',
    name: 'Aparecida Silva',
    role: 'Psicóloga · Hipnose Moderna & Saúde Emocional',
    registry: 'Hipnose Moderna, Regressão Consciente, Reprocessamento Mental e 7healings',
    specialtyFocus:
      'Hipnose moderna, Regressão consciente, Reprocessamento mental e 7healings para destravar bloqueios e reconectar autoestima',
    focusAreas: [
      'Hipnose Moderna',
      'Regressão Consciente',
      'Reprocessamento Mental',
      '7healings',
      'Destravar Bloqueios',
    ],
    quote: '“Com meu método psicológico, ajudo você a reconectar mente, emoções e autoestima.”',
    bio: 'Especialista em método psicológico integrativo utilizando hipnose moderna, regressão consciente, reprocessamento mental e 7healings para ajudar a destravar bloqueios e reconectar mente, emoções e autoestima.',
    ritualStep: 'Psicologia & Hipnose Moderna',
    imageSrc: './assets/people/prof-aparecida-silva.webp',
    imageAlt: 'Aparecida Silva — Psicóloga da Clínica Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
  {
    id: 'lidia-beatriz',
    name: 'Lídia Beatriz',
    role: 'Graduada em Estética · Especialista em Olhar',
    registry: 'Há 6 anos renovando olhares',
    specialtyFocus: 'Design de sobrancelhas e extensão de cílios',
    focusAreas: ['Design de Sobrancelhas', 'Extensão de Cílios', 'Harmonia Natural do Olhar'],
    quote: '“Há 6 anos renovando olhares através dos cílios e sobrancelhas, valorizando a expressão de cada rosto.”',
    bio: 'Graduada em Estética, dedica-se há 6 anos a renovar olhares através dos cílios e sobrancelhas, valorizando a expressão e a harmonia natural de cada rosto.',
    ritualStep: 'Design do Olhar · Cílios & Sobrancelhas',
    imageSrc: './assets/people/prof-lidia-beatriz.webp',
    imageAlt: 'Lídia Beatriz — Especialista em Olhar na Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
  {
    id: 'daniella-diniz',
    name: 'Daniella Diniz',
    role: 'Especialista em Harmonização Facial e Estética Corporal',
    registry: 'Harmonização Facial, Microvasos e Celulite',
    specialtyFocus: 'Harmonização facial, Tratamento para microvasos, Tratamento para celulite',
    focusAreas: [
      'Harmonização Facial Natural',
      'Tratamento para Microvasos',
      'Tratamento para Celulite',
      'Equilíbrio Corporal',
    ],
    quote: '“Realçar traços faciais com naturalidade e tratar alterações corporais com precisão e equilíbrio.”',
    bio: 'Conduz protocolos personalizados para realçar traços faciais com naturalidade e tratar alterações corporais como celulite e microvasos com precisão e equilíbrio.',
    ritualStep: 'Harmonização Facial & Corporal',
    imageSrc: './assets/people/specialist-2.jpg',
    imageAlt: 'Daniella Diniz — Harmonização Facial e Corporal na Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
  {
    id: 'bruna-diniz',
    name: 'Bruna Diniz',
    role: 'Graduada em Estética e Cosmética',
    registry: 'Protocolos de Estética e Cosmética Integrada',
    specialtyFocus: 'Protocolos de estética e cosmética integrada, saúde cutânea, textura e viço da pele',
    focusAreas: [
      'Estética & Cosmética Integrada',
      'Saúde Cutânea',
      'Textura e Viço da Pele',
      'Revitalização Tecidual',
    ],
    quote: '“A ciência cosmética aliada ao cuidado integral para devolver a vitalidade e a luminosidade da pele.”',
    bio: 'Graduada em Estética e Cosmética, atua no planejamento e execução de protocolos dermocosméticos que revitalizam, nutrem e devolvem a vitalidade da pele.',
    ritualStep: 'Estética & Cosmética Integrativa',
    imageSrc: './assets/people/prof-bruna-diniz.webp',
    imageAlt: 'Bruna Diniz — Graduada em Estética e Cosmética na Renovare',
    photoPlaceholderNote: 'Profissional Renovare · Atendimento em Betim',
  },
];

export const FIRST_SESSION_STEPS: FirstSessionStep[] = [
  {
    stepName: 'Acolhimento',
    duration: '15 min',
    title: 'Escuta ativa no Bairro Angola',
    description:
      'Você é recebida com calma em nossa clínica na Rua do Rosário. Conversamos sobre o que te incomoda hoje, sua rotina de trabalho, sono, histórico de saúde e experiências anteriores.',
    deliverable: 'Ficha clínica integrativa e alinhamento de expectativas reais',
  },
  {
    stepName: 'Diagnóstico',
    duration: '20 min',
    title: 'Análise física e mapeamento tecidual',
    description:
      'Avaliamos a espessura do tecido adiposo, grau de flacidez, retenção hídrica e simetria corporal. Explicamos no espelho, com clareza e ética, o que cada tecnologia pode entregar.',
    deliverable: 'Mapeamento anatômico personalizado sem promessas irreais',
  },
  {
    stepName: 'Plano Re-',
    duration: '15 min',
    title: 'Desenho do seu protocolo exclusivo',
    description:
      'Apresentamos o cronograma ideal de sessões — seja Criolipólise, Seca-Barriga ou Emagrecimento Integrativo — com transparência total de etapas, prazos de resposta e valores.',
    deliverable: 'Proposta de tratamento sob medida + orientações para o primeiro dia',
  },
  {
    stepName: 'Início',
    duration: 'Imediato ou agendado',
    title: 'O começo do seu desabrochar',
    description:
      'Você já pode iniciar sua primeira sessão no mesmo dia ou programar os horários da semana (08h às 19h30) com acompanhamento contínuo pelo nosso WhatsApp.',
    deliverable: 'Suporte próximo da equipe durante todo o ciclo',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    topic: 'Black Renovare',
    question: 'Como funcionam as condições da Black da Renovare?',
    answer:
      'Durante a temporada da Black (com fechamento em 27 de novembro de 2026), liberamos lotes limitados de avaliação e pacotes combinados com condições especiais para pacientes agendadas pelo WhatsApp, mantendo o mesmo tempo de cabine e rigor clínico de todo o ano.',
    imageSrc: './assets/people/pri-capa.jpg',
    imageAlt: 'Profissional sorrindo em uma sala de atendimento da clínica',
    imagePosition: '62% center',
  },
  {
    topic: 'Avaliação',
    question: 'Por que todo tratamento na Renovare começa por uma avaliação?',
    answer:
      'Porque nenhum corpo responde igual a um protocolo pronto. Na avaliação presencial em Betim analisamos se o seu incômodo vem de gordura localizada, retenção linfática ou flacidez dérmica, garantindo que você invista apenas no procedimento certo para a sua fisiologia.',
    imageSrc: './assets/people/faq-avaliacao.webp',
    imageAlt: 'Profissional à mesa com um modelo de composição corporal usado na avaliação',
    imagePosition: '58% center',
  },
  {
    topic: 'Criolipólise',
    question: 'Em quanto tempo vejo o resultado da Criolipólise e ela dói?',
    answer:
      'O resfriamento controlado gera uma sensação inicial de frio intenso seguida de dormência local nos primeiros minutos, tornando a sessão muito tranquila. A eliminação natural das células tratadas começa a ser notada a partir de 30 dias, atingindo seu ápice entre 60 e 90 dias, potencializada pelo nosso protocolo pós-crio.',
    imageSrc: './assets/people/treatment-emagrecimento.jpg',
    imageAlt: 'Paciente deitada recebendo um cuidado corporal na maca',
    imagePosition: '40% center',
  },
  {
    topic: 'Seca-Barriga',
    question: 'Qual a diferença entre o Seca-Barriga e o Protocolo de Emagrecimento?',
    answer:
      'O Seca-Barriga foca na região abdominal e cintura para desinchar, drenar retenção e atacar a gordura abdominal localizada. Já o Protocolo de Emagrecimento olha para o corpo inteiro ao longo de semanas, combinando redução global de medidas, estímulo metabólico e preservação da firmeza da pele.',
    imageSrc: './assets/people/treatment-secabarriga.jpg',
    imageAlt: 'Mãos de profissional realizando massagem de drenagem nas costas de uma paciente',
    imagePosition: 'center 35%',
  },
  {
    topic: 'Rotina',
    question: 'Preciso me afastar do trabalho após as sessões?',
    answer:
      'Não. Todos os nossos procedimentos são não cirúrgicos e permitem retorno imediato à sua rotina em Betim. Atendemos das 08h às 19h30 justamente para encaixar suas sessões com conforto antes ou depois do seu expediente.',
    imageSrc: './assets/people/hero-woman-natural.jpg',
    imageAlt: 'Retrato de uma mulher com a pele natural e cabelo preso',
    imagePosition: 'center 30%',
  },
];

export const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT2tKTVpESjBTRlpxU1hsamVWRTlNbmMyTjFodGFsRRAB',
    author: 'kathia bernardes',
    initials: 'KB',
    relativeTime: '5 dias atrás',
    rating: 5,
    comment:
      'Eu amo essa clínica, as meninas são muito transparentes em relação aos procedimentos sem falsas promessas ou apenas por vender. Realmente entregam resultado',
    avatarUrl:
      'https://lh3.googleusercontent.com/a-/ALV-UjV_9GBrF1SHVsuZzQEgrtyt17_lfvTSpNJOkJlf1MLCiCbPXij-=s120-c-rp-mo-ba12-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT2w5elZWbHplRzkxVGt4eldrOHdTbTFqUlhoc1dWRRAB',
    author: 'Lilianne Ribeiro',
    initials: 'LR',
    relativeTime: 'uma semana atrás',
    rating: 5,
    comment:
      'A Clinica e muito linda , procedimentos com resultados incríveis, e as meninas sao muito educados ,receptivas e atenciosas',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocJEJ8FYU46bBV7ll-bTqi7f74EsxwzmJLfEL0628IN6cOZXdQ=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT2xkV2JFbDZVVUU0ZFZreldsRnFkMDVXYkZsVVZYYxAB',
    author: 'Giovana',
    initials: 'GI',
    relativeTime: 'uma semana atrás',
    rating: 5,
    comment:
      'Eu fiquei encantada com o atendimento. O laser é de extrema qualidade e realmente funciona. Recomendo pra todo mundo!!!!!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocIiaNweE-OvAtwgFbmYVYflnkB6a6I2jJUKHUBTnz-_8L347fk=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT21GbFpHOVNaME5MTmxabk0yODRaMU5FV0daSVJWRRAB',
    author: 'Julia Freitas',
    initials: 'JF',
    relativeTime: 'uma semana atrás',
    rating: 5,
    comment:
      'Eu amei a experiência de ir na Renovare! Clinica muito aconchegante, linda, pessoas muito especiais e atenciosas com as clientes. Me senti muito bem recebida e acolhida. A depilação a laser realmente funciona ali viu? A qualidade técnica da Renovare é excelente.',
    avatarUrl:
      'https://lh3.googleusercontent.com/a-/ALV-UjXLfcGBYqWxcYoa7Tse8hfk2a6rWmRpEpR6lWWNhnnu-NUtSyo=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT2xSbFdHczFZbWxrVjBsTmIyMDJZMmxwWkRKVlZXYxAB',
    author: 'Angélica Lopes',
    initials: 'AL',
    relativeTime: 'um mês atrás',
    rating: 5,
    comment:
      'Ambiente limpo, agradável, confortável e acolhedor! Profissionais dedicados e comprometidos com sua saúde e bem estar, mesmo antes da estética! Parabéns Equipe Renovare!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a-/ALV-UjVv1yc4109OjyvcJ8e7fvpoHDhChEHRYXo_YRtgmAPKy6jgDeIKrg=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT2tKTVpESjBTRlpxU1hsamVWRTlNbmMyTjFodGFsRRAC',
    author: 'Leandra Silva',
    initials: 'LS',
    relativeTime: 'um mês atrás',
    rating: 5,
    comment:
      'Antes de conhecer a Renovare, pesquisei bastante pois tinha muitas dúvidas por ser minha primeira experiência com o laser. Tiraram minhas dúvidas com muita atenção e já estou no meu terceiro pacote de laser, amando meus resultados!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocJw7yCC4rty_5vJ8d9znNvduCQIUgFNGBIVuIxSCgdZ6vY7TQ=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT25veGJuSm5NVmR3VjI5R05sbG9NbW93Y1c1R1lXYxAB',
    author: 'Keila Torres',
    initials: 'KT',
    relativeTime: '2 meses atrás',
    rating: 5,
    comment:
      'Gosto muito do atendimento das meninas, são sempre muito educadas e atenciosas. Sem contar que o preço é bem acessível quando comparado com outras clínicas. Recomendo muito!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a-/ALV-UjUtfg70-bwANLzVvbsseob7mo8Sm2q5R1NuW3zOKjhC7EIN5Iku=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT21wRlZVaEtSVkZGUzFsNmVVdEtVWFE1Y1RSR1RGRRAB',
    author: 'Fernanda Coelho',
    initials: 'FC',
    relativeTime: '2 meses atrás',
    rating: 5,
    comment:
      'A clínica é excelente, o espaço é lindoo, todas as profissionais te atendem e recebem muito bem lá, sem contar a qualidade do trabalho. Vi técnicas serem usadas que não vi em nenhum outro lugar. Recomendo!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocL_Ahder5l6u3869OGCSH9EYrzN1wdkATmnggGkGlWz3AcY52E=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT213MWRWRXhZbmRPVFZod01rWmpXazl5V1RoS1dWRRAB',
    author: 'Rosy Alves Costa',
    initials: 'RC',
    relativeTime: '2 meses atrás',
    rating: 5,
    comment:
      'Amooo! Conforto, ótimo atendimento, me sinto em casa, sou super bem cuidada, minha auto estima hoje é completamente renovada.',
    avatarUrl:
      'https://lh3.googleusercontent.com/a/ACg8ocKPVNbf7WhewoNuAvMYhb1BrabiXkcMwzgjToOjugiI-uMy8g=s120-c-rp-mo-br100',
  },
  {
    id: 'Ci9DQUlRQUNvZENodHljRjlvT201aFJFbzJPVTlhT0ZSa1oxVXRiRzR0WkRka1ExRRAB',
    author: 'Beatriz Lages',
    initials: 'BL',
    relativeTime: '2 meses atrás',
    rating: 5,
    comment:
      'Minha experiência na Renovare é muito boa! Sempre sou bem atendida e me sinto muito à vontade durante os procedimentos. A equipe é atenciosa, profissional e o ambiente é muito agradável. Gosto bastante e com certeza recomendo!',
    avatarUrl:
      'https://lh3.googleusercontent.com/a-/ALV-UjWVgI4AvpXi0BtK-7UCUIM7qOe9mk9B1vF6r6Tul0uqLDs80O5l=s120-c-rp-mo-br100',
  },
];

// Eight most descriptive real Google reviews, ordered for balanced columns on the page
const FEATURED_REVIEW_AUTHORS = [
  'Julia Freitas',
  'Angélica Lopes',
  'Fernanda Coelho',
  'Rosy Alves Costa',
  'kathia bernardes',
  'Beatriz Lages',
  'Keila Torres',
  'Leandra Silva',
];

export const FEATURED_GOOGLE_REVIEWS: GoogleReviewItem[] = FEATURED_REVIEW_AUTHORS.map(
  (author) => GOOGLE_REVIEWS.find((review) => review.author === author)
).filter((review): review is GoogleReviewItem => Boolean(review));
