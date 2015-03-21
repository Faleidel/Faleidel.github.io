function send(msg)
{
    co.send(JSON.stringify(msg));
}

ip = "faleidel.mooo.com";
port = "3075";

function openConnection(name, pass)
{
    //ip = "192.168.0.101";
    //ip = "192.168.1.104";
    co = new WebSocket("ws://" + ip + ":" + port);
    co.onmessage = parseMessage;
    co.onclose = function(e){ console.log("onclose",e.data); };

    co.onopen = function()
    {
        send(["connection", name, pass ]);
    };
}

function parseMessage(e)
{
    msg = JSON.parse(e.data);
    
    if (window["logMsgs"])
        console.log(msg);
    
    var msgType = msg[0];
    
    if(msgType == "initMap")
    {
        if (stateName != "playing")
            changeState("playing");
        
        for (k in lastPositions)
            scene.remove( lastPositions[k].geo );
        lastPositions = {};
        tileMap = msg[1].blocks;
        
        for (k in entitys)
        {
            scene.remove(entitys[k].geo);
        }
        entitys = {};
        
        if (window["tileMapGeo"] != undefined)
        {
            scene.remove( tileMapGeo );
        }
        if (window["portals"] != undefined)
        {
            for (i in portals)
            {
                scene.remove( portals[i].geo );
            }
        }
        
        for ( k in players )
        {
            removePlayer(players[k]);
        }
        
        portals = [];
        
        for ( i in msg[1].portals )
        {
            var p = msg[1].portals[i];
            
            portals.push( createPortal(p) );
        }
        
        var geometry = new THREE.Geometry();
        
        var vertCount = 0;
        
        for ( var x = 0 ; x < tileMap.length ; x ++ )
            for ( var y = 0 ; y < tileMap[x].length ; y ++ )
            {
                if ( tileMap[x][y] == 1 )
                {
                    geometry.vertices.push(
                        new THREE.Vector3(0+x,0+y,0),
                        new THREE.Vector3(0+x,1+y,0),
                        new THREE.Vector3(1+x,1+y,0),
                        new THREE.Vector3(1+x,0+y,0)
                    );
                    
                    geometry.faces.push( new THREE.Face3( 0+vertCount, 1+vertCount, 2+vertCount ) );
                    geometry.faces.push( new THREE.Face3( 0+vertCount, 2+vertCount, 3+vertCount ) );
                    
                    vertCount += 4;
                    
                }
            }
        
        assignUVs( geometry );
        
        //var material = new THREE.MeshBasicMaterial( {color: 0x0010E5, side: THREE.DoubleSide} );
        var img = THREE.ImageUtils.loadTexture("images/earth1.png");
        img.wrapS = img.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial( {map: img, side: THREE.DoubleSide} );
        material.depthWrite = false;
        tileMapGeo = new THREE.Mesh( geometry , material );
        scene.add( tileMapGeo );
    }
    else if(msgType == "createPortal")
    {
        portals.push( creatPortal([msg[1]]) );
    }
    else if(msgType == "cp")
    {
        if(msg[1] != player.name)
        {
            chatReceive("Player " + msg[1] + " connected");
            players[msg[1]] = createPlayer(0, 0, 0.5, 1.4, msg[1]);
        }
    }
    else if(msgType == "rp")
    {
        if ( players[msg[1]] )
        {
            removePlayer( players[msg[1]] );
        }
    }
    else if(msgType == "upp") //Update player position
    {
        if(msg[1] != player.name)
        {
            var p = players[msg[1]];
            p.geo.position.x = msg[2];
            p.geo.position.y = msg[3];
            p.qp.angle = msg[4];
            setPlayerCrouching( p , msg[5] );
        }
    }
    else if (msgType == "forcePlayerPos")
    {
    	player.x( msg[1] );
    	player.y( msg[2] );
    }
    else if(msgType == "chatMsg")
    {
        chatReceive(msg[1]);
    }
    else if(msgType == "lifeStatus")
    {
        player.life = msg[1];
        setPlayerLifeHUD(player.life,100);
    }
    else if(msgType == "impulse")
    {
        console.log("impulse");
        player.velX += msg[1];
        player.velY += msg[2];
    }
    else if(msgType == "ce")
    {
        var type = msg[3];
        var id   = msg[4];
        
        if ( type == "arrow" )
        {
            var arrow = createArrow( msg[1] , msg[2] , 0 );
            arrow.velX = msg[5][0];
            arrow.velY = msg[5][1];
            
            entitys[id] = arrow;
        }
        else if ( type == "tree" )
        {
            var img = msg[5][0];
            var width = msg[5][1];
            var height = msg[5][2];
            geo = createRectangle( msg[1] , msg[2] , width , height , "images/" + img + ".png" );
            
            var e = {geo:geo}
            e.update = function(){};
            
            entitys[id] = e;
            scene.add( geo );
        }
        else if ( type == "explosion" )
        {
            var explosion = createExplosion( msg[1] , msg[2] );
            entitys[id] = explosion;
        }
        else
        {
            console.log("Error with message " , msg , "type is invalide");
        }
    }
    else if(msgType == "de")
    {
        // Some entity kill themself on the client before the server tell it to die.
        // This is because (for example) when an arrow collide with the tile map we know we have to destroy it.
        // So the check here CAN hide some bugs but it has it use.
        if ( entitys[msg[1]] != undefined )
        {
            scene.remove( entitys[msg[1]].geo );
            delete entitys[ msg[1] ];
        }
    }
    else if(msgType == "death")
    {
        changeState("death");
    }
    else if(msgType == "inventory")
    {
        console.log("inventory",msg);
        inventory = msg[1];
        if ( inventoryWindowOpen() )
        {
            deleteInventoryWindow();
            generateInventoryWindow();
        }
    }
    else
    {
        console.log("Don't know what to do with this message : ",e.data);
    }
}
