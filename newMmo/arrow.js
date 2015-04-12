function createArrow( x , y , angle , opt )
{
    var arrow = {};
    
    arrow.angle = angle;
    arrow.velX = 0;
    arrow.velY = 0;
    
    var w = 0.8;
    var h = 0.1;
    
    var img = "images/arrow1.png";
    
    if (opt)
    {
	    if ( opt.img )
	   	{
	   		img = opt.img;
	   	}
	    if ( opt.life )
	    {
    		arrow.life = opt.life;
	    }
	    if ( opt.w )
	    {
	    	w = opt.w;
	    }
	    if ( opt.h )
	    {
	    	h = opt.h;
	    }
	    if ( opt.noWall )
	    {
	        arrow.noWall = true;
	    }
	    if ( opt.angle )
	    {
	    	arrow.angle = opt.angle;
	    	arrow.forceAngle = true;
	    }
	    if ( opt.noGrav )
	    {
	    	arrow.noGrav = true;
	    }
	    if ( opt.fadeOut )
	    {
	    	arrow.fadeOut = true;
	    }
    }
    
    arrow.geo = createRectangle( x , y , w , h, img );
    scene.add( arrow.geo );
    
    arrow.geo.rotation.z = angle * (Math.PI/180);
    
    arrow.update = function()
    {
        this.geo.position.x += this.velX;
        this.geo.position.y += this.velY;
        if(this.fadeOut)
        {
        	this.geo.material.opacity = this.life/100;
        }	
        if(!this.noGrav)
        	this.velY -= 0.01;
        
        if(!this.forceAngle)
        	this.angle = getAngle( 0 , 0 , this.velX , this.velY );	
        this.geo.rotation.z = this.angle * (Math.PI/180);
        
        var tp = getTile(this.geo.position.x,this.geo.position.y);
        
        if (this["life"] != undefined)
        {
        	this.life -= 1;
            if (this.life <= 0)
        	    return true;
        }
        
        if ( this.noWall ) return false;
        
        if (tp.x >= collisionTileMap.length || tp.y >= collisionTileMap[0].length || tp.x < 0 || tp.y < 0)
            return true;
        else
            return collisionTileMap[tp.x][tp.y] != 0;
    };
    
    arrow.destroy = function()
    {
        scene.remove( this.geo );
    };
    
    return arrow;
}
