local A, NS = ...

-- Setup button
local openButton = CreateFrame('Button', nil, UIParent, 'UIPanelButtonTemplate')
openButton:SetHeight(20)
openButton:SetScript('OnEnter', showTooltip)
openButton:SetScript('OnLeave', hideTooltip)
openButton:SetText('MR')
openButton:SetWidth(openButton:GetTextWidth() + 10)

-- Show tooltip for the button
local function showTooltip (self)
  GameTooltip_SetDefaultAnchor(GameTooltip, self)
  GameTooltip:SetText('Open list of missing recipes')
  GameTooltip:Show()
end

-- Hide tooltip for the button
local function hideTooltip()
  GameTooltip:Hide()
end

local buttonAttached = false

-- Attach button
-- This can be done only on opening the professions modal, do this only once.
local function attachButton()
  if (buttonAttached) then
    return
  end

  buttonAttached = true

	openButton:SetParent(TradeSkillFrame)
  openButton:SetFrameLevel(TradeSkillFrame:GetFrameLevel() + 1)
  openButton:SetFrameStrata(TradeSkillFrame:GetFrameStrata())
  openButton:SetPoint("RIGHT", TradeSkillFrameCloseButton, "LEFT",4,0)
  openButton:Show()
  openButton:Enable()
end

NS.listenToGlobalEvent('TRADE_SKILL_SHOW', attachButton)

NS.openButton = openButton
