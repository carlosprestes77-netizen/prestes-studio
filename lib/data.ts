const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const ARTIST = {
  name: "Bruno Beltrami",
  handle: "@bruno.belt",
  instagram: "https://www.instagram.com/bruno.belt",
  whatsapp: "5548998663124",
  location: "Santa Catarina — Brasil",
  city: "Florianópolis · Santa Catarina",
  portrait: `${bp}/artist/bruno.jpg`,
  hours: [
    { day: "Seg — Sex", time: "10h — 19h" },
    { day: "Sábado", time: "10h — 16h" },
    { day: "Domingo", time: "Fechado" },
  ],
};

// Trust / credibility numbers
export const stats = [
  { value: "+500", label: "Peças realizadas" },
  { value: "8", label: "Anos de carreira" },
  { value: "60d", label: "Retoque garantido" },
  { value: "100%", label: "Material descartável" },
];

// How it works — the client journey, builds trust and sets expectations
export const processSteps = [
  {
    n: "01",
    title: "Conversa",
    desc: "Você manda sua ideia pelo WhatsApp ou pelo formulário. Conversamos sobre conceito, referências, local do corpo e tamanho. Briefing sem compromisso.",
  },
  {
    n: "02",
    title: "Projeto",
    desc: "Desenvolvo um desenho autoral exclusivo para você. Ajustamos juntos até cada linha fazer sentido. O projeto é só seu — nunca se repete em outra pele.",
  },
  {
    n: "03",
    title: "Sessão",
    desc: "Estúdio privativo, material 100% descartável e ambiente tranquilo. Trabalho com calma e precisão, no seu ritmo, do começo ao fim.",
  },
  {
    n: "04",
    title: "Cuidado",
    desc: "Você sai com um guia completo de cicatrização. Acompanho a cura de perto e os retoques estão inclusos nos primeiros 60 dias. A relação não acaba na agulha.",
  },
];

// Social proof
export const testimonials = [
  {
    name: "Mariana Costa",
    work: "Memento Mori · Antebraço",
    quote: "O Bruno transformou uma ideia confusa na minha cabeça em uma obra que eu olho todo dia e me emociono. A precisão da geometria é absurda. Cicatrizou perfeita.",
  },
  {
    name: "Rafael Andrade",
    work: "Manga Neo-Clássica · Braço",
    quote: "Pesquisei tatuadores por meses. Nenhum chegava perto do nível dele em microrealismo. Atendimento impecável, estúdio limpíssimo e o resultado superou tudo.",
  },
  {
    name: "Juliana Mendes",
    work: "Sapientia · Costas",
    quote: "Mais de seis horas de sessão e o cuidado dele me deixou tranquila o tempo todo. Cada detalhe pensado. Vale cada minuto e cada centavo. Já estou planejando a próxima.",
  },
  {
    name: "Lucas Ferreira",
    work: "Imperator · Peito",
    quote: "O simulador do site me ajudou a visualizar antes mesmo de fechar. Quando vi na pele, era exatamente aquilo. Profissionalismo de outro patamar.",
  },
  {
    name: "Camila Rocha",
    work: "Psyché · Ombro",
    quote: "Linhas finas que não borraram, traço firme e um conceito que conta a minha história. O Bruno é artista de verdade, não só tatuador. Recomendo de olhos fechados.",
  },
  {
    name: "Thiago Almeida",
    work: "Navigator · Ombro",
    quote: "Ambiente acolhedor, conversa franca e zero pressa. Ele respeitou minha ideia e elevou ela. A cicatrização foi tranquila seguindo o guia que ele passou.",
  },
];

