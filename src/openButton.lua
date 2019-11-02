local A, NS = ...

local openButton = NS.createButton('MR', false, 20)

NS.setFrameTooltip(openButton, 'Open list of missing recipes')

-- Attach button
-- This can be done only on opening the professions modal, do this only once.
local buttonAttached = false

local function attachButton()
  if (buttonAttached) then
    return
  end

  buttonAttached = true

  NS.attachFrame(openButton, TradeSkillFrame)

  openButton:SetPoint("RIGHT", TradeSkillFrameCloseButton, "LEFT", 4, 0)
end

NS.listenToGlobalEvent('TRADE_SKILL_SHOW', attachButton)

NS.openButton = openButton
