local A, NS = ...

local function showModal()
  local tradeSkillName = NS.getProfessionName()
  local recipes = NS.getUnlearnedRecipes(tradeSkillName)

  NS.showModal(recipes)
end

NS.openButton:SetScript('OnClick', showModal)
