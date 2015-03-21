function createQuickPointer( x , y , length , initAngle , image )
{
    var qp = {};
    
    qp.angle = initAngle;
    qp.length = length;
    
    width = 0.1;
    height = 0.1;
    imageSrc = null;
    
    if (image)
    {
        width  = image.width;
        height = image.height;
        imageSrc = image.src;
    }
    
    qp.geo = createRectangle( x , y , width , height , imageSrc );
    scene.add(qp.geo);
    
    qp.justForShow = false;
    
    qp.update = function(x,y)
    {
        while ( this.angle > 360 )
            this.angle -= 360;
        
        while ( this.angle < 0 )
            this.angle += 360;
        
        if (!this.justForShow)
        {
            if (keysNoHud(37))
            {
               var wd = wrapedDist( this.angle , 180 , 360 );
               if ( wd > 100 )
                   this.angle = 180;
               else
               {
                   if ( this.angle > 180 ) this.angle -= wd/12;
                   else                    this.angle += wd/12;
               }
            }
            if (keysNoHud(38))
            {
               var wd = wrapedDist( this.angle , 90 , 360 );
               if ( wd > 100 )
                   this.angle = 90;
               else
               {
                   if ( this.angle > 90 ) this.angle -= wd/12;
                   else                   this.angle += wd/12;
               }
            }
            if (keysNoHud(39))
            {
               var wd = wrapedDist( this.angle , 0 , 360 );
               if ( wd > 100 )
               {
                   this.angle = 0;
               }
               else
               {
                   if ( this.angle < 180 ) this.angle -= wd/12;
                   else                    this.angle += wd/12;
               }
            }
            if (keysNoHud(40))
            {
               var wd = wrapedDist( this.angle , -90 , 360 );
               if ( wd > 100 )
                   this.angle = 270;
               else
               {
                   if ( this.angle > 270 ) this.angle -= wd/12;
                   else                    this.angle += wd/12;
               }
            }
        }
        
        this.geo.position.x = x;
        this.geo.position.y = y;
        
        this.geo.position.x += trustX( this.angle , this.length );
        this.geo.position.y += trustY( this.angle , this.length );
        
        this.geo.rotation.z = this.angle * (Math.PI/180);
    };
    
    qp.destroy = function()
    {
       scene.remove( this.geo );
    };
    
    return qp;
}
