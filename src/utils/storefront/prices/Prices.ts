interface Prices {
  characters: {
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
    dark: number;
    dc: number;
    gaminglegends: number;
    frozen: number;
    lava: number;
    marvel: number;
    shadow: number;
    icon: number;
  };
  pickaxes: {
    uncommon: number;
    rare: number;
    epic: number;
    icon: number;
    dark: number;
    frozen: number;
  };
  gliders: {
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
    icon: number;
    dc: number;
    dark: number;
    frozen: number;
  };
  wraps: {
    uncommon: number;
    rare: number;
    epic: number;
  };
  dances: {
    uncommon: number;
    rare: number;
    epic: number;
    icon: number;
    marvel: number;
    dc: number;
  };
}

const Prices: Prices = {
  characters: {
    uncommon: 800,
    rare: 1200,
    epic: 1500,
    legendary: 2000,
    dark: 800,
    dc: 1200,
    gaminglegends: 1200,
    frozen: 1200,
    lava: 1200,
    marvel: 1500,
    shadow: 1200,
    icon: 1500,
  },
  pickaxes: {
    uncommon: 500,
    rare: 800,
    epic: 1200,
    icon: 500,
    dark: 1200,
    frozen: 1000,
  },
  gliders: {
    uncommon: 500,
    rare: 800,
    epic: 1200,
    legendary: 1500,
    icon: 500,
    dc: 1200,
    dark: 500,
    frozen: 1000,
  },
  wraps: {
    uncommon: 300,
    rare: 500,
    epic: 500,
  },
  dances: {
    uncommon: 200,
    rare: 500,
    epic: 800,
    icon: 500,
    marvel: 500,
    dc: 300,
  },
};

export = Prices;
