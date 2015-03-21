maxChatMsg = 200;

function hudInit()
{
    chatBox = document.createElement("DIV");
    chatBox.className = "chatBox";
    oebc("hud").appendChild( chatBox );

    chatTxt = document.createElement("DIV");
    chatTxt.className = "chatTxt";
    chatBox.appendChild( chatTxt );

    chatInput = document.createElement("INPUT");
    chatInput.className = "chatInput";
    chatInput.type = "text"
    chatBox.appendChild( chatInput );

    lifeBar = createHudBar( "life" , 100 , "rgba(255,255,255,0.5)" , "rgba(255,0,0,0.5)" );
    lifeBar.style.right = 0;
    lifeBar.style.bottom = 0;
    oebc("hud").appendChild( lifeBar );
    
    itemV = createHudBar( "itemV" , 30 , "rgba(255,255,255,0.5)" , "rgba(0,0,0,0.5)" );
    itemV.style.right = 110;
    itemV.style.bottom = 0;
    oebc("hud").appendChild( itemV );
    
    itemC = createHudBar( "itemC" , 30 , "rgba(255,255,255,0.5)" , "rgba(0,0,0,0.5)" );
    itemC.style.right = 150;
    itemC.style.bottom = 0;
    oebc("hud").appendChild( itemC );
    
    itemX = createHudBar( "itemX" , 30 , "rgba(255,255,255,0.5)" , "rgba(0,0,0,0.5)" );
    itemX.style.right = 190;
    itemX.style.bottom = 0;
    oebc("hud").appendChild( itemX );
    
    itemZ = createHudBar( "itemZ" , 30 , "rgba(255,255,255,0.5)" , "rgba(0,0,0,0.5)" );
    itemZ.style.right = 230;
    itemZ.style.bottom = 0;
    oebc("hud").appendChild( itemZ );
    
    tpBar = createHudBar( "tp" , 30 , "rgba(255,255,255,0.5)" , "rgba(0,0,0,0.5)" );
    tpBar.style.right = 270;
    tpBar.style.bottom = 0;
    oebc("hud").appendChild( tpBar );

    chatInput.addEventListener("click",chatInputFocus);
    document.addEventListener("click",chatFocusHandler);

    chatFade = [];

    chatTxt.style.maxHeight = chatBox.clientHeight - chatInput.clientHeight - 15;
    
}

function createHudBar(name,width,bcColor,ftColor)
{
    container = document.createElement("div");
    container.className = name + "Container";
    
    barDiv = document.createElement("div");
    barDiv.className = name + "Bar";
    
    container.appendChild(barDiv);
    
    container.style.height = "30px";
    container.style.width  = width + "px";
    
    container.style.position = "absolute";
    
    container.style.backgroundColor = bcColor;
    barDiv.style.backgroundColor    = ftColor;
    
    barDiv.style.height = "100%";
    barDiv.style.width  = "100%";
    
    return container;
}

