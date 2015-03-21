function createPortal(obj)
{
    portal = obj;

    portal.geo = createRectangle(obj.x,obj.y,1,2,"images/ice1.png");
    scene.add( portal.geo );

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

    return portal;
}
