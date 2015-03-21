function createArrow( x , y , angle )
{
    var arrow = {};
    
    arrow.angle = angle;
    arrow.velX = trustX(angle,0.4);
    arrow.velY = trustY(angle,0.4);
    
    arrow.geo = createRectangle( x , y , 0.8 , 0.1, "images/arrow1.png" );
    scene.add( arrow.geo );
    
    arrow.geo.rotation.z = angle * (Math.PI/180);
    
    arrow.update = function()
    {
        this.geo.position.x += this.velX;
        this.geo.position.y += this.velY;
        this.velY -= 0.01;
        
        this.angle = getAngle( 0 , 0 , this.velX , this.velY );
        this.geo.rotation.z = this.angle * (Math.PI/180);
        
        var tp = getTile(this.geo.position.x,this.geo.position.y);
        
        if (tp.x >= tileMap.length || tp.y >= tileMap[0].length || tp.x < 0 || tp.y < 0)
            return true;
        else
            return tileMap[tp.x][tp.y] != 0;
    };
    
    arrow.destroy = function()
    {
        scene.remove( this.geo );
    };
    
    return arrow;
}