function setPlayerLifeHUD(v,max)
{
    v = Math.max(v,0);
    oebc("lifeBar").style.width = (v/max*100) + "%";
}
function setItemVBar(v,max)
{
    v = Math.min(v,max);
    v = Math.max(v,0);
    v = max-v;
    
    if (v==0) oebc("itemVContainer").style.backgroundColor = "rgba(190,255,190,0.5)";
    else      oebc("itemVContainer").style.backgroundColor = "rgba(255,255,255,0.5)";
    
    oebc("itemVBar").style.width = (v/max*100) + "%";
}
function setItemCBar(v,max)
{
    v = Math.min(v,max);
    v = Math.max(v,0);
    v = max-v;
    
    if (v==0) oebc("itemCContainer").style.backgroundColor = "rgba(190,255,190,0.5)";
    else      oebc("itemCContainer").style.backgroundColor = "rgba(255,255,255,0.5)";
    
    oebc("itemCBar").style.width = (v/max*100) + "%";
}
function setItemXBar(v,max)
{
    v = Math.min(v,max);
    v = Math.max(v,0);
    v = max-v;
    
    if (v==0) oebc("itemXContainer").style.backgroundColor = "rgba(190,255,190,0.5)";
    else      oebc("itemXContainer").style.backgroundColor = "rgba(255,255,255,0.5)";
    
    oebc("itemXBar").style.width = (v/max*100) + "%";
}
function setItemZBar(v,max)
{
    v = Math.min(v,max);
    v = Math.max(v,0);
    v = max-v;
    
    if (v==0) oebc("itemZContainer").style.backgroundColor = "rgba(190,255,190,0.5)";
    else      oebc("itemZContainer").style.backgroundColor = "rgba(255,255,255,0.5)";
    
    oebc("itemZBar").style.width = (v/max*100) + "%";
}
function setTp(v)
{
    v = Math.max(v,0);
    
    if (v==0) oebc("tpContainer").style.backgroundColor = "rgba(190,255,190,0.5)";
    else      oebc("tpContainer").style.backgroundColor = "rgba(255,255,255,0.5)";
    
    oebc("tpBar").style.width = (v/1000*100) + "%";
}

function hudUpdate()
{
    if(keysReleasedHud(13) && document.activeElement == chatInput && chatInput.value != "")
    {
        send(["chatMsg", chatInput.value]);
        chatInput.value = "";
    }

    if(keysReleasedHud(84) && document.activeElement != chatInput)
    {
        chatInputFocus();
    }

    if(chatHasFocus() && keysHud(27))
    {
        chatInputBlur();
    }

    if(chatTxt.children.length > maxChatMsg)
    {
        for(var i = 0; i < chatTxt.children.length - maxChatMsg; i++)
        {
            chatTxt.children[i].remove();
        }
    }

    for(var i = 0; i < chatFade.length; i++)
    {
        chatFade[i].opacityVar -= 0.01;
        chatFade[i].style.opacity = chatFade[i].opacityVar;

        if( chatFade[i].opacityVar <= 0 )
        {
            chatFade[i].className += " hidden";
            chatFade.splice(i,1);
        }
    }
}

function chatReceive(msg)
{
    var hasToScroll = chatTxt.scrollHeight - parseInt( chatTxt.style.maxHeight.split("px")[0] ) == chatTxt.scrollTop || chatTxt.scrollTop == 0;

    var newMessageDiv = document.createElement("DIV");
    newMessageDiv.textContent = msg;
    newMessageDiv.style.opacity = 4;
    newMessageDiv.opacityVar = 4;

    chatTxt.appendChild(newMessageDiv);
    chatFade.push(newMessageDiv);

    if(hasToScroll || !chatHasFocus())
    {
        scrollChatToBottom();
    }
}

function chatInputFocus()
{
    chatInput.focus();
    focusNode = hudDiv;

    if(!chatHasFocus())
    {
        chatTxt.className += " chatTxtFocus";
    }
    scrollChatToBottom();
}

function chatInputBlur()
{
    scrollChatToBottom();
    chatInput.value = "";
    chatInput.blur();
    chatTxt.className = chatTxt.className.replace(" chatTxtFocus", "");
    focusNode = gameDiv;
}

function chatFocusHandler(e)
{
    if(e.toElement != chatTxt && e.toElement.parentElement != chatTxt && e.toElement != chatInput)
        chatInputBlur();
}

function chatHasFocus()
{
    return chatTxt.className.indexOf("chatTxtFocus") != -1
}

function scrollChatToBottom()
{
    chatTxt.scrollTop = chatTxt.scrollHeight - parseInt( chatTxt.style.maxHeight.split("px")[0] );
}

function hudDestroy()
{
    chatInput.removeEventListener("click",chatInputFocus);
    document.removeEventListener("click",chatFocusHandler);

    while (hudDiv.firstChild)
    {
        hudDiv.removeChild(hudDiv.firstChild);
    }
}

// Example for right click
//document.addEventListener('contextmenu', function(ev)
//{
//    ev.preventDefault();
//}, false);
