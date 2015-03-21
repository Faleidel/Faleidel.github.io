lastPositions = {};
tpMode = false;
tpHalo = undefined;

defPlayerWidth = 0.5;
defPlayerHeight = 1.4;

tpStall = false;

cl = {};
cl["tpCoolDown"] = 0;
cl["tpCharge"] = 0;
cl["itemZ"] = 0;
cl["itemX"] = 0;
cl["itemC"] = 0;
cl["itemV"] = 0;

function clr(n)
{
    return cl[n] <= 0;
}

function updateCls()
{
    for (i in cl)
    {
        cl[i] -= 1;
    }
}

manualMoveLock = false;

function createPlayer(x, y, width, height, name, mainPlayer)
{
    if (mainPlayer == undefined)
        mainPlayer = false;
    
    var player = {};

    player.dead = false;

    player.width = width;
    player.height = height;

    player.geo = createRectangle(x,y,player.width,player.height,"images/body.png");
    scene.add( player.geo );

    var nameGeo = new THREE.TextGeometry(name,
    {
        size: 0.5,
        height: 0.01,
        curveSegments: 50,
        font: "optimer",
        weight: "normal",
        style: "normal",
    });
    var nameMaterial = new THREE.MeshBasicMaterial({ color:0x000000 });
    var nameTxt = new THREE.Mesh(nameGeo, nameMaterial);
    scene.add(nameTxt);
    
    player.nameTxt = nameTxt;

    player.velX = 0;
    player.velY = 0;
    player.name = name;
    player.mainPlayer = mainPlayer;
    
    player.canMove = true;
    
    player.crouching = false;
    
    player.x = function(value)
    {
        if(value != undefined)
            player.geo.position.x = value;

        return player.geo.position.x;
    };

    player.y = function(value)
    {
        if(value != undefined)
            player.geo.position.y = value;

        return player.geo.position.y;
    };
    
    player.qp = createQuickPointer(player.x(),player.y(), 0.4 , 0 , {src:"images/bow.png",width:0.8,height:1.6} );
    if (!mainPlayer) player.qp.justForShow = true;
    
    player.update = function()
    {
        if(this.mainPlayer)
        {
            updateCls();
            
            setItemZBar( -cl["itemZ"] , inventory[2][0][2] );
            setItemXBar( -cl["itemX"] , inventory[2][1][2] );
            setItemCBar( -cl["itemC"] , inventory[1][0][2] );
            setItemVBar( -cl["itemV"] , inventory[1][1][2] );
            setTp(cl["tpCoolDown"]);
            
            // 's' for crouch
            if (keysPressedNoHud(83) && !tpStall)
            {
                setPlayerCrouching(this,!this.crouching);
            }
            
            var prevX = this.x();
            var prevY = this.y();
            
            this.geo.position.x += this.velX;
            this.geo.position.y += this.velY;

            if(tpHalo != undefined)
            {
                tpHalo.position.x = this.x();
                tpHalo.position.y = this.y();
                
                var sx =  1 + Math.cos(time/4) * 0.2 ;
                var sy =  1 + Math.sin(time/4) * 0.3 ;
                tpHalo.scale.setX(sx);
                tpHalo.scale.setY(sy);
                
                if (cl["tpCharge"] < 50)
                {
                    var mult = cl["tpCharge"]/50;
                    tpHalo.scale.setX(sx*mult);
                    tpHalo.scale.setY(sy*mult);
                }
            }
            
            var velX = this.velX;
            var velY = this.velY;
            
            touchGround = false;
            touchLeft   = false;
            touchRight  = false;
            
            notOk = 10;
            if (tpMode) notOk = -100;
            while(notOk >= 0)
            {
                topLeft = getTile(this.x() - this.width / 2, this.y() + this.height / 2);
                bottomRight = getTile(this.x() + this.width / 2, this.y() - this.height / 2);
    
                solidTiles = adjacentTiles(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y).filter(isInRange).filter(isSolid);
                
                repositions = [];            
                
//                repositions.push(
//                {
//                    x: 0 + this.width/2,
//                    y: this.y(),
//                    d: 1
//                });
//                repositions.push(
//                {
//                    x: tileMap.length - this.width/2,
//                    y: this.y(),
//                    d: 2
//                });
                
                for(var i = 0; i < solidTiles.length; i++)
                {
                    var t = solidTiles[i];
                    
                    var tileXMin1 = 1;
                    if (t.x-1 >= 0)
                    	tileXMin1 = tileMap[t.x-1][t.y];
                    	
                    var tileXPlus1 = 1;
                    if (t.x+1 < tileMap.length)
                    	tileXPlus1 = tileMap[t.x+1][t.y];		
                    
                    if(velX > 0 && tileXMin1 == 0)
                    {
                        repositions.push(
                        {
                            x:  this.x() - ( ( this.x() + this.width/2 ) - solidTiles[i].x ) ,
                            y:  this.y() ,
                            d:  1
                        });
                    }
                    else if ( tileXPlus1 == 0 )
                    {
                        repositions.push(
                        {
                            x: this.x() + ( (solidTiles[i].x + 1) - ( this.x() - this.width/2 )) ,
                            y: this.y() ,
                            d: 2
                        });
                    }
    
                    if(velY > 0 && tileMap[t.x][t.y-1] == 0)
                    {
                        repositions.push(
                        {
                            x: this.x() ,
                            y: this.y() - ( ( this.y() + this.height/2 ) - solidTiles[i].y ) ,
                            d: 3
                        });
                    }
                    else if ( tileMap[t.x] [t.y+1] == 0 )
                    {
                        repositions.push(
                        {
                            x: this.x() ,
                            y: this.y() + ( (solidTiles[i].y + 1) - ( this.y() - this.height/2 )) ,
                            tx: solidTiles[i].x ,
                            ty: solidTiles[i].y ,
                            d: 4
                        });
                    }
                }
    
                newPosition = {x: Infinity, y: Infinity};
    
                for(var i = 0; i < repositions.length; i++)
                {
                    if( dist2(repositions[i].x, repositions[i].y, prevX, prevY) < dist2(newPosition.x, newPosition.y, prevX, prevY) )
                    {
                        newPosition = repositions[i];
                    }
                }
                
                if(newPosition.x != Infinity)
                {
                    if (newPosition.d == 1 || newPosition.d == 2)
                        this.velX *= 0.95;
//                    else if (newPosition.d == 3)
//                    {
//                        this.velY = 0;
//                    }
                    
                    if (newPosition.d == 3)
                    {
                        this.velY = 0;
                    }
                    
                    if (newPosition.d == 4)
                    {
                        touchGround = true;
                        this.velY = 0;
                        
                        if ( !keysNoHud(32) )
                        {
                            var sp = newPosition.tx + ":" + newPosition.ty;
                            
                            if ( lastPositions[sp] == undefined )
                            {
                                lastPositions[sp] = { tx : newPosition.tx , ty : newPosition.ty , x : this.x() , y : this.y() };
                            }
                        }
                    }
                    
                    if (newPosition.d == 1)
                        touchRight = true;
                    
                    if (newPosition.d == 2)
                        touchLeft = true;
                    
                    this.x(newPosition.x);
                    this.y(newPosition.y);
                }
                else
                    notOk = 0;
                
                notOk -= 1;
            }
            
            if (this.x() < this.width/2) this.x(this.width/2);
            if (this.x() > tileMap.length-this.width/2) this.x(tileMap.length-this.width/2);

            this.velY -= 0.02;
            
            if ( tpMode )
            {
                this.velX = this.velY = 0;
                
                if (keysNoHud(37)) this.geo.position.x -= 0.5;
                if (keysNoHud(38)) this.geo.position.y += 0.5;
                if (keysNoHud(39)) this.geo.position.x += 0.5;
                if (keysNoHud(40)) this.geo.position.y -= 0.5;
                
                if ( keysPressedNoHud(32) )
                {
                    tpMode = false;
                    
                    var np = null;
                    var d = null;
                    
                    for ( k in lastPositions )
                    {
                        var p = lastPositions[k];
                        scene.remove( p.geo );
                        delete p.geo;
                        
                        if (np == null || dist2( p.x , p.y , this.x() , this.y() ) < d)
                        {
                            np = p;
                            d = dist2( p.x , p.y , this.x() , this.y() );
                        }
                    }
                    
                    this.x( np.x );
                    this.y( np.y );
                }
            }
            
            else if (keysPressedNoHud(32) && tpMode == false && clr("tpCoolDown") && !tpStall)
            {
                tpHalo = createRectangle(player.x(), player.y(), player.width + 1, player.height + 1, "images/tpHalo.png");
                scene.add(tpHalo);

                tpStall = true;
                cl["tpCharge"] = 300;
            }
            if(clr("tpCharge") && tpStall)
            {
                scene.remove(tpHalo);
                tpStall = false;
                tpMode = true;
                
                cl["tpCoolDown"] = 1000;
                
                for ( k in lastPositions )
                {
                    var p = lastPositions[k];
                    var rec = createRectangle( p.x , p.y , defPlayerWidth , defPlayerHeight , "images/flame1.png" );
                    p.geo = rec;
                    scene.add(rec);
                }
            }
            
            if (keysReleasedNoHud(65) && !tpStall)
            {
                manualMoveLock = !manualMoveLock;
            }
            
            if ( this.canMove && !manualMoveLock && !tpStall)
            {
                if(keysNoHud(37))
                {
                    if (touchGround)
                        if ( this.velX > 0 ) this.velX *= -0.40;
                    
                    if (touchGround)
                        this.velX -= 0.006;
                    else
                        this.velX -= 0.003;
                }
                if(keysNoHud(39))
                {
                    if (touchGround)
                        if ( this.velX < 0 ) this.velX *= -0.40;
                    
                    if (touchGround)
                        this.velX += 0.006;
                    else
                        this.velX += 0.003;
                }
                if(keysNoHud(38) && (touchGround || touchLeft || touchRight))
                {
                    if ( this.velY <= 0 )
                    {
                        this.velY += 0.3;
                        
                        if ( !touchGround )
                        {
//                            if (touchLeft)
//                                this.velX += 0.06;
//                            if (touchRight)
//                                this.velX -= 0.06;
                        }
                    }
                }
                if(keysNoHud(40))
                {
                    this.velY -= 0.007;
                }
            }
            
            if ( keysPressedNoHud(90) && !tpMode && !tpStall ) this.canMove = false;
            if ( keysReleasedNoHud(90) && !tpMode && !tpStall)
            {
                this.canMove = true;
                
                console.log( cl["itemZ"] , inventory[2][0][2] );
                
                if (cl["itemZ"] < -inventory[2][0][2])
                {
                    cl["itemZ"] = 0;
                    send(["useItem",[2,0]]);
                }
            }
            
            if ( keysPressedNoHud(88) && !tpMode && !tpStall) this.canMove = false;
            if ( keysReleasedNoHud(88) && !tpMode && !tpStall)
            {
                this.canMove = true;
                
                if (cl["itemX"] < -inventory[2][1][2])
                {
                    cl["itemX"] = 0;
                    send(["useItem",[2,1]]);
                }
            }
            
            if ( keysPressedNoHud(67) && !tpMode && !tpStall ) this.canMove = false;
            if ( keysReleasedNoHud(67) && !tpMode && !tpStall)
            {
                this.canMove = true;
                
                if (cl["itemC"] < -inventory[1][0][2])
                {
                    cl["itemC"] = 0;
                    send(["useItem",[1,0]]);
                }
            }
            
            if ( keysPressedNoHud(86) && !tpMode && !tpStall) this.canMove = false;
            if ( keysReleasedNoHud(86) && !tpMode && !tpStall)
            {
                this.canMove = true;
                
                if (cl["itemV"] < -inventory[1][1][2])
                {
                    cl["itemV"] = 0;
                    send(["useItem",[1,1]]);
                }
            }
            
            if( keysPressedNoHud(80) && !tpMode && !tpStall)
            {
                for ( i in portals )
                {
                    var p = portals[i];
                    
                    if (overlapAABB( player.x() , player.y() , player.width , player.height , p.geo.position.x , p.geo.position.y , 1.3 , 2.3 ))
                    {
                        send(["takePortal",p.id]);
                    }
                }
            }
            
            if ( touchGround )
            {
                if ( keysNoHud(37) || keysNoHud(39) )
                    this.velX *= 0.95;
                else
                    this.velX *= 0.90;
            }
            else
                this.velX *= 0.99;

            if ( !tpMode )
                send(["playerPosition", this.geo.position.x, this.geo.position.y, this.qp.angle, this.crouching]);
            
            camera.position.x += (this.x() - camera.position.x) / 10;
            camera.position.y += (this.y() - camera.position.y) / 10;
            
            var onLimit = boundCamera();
            
            var rotationMax = 0.1;
            if (onLimit) rotationMax = 0;
            if ( boundAngle(this.qp.angle - 90) > 180 )
                camera.rotation.y += (-rotationMax-camera.rotation.y)/50;
            else
                camera.rotation.y += (rotationMax-camera.rotation.y)/50;
        }
        
        this.nameTxt.position.x = this.x() - (this.name.length * 0.15); // 0.15 is an aproximation of the width of a letter
        this.nameTxt.position.y = this.y() + 1;
        
        this.qp.update( this.x() , this.y() );
    }
    
    player.destroy = function()
    {
        scene.remove( this.geo );
        scene.remove( this.nameTxt );
        this.qp.destroy();
    };

    return player;
}

function setPlayerCrouching(p,c)
{
    p.crouching = c;
    
    if ( !p.crouching )
    {
        p.geo.rotation.z = 0;
        p.width  = defPlayerWidth;
        p.height = defPlayerHeight;
    }
    else
    {
        p.geo.rotation.z = 90 * (Math.PI/180);
        p.height = defPlayerWidth;
        p.width  = defPlayerHeight;
    }
}

function removePlayer(p)
{
    p.destroy();
    delete players[p.name];
}

function adjacentTiles(x1, y1, x2, y2)
{
    tiles = [];

    for(var i = x1; i <= x2; i++)
    {
        for(var j = y2; j <= y1; j++)
        {
            tiles.push({x:i,y:j});
        }
    }
    return tiles;
}

function isInRange(tile)
{
    return tile.x >= 0 &&
           tile.y >= 0 &&
           tile.x < tileMap.length &&
           tile.y < tileMap[0].length;
}

function isSolid(tile)
{
    return tileMap[tile.x][tile.y] == 1;
}

function dist2(x1, y1, x2, y2)
{
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}
