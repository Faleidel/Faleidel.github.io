function send(msg)
{
    co.send(JSON.stringify(msg));
}

ip = "faleidel.mooo.com";
port = "3075";

function openConnection(name, pass)
{
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
        if (window["tileMapGeo2"] != undefined)
        {
            scene.remove( tileMapGeo2 );
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
        
        var geometry2 = new THREE.Geometry();
        var vertCount2 = 0;
        
        var geometry3 = new THREE.Geometry();
        var vertCount3 = 0;
        
        collisionTileMap = JSON.parse(JSON.stringify( tileMap ));
        
        for ( var x = 0 ; x < tileMap.length ; x ++ )
            for ( var y = 0 ; y < tileMap[x].length ; y ++ )
            {
                if (collisionTileMap[x][y] == 3)
                    collisionTileMap[x][y] = 1;
                if (collisionTileMap[x][y] == 4)
                    collisionTileMap[x][y] = 1;
                
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
                else if ( tileMap[x][y] == 2 )
                {
                    geometry2.vertices.push(
                        new THREE.Vector3(0+x,0.8+y,0),
                        new THREE.Vector3(0+x,1+y,0),
                        new THREE.Vector3(1+x,1+y,0),
                        new THREE.Vector3(1+x,0.8+y,0)
                    );
                    
                    geometry2.faces.push( new THREE.Face3( 0+vertCount2, 1+vertCount2, 2+vertCount2 ) );
                    geometry2.faces.push( new THREE.Face3( 0+vertCount2, 2+vertCount2, 3+vertCount2 ) );
                    
                    vertCount2 += 4;
                }
                else if ( tileMap[x][y] == 3 )
                {
                    geometry2.vertices.push(
                        new THREE.Vector3(0+x,0+y,0),
                        new THREE.Vector3(0+x,1+y,0),
                        new THREE.Vector3(1+x,1+y,0),
                        new THREE.Vector3(1+x,0+y,0)
                    );
                    
                    geometry2.faces.push( new THREE.Face3( 0+vertCount2, 1+vertCount2, 2+vertCount2 ) );
                    geometry2.faces.push( new THREE.Face3( 0+vertCount2, 2+vertCount2, 3+vertCount2 ) );
                    
                    vertCount2 += 4;
                }
                else if ( tileMap[x][y] == 4 )
                {
                    geometry3.vertices.push(
                        new THREE.Vector3(0+x,0+y,0),
                        new THREE.Vector3(0+x,1+y,0),
                        new THREE.Vector3(1+x,1+y,0),
                        new THREE.Vector3(1+x,0+y,0)
                    );
                    
                    geometry3.faces.push( new THREE.Face3( 0+vertCount3, 1+vertCount3, 2+vertCount3 ) );
                    geometry3.faces.push( new THREE.Face3( 0+vertCount3, 2+vertCount3, 3+vertCount3 ) );
                    
                    vertCount3 += 4;
                }
            }
        
        assignUVs( geometry );
        assignUVs( geometry2 );
        assignUVs( geometry3 );
        
        var img = THREE.ImageUtils.loadTexture("images/earth1.png");
        img.wrapS = img.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshBasicMaterial( {map: img, side: THREE.DoubleSide} );
        material.depthWrite = false;
        material.transparent = true;
        tileMapGeo11 = new THREE.Mesh( geometry , material );
        tileMapGeo11.position.x += 0.1;
        tileMapGeo11.position.y += 0.1;
        tileMapGeo11.position.z -= 0.1;
        scene.add( tileMapGeo11 );
        
        var img2 = THREE.ImageUtils.loadTexture("images/stoneBrick1.png");
        img2.wrapS = img2.wrapT = THREE.RepeatWrapping;
        var material2 = new THREE.MeshBasicMaterial( {map: img2, side: THREE.DoubleSide} );
        material2.depthWrite = false;
        material2.transparent = true;
        tileMapGeo22 = new THREE.Mesh( geometry2 , material2 );
        tileMapGeo22.position.x += 0.1;
        tileMapGeo22.position.y += 0.1;
        tileMapGeo22.position.z -= 0.1;
        scene.add( tileMapGeo22 );
        
        var img3 = THREE.ImageUtils.loadTexture("images/grass1.png");
        img3.wrapS = img3.wrapT = THREE.RepeatWrapping;
        var material3 = new THREE.MeshBasicMaterial( {map: img3, side: THREE.DoubleSide} );
        material3.depthWrite = false;
        material3.transparent = true;
        tileMapGeo33 = new THREE.Mesh( geometry3 , material3 );
        tileMapGeo33.position.x += 0.1;
        tileMapGeo33.position.y += 0.1;
        tileMapGeo33.position.z -= 0.1;
        scene.add( tileMapGeo33 );
        
        tileMapGeo = new THREE.Mesh( geometry , material );
        scene.add( tileMapGeo );
        tileMapGeo2 = new THREE.Mesh( geometry2 , material2 );
        scene.add( tileMapGeo2 );
        tileMapGeo3 = new THREE.Mesh( geometry3 , material3 );
        scene.add( tileMapGeo3 );
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
            
            e.x = msg[1];
            e.y = msg[2];
            
            e.update = function()
            {
                this.geo.position.x = this.x;
                this.geo.position.y = this.y;
            };
            e.destroy = function()
            {
                scene.remove( this.geo );
            };
            
            entitys[id] = e;
            scene.add( geo );
        }
        else if ( type == "explosion" )
        {
            for(var i = 0; i < 5; i++)
            {
            	var arrow = createArrow( msg[1] , msg[2]+0.25 , 0  , {life: 10 , img: "images/flame1.png" , w: 10 , h: 10 , noWall:true });
            	arrow.velX = Math.random()*0.5-0.25;
            	arrow.velY = Math.random()*0.25;            
            	entitys[Math.random()+""] = arrow;
            }
        }
        else if ( type == "laser" )
        {
            var angle = msg[5][0];
            var w = msg[5][1];
            var h = 0.5
            var x = msg[1] - trustX(angle, w/2 );
            var y = msg[2] - trustY(angle, w/2);
            var arrow = createArrow( x , y , 0  , {life: 100 , img: "images/laser1.png" , w: msg[5][1] , h: h , noWall:true , angle:msg[5][0] , noGrav:true , fadeOut:true });            
            entitys[id] = arrow;
        }
        else
        {
            console.log("Error with message " , msg , "type is invalide");
        }
    }
    else if(msgType == "ue")
    {
        var id = msg[1];
        var x = msg[2];
        var y = msg[3];
        
        entitys[id].x = x;
        entitys[id].y = y;
    }
    else if(msgType == "de")
    {
        // Some entity kill themself on the client before the server tell it to die.
        // This is because (for example) when an arrow collide with the tile map we know we have to destroy it.
        // So the check here CAN hide some bugs but it has it use.
        if ( entitys[msg[1]] != undefined )
        {
            entitys[msg[1]].destroy();
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
