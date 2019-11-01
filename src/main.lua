local A, NS = ...

SLASH_MISSINGRECIPES1 = '/mr'
SLASH_MISSINGRECIPES2 = '/missingrecipes'

local function getRecipesToShow()
  local tradeSkillName = NS.getOpenTradeSkillName()

  if(tradeSkillName) then
    if (NS.DB[tradeSkillName]) then
      return NS.getUnlearnedRecipes(tradeSkillName)
    else
      NS.log(tradeSkillName..' is not yet supported.')
      return false
    end
  end

  NS.log('Open a trade skill to list missing recipes.')
  return false
end

local modalCache = nil

local function getModal()
  if (modalCache == nil) then
    modalCache = NS.createModal(500,200)
  end

  return modalCache
end

SlashCmdList['MISSINGRECIPES'] = function()
  local recipes = getRecipesToShow()

  if (recipes == false) then
    return
  end

  local modal = getModal()


  modal.EditBox:SetText('')

	for name in NS.pairsByKeys(recipes) do
		modal.EditBox:Insert(name)
		modal.EditBox:Insert("\n")
	end

  modal.EditBox:SetFocus()
  modal:Show()
end
