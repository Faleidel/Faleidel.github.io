function init()
{
    gameDiv = oebc("game");
    hudDiv = oebc("hud");
    focusNode = undefined;

    deathDiv = oebc("death");

    initThreeJs();
    
    keys = {};
    keysPressed = {};
    keysReleased = {};

    setState('login');
}

document.onclick = function(e)
{
    focusNode = e.toElement;
}

function focusedDiv()
{
    currentNode = focusNode;
    while(1 == 1)
    {
        if(currentNode == gameDiv )
        {
            return gameDiv;
        }
        else if( currentNode == hudDiv 
              || currentNode == document.body 
              || currentNode == document.getElementsByTagName("html")[0] 
              || currentNode == document 
              || currentNode == null 
              || currentNode == undefined )
        {
            return hudDiv;
        }

        currentNode = currentNode.parentNode
    }
}

function updateKeys()
{
    keysPressed = {};
    keysReleased = {};
}

function keyDown(e)
{
	var evt = e || event.keyCode;
	var press = evt.which || event.keyCode;
	
	if ( window["logKeys"] != undefined )
	    console.log("down",press);
	
	if ( !keys[press+""] )
	    keysPressed[ press+"" ] = true;
	keys[ press+"" ] = true;
	keysReleased[ press+"" ] = false;
}

function keyUp(e)
{
	var evt = e || event.keyCode;
	var press = evt.which || event.keyCode;
	
	if ( window["logKeys"] != undefined )
	    console.log("up",press);
	
	keys[ press+"" ] = false;
	keysPressed[ press+"" ] = false;
	keysReleased[ press+"" ] = true;
}

function keysNoHud(key)
{
    if(focusedDiv() == gameDiv)
        return keys[key];
    return false;
}

function keysHud(key)
{
    return keys[key];
}

function keysPressedNoHud(key)
{
    if(focusedDiv() == gameDiv)
        return keysPressed[key];
    return false;
}

function keysPressedHud(key)
{
    return keysPressed[key];
}

function keysReleasedNoHud(key)
{
    if(focusedDiv() == gameDiv)
        return keysReleased[key];
    return false;
}

function keysReleasedHud(key)
{
    return keysReleased[key];
}
