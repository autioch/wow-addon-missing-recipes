local A, NS = ...

-- Creates an iterator of a table, to be used in for-in.
local function pairsByKeys(tble, sortFn)
  local a = {}

  for n in pairs(tble) do
    table.insert(a, n)
  end

  table.sort(a, sortFn)

  local i = 0
  local iter = function ()
    i = i + 1

    if a[i] == nil then
      return nil
    else
      return a[i], tble[a[i]]
    end
  end

  return iter
end

-- Customized print to the chat window.
local function log(message)
  print('MissingRecipes: '..message)
end

local function listenToGlobalEvent(eventName, eventHandler)
  local eventFrame = CreateFrame("Frame", nil, UIParent);
  eventFrame:RegisterEvent(eventName);
  eventFrame:SetScript("OnEvent", eventHandler);
end

local function getProfessionName()
  return string.lower(GetTradeSkillLine())
end

NS.log = log
NS.pairsByKeys = pairsByKeys
NS.listenToGlobalEvent = listenToGlobalEvent
NS.getProfessionName = getProfessionName
