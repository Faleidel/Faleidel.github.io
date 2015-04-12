function playingInit()
{
//    window.addEventListener("beforeunload", function (e)
//    {
//        var confirmationMessage = 'You really wanna quit';
//
//        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
//    });
    
    generateBackground();
    
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

function generateBackground()
{
    sunGeo = createRectangle( 0 , 0 , 10 , 10 , "images/sun.png" );
    sunGeo.position.z = -1;
    sunX = 0;
    sunY = 0;
    scene.add(sunGeo);
    
    
    clouds = [];
    
    for ( var i = 0 ; i < Math.random()*5 ; i++ )
    {
        var cl = {};
        
        cl.geo = createRectangle( 0 , 0 , 10 , 10 , "images/cloud1.png" );
        cl.geo.position.z = 0.5;
        cl.x = Math.random()*60-30;
        cl.y = Math.random()*20-10;
        cl.speed = Math.random()*0.03;
        
        scene.add( cl.geo );
        clouds.push( cl );
    }
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
    
    sunX += 0.001;
    if (sunX > 32) sunX = -32;
    sunGeo.position.x = camera.position.x + sunX;
    sunGeo.position.y = camera.position.y + sunY;
    
    for ( i in clouds )
    {
        var cl = clouds[i];
        
        cl.x -= cl.speed;
        if (Math.abs(cl.x) > 32)
        {
            cl.x = 32;
            cl.y = Math.random()*20-10;
            cl.speed = Math.random()*0.03;
        }
        cl.geo.position.x = camera.position.x + cl.x;
        cl.geo.position.y = camera.position.y + cl.y;
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
            item.src = inventory[i][ii][2];
            itemContainer.stringName = inventory[i][ii][1];
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
            
            itemContainer.onmouseover = function()
            {
                oebc("inventoryToolTip").innerHTML = this.stringName;
            };
            
            itemContainer.onclick = function()
            {
                clickInvItem( this.path );
            };
            
            itemContainer.appendChild(item);
            part.appendChild(itemContainer);
        }
        
        invWindow.appendChild(part);
    }
    
    tTip = document.createElement("DIV");
    tTip.className = "inventoryToolTip";
    
    invWindow.appendChild(tTip);
    
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
    
    scene.remove( sunGeo );
    scene.remove( tileMapGeo );
    scene.remove( tileMapGeo2 );
    scene.remove( tileMapGeo3 );
    scene.remove( tileMapGeo11 );
    scene.remove( tileMapGeo22 );
    scene.remove( tileMapGeo33 );
    
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
