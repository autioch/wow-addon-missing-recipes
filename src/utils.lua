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

NS.log = log
NS.pairsByKeys = pairsByKeys
NS.createModal = createModal
