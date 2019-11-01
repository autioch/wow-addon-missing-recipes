local A, NS = ...

local IGNORED_SKILL_TYPE = 'header'
local CLOSE_TRADE_SKILL_ID = 'unknown'

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
  local unlearnedRecipes = getKnownRecipes()
  local missing = {}

  NS.log(tradeSkillName)

  for name in pairs(NS.DB[tradeSkillName]) do
    if (unlearnedRecipes[name]) then
      -- Do nothing.
    else
      missing[name] = true
    end
  end

  return missing
end

-- Finds out name of the currently open trade skill if any.
local function getOpenTradeSkillName()
  local tradeSkillName = string.lower(GetTradeSkillLine())
  local isTradeSkillOpen = tradeSkillName == CLOSE_TRADE_SKILL_ID

  if (isTradeSkillOpen) then
    return false
  else
    return tradeSkillName
  end
end

NS.getUnlearnedRecipes = getUnlearnedRecipes
NS.getOpenTradeSkillName = getOpenTradeSkillName
