function playingInit()
{
//    window.addEventListener("beforeunload", function (e)
//    {
//        var confirmationMessage = 'You really wanna quit';
//
//        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
//    });
    
    if ( window["player"] == undefined || player.dead )
    {
        player = createPlayer(40, 40, 0.5, 1.4, playerName,true);
        console.log(player.x(), player.y());
    }

    renderer.setClearColor( 0x666699, 1);
    
    //inventory = [];
    
    players = {};
    
    entitys = {};

    hudInit();
}

function playingUpdate()
{
    player.update();
    hudUpdate();

    for( n in players )
    {
        players[n].update();
    }
    for (k in entitys)
    {
        if (entitys[k].update())
        {
            entitys[k].destroy();
            delete entitys[k];
        }
    }
    
    if (keysPressedNoHud(73))
    {
        toggleInventory();
    }
}


path1 = path2 = null;
function clickInvItem(path)
{
    if (path1 == null)
    {
        path1 = path;
    }
    else
    {
        path2 = path;
        send(["swapItems",path1,path2]);
        path1 = path2 = null;
    }
}

function generateInventoryWindow()
{
    invWindow = document.createElement("DIV");
    invWindow.className = "invWindow";
    
    invWindow.style.height = "500px";
    invWindow.style.width  = "500px";
    
    invWindow.style.position = "absolute";
    invWindow.style.top  = Math.round((window.innerHeight - 500)/2) + "px";
    invWindow.style.left = Math.round((window.innerWidth  - 500)/2) + "px";
    
    for ( var i = 0 ; i < inventory.length ; i++ )
    {
        var part = document.createElement("DIV");
        
        for ( var ii = 0 ; ii < inventory[i].length ; ii++ )
        {
            var itemContainer = document.createElement("DIV");
            itemContainer.style.display = "inline-block";
            itemContainer.style.height  = "60px";
            itemContainer.style.width   = "60px";
            itemContainer.style.border  = "2px solid black";
            var item = document.createElement("IMG");
            item.src = inventory[i][ii][1];
            item.style.margin = "0 auto";
            item.style.display = "block";
            item.onload = function()
            {
                if ( this.width > this.height )
                    this.style.width = (60) + "px";
                else
                    this.style.height = (60) + "px";
            };
            
            itemContainer.path = [i,ii];
            
            itemContainer.onclick = function()
            {
                clickInvItem( this.path );
            };
            
            itemContainer.appendChild(item);
            part.appendChild(itemContainer);
        }
        
        invWindow.appendChild(part);
    }
    
    oebc("hud").appendChild( invWindow );
}

function deleteInventoryWindow()
{
    if ( oebc("invWindow") )
        oebc("invWindow").remove();
    delete invWindow;
}

function toggleInventory()
{
    if ( inventoryWindowOpen() )
        deleteInventoryWindow();
    else
        generateInventoryWindow();
}

function inventoryWindowOpen()
{
    return (window["invWindow"] != undefined);
}

function playingDestroy()
{
    player.destroy();
    delete invWindow;
    
    // we should use the code below, but right now he playing state is now ready for this change.
//    delete inventory;
//    delete player;
//    
//    for (k in players)
//    {
//        players[k].destroy();
//        delete players[k];
//    }
//    delete players;
//    
//    for (k in entitys)
//    {
//        entitys[k].destroy();
//        delete entitys[k];
//    }
//    delete entitys;
}
