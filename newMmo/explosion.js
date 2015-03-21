function createExplosion(x, y)
{
    var e = {};
    
    e.geo = createRectangle(x,y,3,3);
    scene.add( e.geo );
    
    e.life = 100;
    
    e.update = function()
    {
        this.life -= 1;
        
        return this.life < 0;
    };
    
    e.destroy = function()
    {
        scene.remove( this.geo );
    }
    
    return e;
}