// FAQ — reduces friction before booking (deposit, pain, healing, pricing)
export const faqs = [
  {
    q: "Como funciona o orçamento?",
    a: "É gratuito e sem compromisso. Você descreve a ideia pelo formulário ou WhatsApp, e eu retorno com uma estimativa de valor e tempo de sessão. O preço varia conforme tamanho, complexidade e local do corpo.",
  },
  {
    q: "Preciso pagar sinal para agendar?",
    a: "Sim. Para reservar a data é necessário um sinal, que é descontado do valor final da tatuagem. Ele garante o horário e cobre o tempo dedicado ao desenvolvimento do seu projeto exclusivo.",
  },
  {
    q: "Dói muito? Como me preparo?",
    a: "A sensação varia por pessoa e região do corpo. Durma bem, hidrate-se, faça uma boa refeição antes e evite álcool nas 24h anteriores. No dia, vá com roupa confortável que dê acesso fácil ao local da tatuagem.",
  },
  {
    q: "Como é a cicatrização?",
    a: "Você sai com um guia completo de cuidados. Em geral a pele cicatriza entre 15 e 30 dias. Mantenha limpo, hidratado e longe de sol e mar nas primeiras semanas. Eu acompanho a cura de perto por mensagem.",
  },
  {
    q: "Os retoques são cobrados?",
    a: "Não nos primeiros 60 dias. Retoques de cicatrização dentro desse prazo estão inclusos. Depois disso, retoques são avaliados individualmente.",
  },
  {
    q: "Posso levar minha própria ideia ou referência?",
    a: "Com certeza — e é incentivado. Trabalho com projetos autorais, então uso suas referências como ponto de partida para criar algo único, nunca uma cópia. Cada flash é vendido uma única vez.",
  },
  {
    q: "Qual a idade mínima?",
    a: "É necessário ter 18 anos completos e apresentar documento com foto no dia da sessão. Não realizo tatuagens em menores de idade, mesmo com autorização.",
  },
  {
    q: "O material é seguro?",
    a: "Sempre. Trabalho com material 100% descartável, agulhas lacradas abertas na sua frente e biossegurança rigorosa. Sua saúde é inegociável.",
  },
];

export const portfolioItems = [
  {
    id: 1,
    src: `${bp}/portfolio/victory.jpg`,
    alt: "Victory — deusa clássica em microrealismo com geometria orbital na mão",
    style: "Neo-Clássico",
    placement: "Mão",
    size: "large",
    label: "VICTORY",
  },
  {
    id: 2,
    src: `${bp}/portfolio/fortis-fortuna.jpg`,
    alt: "Fortis Fortuna Adiuvat — peito e braço com traços técnicos e sol geométrico",
    style: "Neo-Geométrico",
    placement: "Peito & Braço",
    size: "large",
    label: "FORTIS FORTUNA",
  },
  {
    id: 3,
    src: `${bp}/portfolio/destiny.jpg`,
    alt: "Destiny — astronauta, cervo e geometria cósmica em manga fechada",
    style: "Collage",
    placement: "Braço",
    size: "large",
    label: "DESTINY",
  },
  {
    id: 4,
    src: `${bp}/portfolio/memento-mori.jpg`,
    alt: "Memento Mori — Ícaro em ascensão com águia e geometria no antebraço",
    style: "Neo-Clássico",
    placement: "Antebraço",
    size: "medium",
    label: "MEMENTO MORI",
  },
  {
    id: 5,
    src: `${bp}/portfolio/navigator.jpg`,
    alt: "Navigator — guerreiro romano com bússola e cartografia no ombro",
    style: "Neo-Clássico",
    placement: "Ombro",
    size: "medium",
    label: "NAVIGATOR",
  },
  {
    id: 6,
    src: `${bp}/portfolio/sapientia.jpg`,
    alt: "Sapientia et Fides — monge e anjo em narrativa visual nas costas",
    style: "Neo-Clássico",
    placement: "Costas",
    size: "large",
    label: "SAPIENTIA",
  },
  {
    id: 7,
    src: `${bp}/portfolio/psyche.jpg`,
    alt: "Psyché — rosto em microrealismo com geometria radiante no ombro",
    style: "Neo-Geométrico",
    placement: "Ombro",
    size: "medium",
    label: "PSYCHÉ",
  },
  {
    id: 8,
    src: `${bp}/portfolio/gloria.jpg`,
    alt: "Gloria — anjo guerreiro com espada e geometria celeste no antebraço",
    style: "Neo-Clássico",
    placement: "Antebraço",
    size: "medium",
    label: "GLORIA",
  },
  {
    id: 9,
    src: `${bp}/portfolio/fides.jpg`,
    alt: "Fides — composição com cruz, figuras e sistema planetário no braço",
    style: "Collage",
    placement: "Braço",
    size: "small",
    label: "FIDES",
  },
];

