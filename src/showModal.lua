local A, NS = ...

local modalCache = nil

local function createButton(parentFrame, OnClick)
  local btnClose = CreateFrame("Button", "MissingRecipesButton", parentFrame, "UIPanelButtonTemplate")
  btnClose:SetPoint("TOPRIGHT")
  btnClose:SetSize(24,24)
  btnClose:SetText("x")
  btnClose:SetFrameStrata("FULLSCREEN")
  btnClose:SetScript("OnClick", OnClick)
end

local function createModal(width, height)
  local modal = CreateFrame("ScrollFrame", "MissingRecipesModal", UIParent, "InputScrollFrameTemplate")

  local function hide ()
  	modal.EditBox:SetText('')
    modal.EditBox:ClearFocus()
    modal:Hide()
  end

  modal:SetPoint("CENTER")
  modal.CharCount:Hide()
  modal:SetSize(width, height)

  createButton(modal, hide)

  modal.EditBox:SetFont("Fonts\\ARIALN.ttf", 13)
  modal.EditBox:SetWidth(modal:GetWidth())
  modal.EditBox:SetScript("OnEscapePressed", hide)

  return modal
end

local function getModal()
  if (modalCache == nil) then
    modalCache = createModal(500,200)
  end

  return modalCache
end

local function showModal(recipes)
  local modal = getModal()


  modal.EditBox:SetText('')

	for name in NS.pairsByKeys(recipes) do
		modal.EditBox:Insert(name)
		modal.EditBox:Insert("\n")
	end

  modal.EditBox:SetFocus()
  modal:Show()
end

NS.showModal = showModal
