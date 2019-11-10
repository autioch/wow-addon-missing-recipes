local A, NS = ...

local listModal = CreateFrame('Frame', 'MissingRecipesModal', UIParent)

local function hide ()
  listModal:Hide()
end

listModal:SetFrameStrata("FULLSCREEN_DIALOG")
listModal:SetSize(500, 200)
listModal:SetPoint('CENTER')
listModal:SetBackdrop({
	bgFile   = "Interface\\DialogFrame\\UI-DialogBox-Background",
	edgeFile = "Interface\\DialogFrame\\UI-DialogBox-Border",
  tile = true,
  tileSize = 32,
  edgeSize = 32,
  insets = { left = 4, right = 4, top = 4, bottom = 4 }
});
listModal:SetBackdropColor(0, 0, 0, 1);
listModal:EnableMouse(true)
listModal:EnableMouseWheel(true)
listModal:SetMovable(true)
listModal:SetResizable(true)
listModal:RegisterForDrag("LeftButton")
listModal:SetScript("OnDragStart", listModal.StartMoving)
listModal:SetScript("OnDragStop", listModal.StopMovingOrSizing)


local xButton = NS.createButton('Close', hide, 20)

NS.attachFrame(xButton, listModal)
xButton:SetPoint("BOTTOM")

listModal:Hide()


NS.setScroll(listModal, function () end)

NS.listModal = listModal
