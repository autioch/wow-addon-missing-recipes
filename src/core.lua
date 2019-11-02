local A, NS = ...

local IGNORED_SKILL_TYPE = 'header'

-- Provides a table of know recipes.
-- Assumes that a profession window is open.
local function getKnownRecipes()
  local known = {}

  for i = 1, GetNumTradeSkills() do

    skillName, skillType = GetTradeSkillInfo(i)

    if (skillType ~= IGNORED_SKILL_TYPE) then
      known[skillName] = true
    end
  end

  return known
end

-- Provides a table of existing recipes that are not yet learned.
local function getUnlearnedRecipes(tradeSkillName)
  local allRecipes = NS.DB[tradeSkillName] or {}
  local knownRecipes = getKnownRecipes()
  local missing = {}

  for name in pairs(allRecipes) do
    if (knownRecipes[name]) then
      -- Do nothing.
    else
      missing[name] = true
    end
  end

  return missing
end

NS.getUnlearnedRecipes = getUnlearnedRecipes
