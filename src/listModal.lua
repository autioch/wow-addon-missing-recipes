local A, NS = ...

local listModal = CreateFrame('ScrollFrame', 'MissingRecipesModal', UIParent, 'InputScrollFrameTemplate')

local function hide ()
	listModal.EditBox:SetText('')
  listModal.EditBox:ClearFocus()
  listModal:Hide()
end

listModal:SetPoint('CENTER')
listModal.CharCount:Hide()
listModal:SetSize(500, 200)

local xButton = NS.createButton(' x ', hide, 20)

NS.attachFrame(xButton, listModal)
xButton:SetFrameStrata("FULLSCREEN")
xButton:SetPoint("TOPRIGHT")

listModal.EditBox:SetFont('Fonts\\ARIALN.ttf', 13)
listModal.EditBox:SetWidth(listModal:GetWidth())
listModal.EditBox:SetScript('OnEscapePressed', hide)

listModal:Hide()

NS.listModal = listModal
