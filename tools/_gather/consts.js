const PROFESSIONS = {
  ALCHEMY: 'alchemy',
  BLACKSMITHING: 'blacksmithing',
  ENCHANTING: 'enchanting',
  ENGINEERING: 'engineering',
  LEATHERWORKING: 'leatherworking',
  TAILORING: 'tailoring',

  MINING: 'mining',
  HERBALISM: 'herbalism',
  SKINNING: 'skinning',

  COOKING: 'cooking',
  FIRST_AID: 'first-aid',
  FISHING: 'fishing'
};

const IGNORED_LISTS = {
  guides: true,
  comments: true,
  screenshots: true,
  quests: true,
  'required-by': true
};

const HANG_DELAY = 10000;

module.exports = {
  PROFESSIONS,
  IGNORED_LISTS,
  HANG_DELAY
};
