local A, NS = ...

local function showModal()
  local tradeSkillName = NS.getProfessionName()
  local recipes = NS.getUnlearnedRecipes(tradeSkillName)

  NS.listModal.EditBox:SetText('')

	for name in NS.pairsByKeys(recipes) do
		NS.listModal.EditBox:Insert(name)
		NS.listModal.EditBox:Insert("\n")
	end

  NS.listModal.EditBox:SetFocus()
  NS.listModal:Show()

end

NS.openButton:SetScript('OnClick', showModal)
