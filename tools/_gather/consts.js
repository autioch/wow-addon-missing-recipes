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

const WH_VAR_NAMES = ['WH', 'Listview', 'Tabs', 'g_users', 'LANG', 'lv_comments0', 'lv_screenshots', 'lv_videos', 'window'];

const TABLES = {
  '1:4': 'vendors',
  '2:4': 'worldObjects',
  '3:4': 'items',
  '4:4': 'sets',
  '5:4': 'quests',
  '6:4': 'spells',
  '7:4': 'zones',
  '15:4': 'professions'
};

module.exports = {
  PROFESSIONS,
  IGNORED_LISTS,
  WH_VAR_NAMES,
  TABLES
};
