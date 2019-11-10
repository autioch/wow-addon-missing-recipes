local A, NS = ...

local function showModal()
  local tradeSkillName = NS.getProfessionName()
  local recipes = NS.getUnlearnedRecipes(tradeSkillName)
  local previousRow

	for name in NS.pairsByKeys(recipes) do
    local row = NS.listModal:CreateFontString(nil,"ARTWORK","GameFontNormal")


    -- NS.attachFrame(row, NS.listModal)
    row:SetText(name)

    if (previousRow) then
      row:SetPoint("TOP", previousRow, "BOTTOM")
    else
      row:SetPoint("TOP", NS.listModal, "TOP")
    end

    row:SetPoint("LEFT", NS.listModal, "LEFT")
    previousRow = row
	end

  NS.listModal:Show()
end

NS.openButton:SetScript('OnClick', showModal)