export const flashItems = [
  {
    id: "flash-01",
    name: "Filósofo no Trono",
    style: "Neo-Clássico",
    description: "Figura entronada com leões, geometria sagrada, candlesticks e elmo espartano com flecha. Composição monumental.",
    src: `${bp}/flashes/filosofo-trono.jpg`,
    simSrc: `${bp}/flashes/sim/filosofo-trono.png`,
    placeholder: "⚖️",
  },
  {
    id: "flash-02",
    name: "Mente Aberta",
    style: "Surrealismo",
    description: "Perfil feminino com cérebro exposto, sistema vascular, coração anatômico e olho em mandala geométrica.",
    src: `${bp}/flashes/mente-aberta.jpg`,
    simSrc: `${bp}/flashes/sim/mente-aberta.png`,
    placeholder: "🧠",
  },
  {
    id: "flash-03",
    name: "Ad Astra",
    style: "Collage",
    description: "Astronauta com ônibus espacial, bonsai e rosto fraturado — do cosmos ao humano. Ideal para manga.",
    src: `${bp}/flashes/ad-astra.jpg`,
    simSrc: `${bp}/flashes/sim/ad-astra.png`,
    placeholder: "🚀",
  },
  {
    id: "flash-04",
    name: "Veni Vidi Vici",
    style: "Neo-Clássico",
    description: "Busto romano em colagem com texto clássico — escultura greco-romana e tipografia monumental.",
    src: `${bp}/flashes/veni-vidi-vici.jpg`,
    simSrc: `${bp}/flashes/sim/veni-vidi-vici.png`,
    placeholder: "🏛️",
  },
  {
    id: "flash-05",
    name: "Imperator",
    style: "Neo-Clássico",
    description: "Águia em voo sobre busto de guerreiro romano com bússola geométrica — liberdade, poder e precisão.",
    src: `${bp}/flashes/imperator.jpg`,
    simSrc: `${bp}/flashes/sim/imperator.png`,
    placeholder: "🦅",
  },
  {
    id: "flash-06",
    name: "Coruja Maçônica",
    style: "Neo-Geométrico",
    description: "Coruja em voo com coluna jônica, símbolo maçônico e traços arquitetônicos. Conhecimento e mistério.",
    src: `${bp}/flashes/coruja-maconica.jpg`,
    simSrc: `${bp}/flashes/sim/coruja-maconica.png`,
    placeholder: "🦉",
  },
  {
    id: "flash-07",
    name: "Águia Courage",
    style: "Neo-Geométrico",
    description: "Águia em microrealismo com geometria cósmica, elipses e tipografia vertical COURAGE.",
    src: `${bp}/flashes/aguia-courage.jpg`,
    simSrc: `${bp}/flashes/sim/aguia-courage.png`,
    placeholder: "⚡",
  },
  {
    id: "flash-08",
    name: "Rosa e Mão",
    style: "Collage",
    description: "Mão segurando rosa em colagem surrealista com olho e elementos fragmentados. Beleza e fragilidade.",
    src: `${bp}/flashes/rosa-mao.jpg`,
    simSrc: `${bp}/flashes/sim/rosa-mao.png`,
    placeholder: "🌹",
  },
];
