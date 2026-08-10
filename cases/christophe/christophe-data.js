window.CHRISTOPHE = {
  langs: ["en", "zh", "fr"],
  langLabels: { en: "EN", zh: "中文", fr: "FR" },
  defaultLang: "fr",

  ui: {
    en: {
      all: "All",
      series: "Series",
      size: "Size",
      door: "Door",
      models: "models",
      base: "Base",
      options: "Options",
      empty: "No models match",
      coque: "Shell",
      meubles: "Cabinets",
      countertop: "Top",
      contactTitle: "Leave your contact",
      contactNote: "Phone, social or email — we’ll get back to you.",
      phone: "Phone",
      social: "Social",
      email: "Email",
      name: "Name",
      submit: "Contact me",
      submitting: "Sending…",
      submitOk: "Thanks — we’ll contact you soon.",
      submitNeed: "Please leave phone, social or email.",
      interest: "Interested in",
      units: "units",
      pageIntro: "Mobile outdoor kitchen containers in three door types.",
      highlight: "Highlights",
      share: "Share",
      shareWhatsApp: "WhatsApp",
      shareText: "Outdoor Kitchen | DD design",
      home: "Home"
    },
    zh: {
      all: "全部",
      series: "系列",
      size: "尺寸",
      door: "门型",
      models: "款",
      base: "基础配置",
      options: "选配",
      empty: "暂无匹配型号",
      coque: "外壳",
      meubles: "柜门",
      countertop: "台面",
      contactTitle: "留下联系方式",
      contactNote: "手机、社媒或邮箱均可，我们会联系你。",
      phone: "手机",
      social: "社媒",
      email: "邮箱",
      name: "称呼",
      submit: "提交，请联系我",
      submitting: "提交中…",
      submitOk: "已收到，我们会尽快联系你。",
      submitNeed: "请至少填写手机、社媒或邮箱。",
      interest: "意向",
      units: "台",
      pageIntro: "移动式户外厨房箱体，三种门型可选。",
      highlight: "配置亮点",
      share: "分享",
      shareWhatsApp: "WhatsApp",
      shareText: "Outdoor Kitchen | DD design",
      home: "首页"
    },
    fr: {
      all: "Tous",
      series: "Série",
      size: "Taille",
      door: "Porte",
      models: "modèles",
      base: "Base",
      options: "Options",
      empty: "Aucun modèle",
      coque: "Coque",
      meubles: "Meubles",
      countertop: "Plan",
      contactTitle: "Laissez vos coordonnées",
      contactNote: "Téléphone, réseau social ou e-mail — nous vous recontactons.",
      phone: "Téléphone",
      social: "Réseau",
      email: "E-mail",
      name: "Nom",
      submit: "Contactez-moi",
      submitting: "Envoi…",
      submitOk: "Merci — nous vous recontacterons.",
      submitNeed: "Indiquez téléphone, réseau ou e-mail.",
      interest: "Intérêt",
      units: "unités",
      pageIntro: "Cuisines mobiles outdoor en trois types de porte.",
      highlight: "Points forts",
      share: "Partager",
      shareWhatsApp: "WhatsApp",
      shareText: "Outdoor Kitchen | DD design",
      home: "Accueil"
    }
  },

  /* special appliance callouts (keyed by base term) */
  highlights: {
    bbq820: {
      title: {
        en: "Glass-lid BBQ 3004-820",
        zh: "带窗烧烤炉 3004-820",
        fr: "Barbecue vitre 3004-820"
      },
      body: {
        en: "Viewing window on the lid — watch heat and doneness without opening; steadier temperature, less flare-up.",
        zh: "炉盖带观察窗，不用开盖也能看火候与熟度；保温更稳，减少频繁开盖跑温。",
        fr: "Fenêtre sur le couvercle — surveillez la cuisson sans ouvrir ; température plus stable, moins de pertes de chaleur."
      }
    },
    kamado: {
      title: {
        en: "Kamado 18″",
        zh: "烤蛋炉 KAMADO 18″",
        fr: "KAMADO 18″"
      },
      body: {
        en: "Ceramic egg grill for high-heat sear or low-and-slow smoke; pairs with the main BBQ for dual cooking zones.",
        zh: "陶制烤蛋炉，可高温锁汁也可低温烟熏；与主烧烤炉双区协作，丰富户外烹饪方式。",
        fr: "Grill céramique pour saisie haute température ou fumage lent ; complète le barbecue principal en double zone."
      }
    }
  },

  doors: {
    mini: {
      id: "mini",
      name: "MINI",
      door: { en: "Lift-up", zh: "上翻门", fr: "Relevage" },
      blurb: {
        en: "Compact lift-up container — open and cook. Sink, BBQ and fridge as standard; ideal for balconies and small patios.",
        zh: "紧凑上翻门一体箱体，开箱即用。水槽、烧烤炉、冰箱标配，适合阳台与小庭院。",
        fr: "Conteneur compact à relevage — prêt à cuisiner. Évier, barbecue et frigo de série ; idéal balcon et petite terrasse."
      }
    },
    pro: {
      id: "pro",
      name: "PRO",
      door: { en: "Roll-up", zh: "卷帘门", fr: "Rideau" },
      blurb: {
        en: "Roll-up door series with hood, wall cabinets, TV kit and ceiling lights — storage meets outdoor entertaining.",
        zh: "卷帘门开合，含抽油烟机、吊柜、电视支架与顶灯，兼顾收纳与户外娱乐。",
        fr: "Série porte rideau avec hotte, armoires, kit TV et lampes — rangement et réception outdoor."
      }
    },
    ultra: {
      id: "ultra",
      name: "ULTRA",
      door: { en: "Lift panel", zh: "开合门", fr: "Ouvrant" },
      blurb: {
        en: "Flagship lift-panel containers with nine finishes and full options — hood, TV kit and premium fittings.",
        zh: "开合门旗舰箱体，九种色配与尺寸。吊柜、电视、烟机与丰富选配一应俱全。",
        fr: "Ouvrant premium, neuf finitions et options complètes — hotte, kit TV et équipements haut de gamme."
      }
    }
  },

  /* shared option/base keys → i18n */
  terms: {
    sink450: { en: "Sink 450 + faucet", zh: "水槽450+水龙头", fr: "Évier 450 + robinet" },
    sink560: { en: "Sink 560 + faucet", zh: "水槽560+水龙头", fr: "Évier 560 + robinet" },
    sink450s: { en: "Sink 450", zh: "水槽450", fr: "Évier 450" },
    bbq780: { en: "BBQ 3004-780", zh: "烧烤炉3004-780", fr: "Barbecue 3004-780" },
    bbq820: { en: "BBQ glass 3004-820", zh: "带窗烧烤炉3004-820", fr: "Barbecue vitre 3004-820" },
    drawers: { en: "Drawer unit", zh: "抽屉柜", fr: "Coffre à tiroirs" },
    fridge: { en: "Fridge JG150", zh: "冰箱JG150", fr: "Réfrigérateur JG150" },
    kamado: { en: "Kamado 18″", zh: "烧烤蛋18英寸", fr: "KAMADO 18″" },
    ice: { en: "Ice maker", zh: "制冰机", fr: "Machine à glaçons" },
    rail: { en: "Rail socket", zh: "导轨插座", fr: "Goulotte" },
    socket: { en: "Socket", zh: "插座", fr: "Prise" },
    led: { en: "LED strip", zh: "灯带", fr: "Bande lumineuse" },
    lamps: { en: "2 ceiling lamps", zh: "2顶灯", fr: "2 lampes plafond" },
    hood: { en: "Hood + canopy", zh: "抽油烟机+烟罩", fr: "Extraction + capot" },
    tv: { en: "TV kit", zh: "电视支架", fr: "Kit TV" },
    wallcab: { en: "Wall cabinet", zh: "吊柜", fr: "Armoire suspendue" },
    wheels: { en: "Casters", zh: "万向轮", fr: "Roues" },
    teppan: { en: "Teppanyaki plate", zh: "铁板烧-铁板", fr: "Teppanyaki" },
    shelf: { en: "Shelf", zh: "置物架", fr: "Étagère" },
    bin: { en: "Bin", zh: "垃圾桶", fr: "Poubelle" }
  },

  models: [
    {
      id: "m1", code: "M1", series: "mini", size: 2200, name: "MINI 2200",
      image: "assets/m1-mini-2200.jpg",
      coque: "CK05F", meubles: "CK11F", countertop: "GY03",
      base: ["sink450", "bbq780", "fridge"],
      options: ["rail", "socket", "led", "wheels", "teppan", "bin"]
    },
    {
      id: "m2", code: "M2", series: "mini", size: 2900, name: "MINI 2900",
      image: "assets/m2-mini-2900.jpg",
      coque: "CK02F", meubles: "CK13F", countertop: "GY03",
      base: ["sink450", "bbq780", "fridge"],
      options: ["rail", "socket", "led", "wheels", "teppan", "bin"]
    },
    {
      id: "m3", code: "M3", series: "mini", size: 2900, name: "MINI 2900",
      image: "assets/m3-mini-2900.jpg",
      coque: "CK03F", meubles: "CK20F", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "wheels", "teppan", "bin"]
    },
    {
      id: "m4", code: "M4", series: "mini", size: 3200, name: "MINI 3200",
      image: "assets/m4-mini-3200.jpg",
      coque: "CK09S", meubles: "CM26-Y", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "wheels", "teppan", "bin"]
    },
    {
      id: "p1", code: "P1", series: "pro", size: 2900, name: "PRO 2900",
      image: "assets/p1-pro-2900.jpg",
      coque: "CK02F", meubles: "CK01F", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "p2", code: "P2", series: "pro", size: 3200, name: "PRO 3200",
      image: "assets/p2-pro-3200.jpg",
      coque: "CK09S", meubles: "CM26-Y", countertop: "GY03",
      base: ["sink560", "bbq820", "kamado", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "p3", code: "P3", series: "pro", size: 3500, name: "PRO 3500",
      image: "assets/p3-pro-3500.jpg",
      coque: "CK03F", meubles: "CK05T", countertop: "GY03",
      base: ["sink560", "bbq820", "drawers", "ice", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u1", code: "U1", series: "ultra", size: 2200, name: "ULTRA 2200",
      image: "assets/u1-ultra-2200.jpg",
      coque: "CK09S", meubles: "CK02X", countertop: "GY03",
      base: ["sink450s", "bbq780", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "wheels", "teppan", "shelf"]
    },
    {
      id: "u2", code: "U2", series: "ultra", size: 2900, name: "ULTRA 2900",
      image: "assets/u2-ultra-2900.jpg",
      coque: "CK03F", meubles: "CK16F", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u3", code: "U3", series: "ultra", size: 2900, name: "ULTRA 2900",
      image: "assets/u3-ultra-2900.jpg",
      coque: "CK01F", meubles: "CK06M", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u4", code: "U4", series: "ultra", size: 2900, name: "ULTRA 2900",
      image: "assets/u4-ultra-2900.jpg",
      coque: "CK03F", meubles: "CM23-Y", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u5", code: "U5", series: "ultra", size: 2900, name: "ULTRA 2900",
      image: "assets/u5-ultra-2900.jpg",
      coque: "CK02F", meubles: "CK01F", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u6", code: "U6", series: "ultra", size: 2900, name: "ULTRA 2900",
      image: "assets/u6-ultra-2900.jpg",
      coque: "CK05F", meubles: "CM12-Y", countertop: "GY03",
      base: ["sink560", "bbq780", "drawers", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u7", code: "U7", series: "ultra", size: 3200, name: "ULTRA 3200",
      image: "assets/u7-ultra-3200.jpg",
      coque: "CK02F", meubles: "CM26-Y", countertop: "GY03",
      base: ["sink560", "bbq780", "kamado", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u8", code: "U8", series: "ultra", size: 3200, name: "ULTRA 3200",
      image: "assets/u8-ultra-3200.jpg",
      coque: "CK09S", meubles: "CK04G-Y", countertop: "GY03",
      base: ["sink560", "bbq820", "kamado", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    },
    {
      id: "u9", code: "U9", series: "ultra", size: 3500, name: "ULTRA 3500",
      image: "assets/u9-ultra-3500.jpg",
      coque: "CK09S", meubles: "CM22-Y", countertop: "GY03",
      base: ["sink560", "bbq820", "drawers", "ice", "fridge"],
      options: ["rail", "socket", "led", "lamps", "hood", "tv", "wallcab", "wheels", "teppan", "shelf", "bin"]
    }
  ],

  sizes: [2200, 2900, 3200, 3500],

  swatches: {
    CK01F: "#e8e4dc",
    CK02F: "#8a7f72",
    CK02X: "#c4a8a8",
    CK03F: "#3a3a3a",
    CK05F: "#1a1a1a",
    CK05T: "#b8c9c4",
    CK06M: "#9a8b7a",
    CK09S: "#2a2d35",
    CK11F: "#4a6b6b",
    CK13F: "#d0d0d0",
    CK16F: "#2d4a3e",
    CK20F: "#6b6b4a",
    "CK04G-Y": "#6a7a82",
    "CM12-Y": "#b8956a",
    "CM22-Y": "#d4b896",
    "CM23-Y": "#c4a87a",
    "CM26-Y": "#4a3528",
    GY03: "#9a9a9a"
  }
};
