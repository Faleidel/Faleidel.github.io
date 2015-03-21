function overlapAABB(x,y,w,h,x2,y2,w2,h2)
{
    return (Math.abs(x-x2) <= Math.abs((w+w2)/2)) && (Math.abs(y-y2) <= Math.abs((h+h2)/2));
}

function trustX( angle , power )
{
    return Math.cos(angle * (Math.PI / 180)) * power;
}

function trustY( angle , power )
{
    return Math.sin((angle * (Math.PI / 180))) * power;
}


function wrapedDist( x , x2 , w )
{
    var r = Math.abs(x-x2);
    if (r > w/2) r = w - r;
    return Math.abs(r);
}

function getAngle( tx , ty , mx , my  )
{
    var deltaX = mx - tx;
    var deltaY = my - ty;
    return (Math.atan2( deltaY , deltaX ))/Math.PI*180;
}

function getTile(x, y)
{
    return {x : Math.floor(x), y : Math.floor(y)}
}

// one element by class(name)
function oebc(className)
{
    return document.getElementsByClassName(className)[0];
}

function boundAngle(a)
{
    while (a > 360)
        a -= 360;
    while (a < 0)
        a += 360;
    
    return a;
}
