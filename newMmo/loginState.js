function loginInit()
{
    var loginBox = oebc("login");

    loginBox.hidden = false;
    
    loginBox.style.position = "absolute";
    loginBox.style.left = window.innerWidth/2 - loginBox.offsetWidth /2;
    loginBox.style.top = "50%";
    
    loginBox.getElementsByClassName("connFail")[0].hidden = true;
    loginBox.getElementsByClassName("name")[0].value = generateName();
    loginBox.getElementsByClassName("submit")[0].onclick = submitLogin;
}

function loginUpdate()
{
    if(keysPressedHud(13))
    {
        submitLogin();
    }
    else if ( keysPressedHud(32) && document.activeElement != oebc("name") )
    {
        var loginBox = oebc("login");
        loginBox.getElementsByClassName("name")[0].value = "Faleidel";
    }
    else if ( keysPressedHud(69) && document.activeElement != oebc("name") )
    {
        ip = "192.168.0.102";
    }
    else if ( keysPressedHud(88) && document.activeElement != oebc("name") )
    {
        var loginBox = oebc("login");
        loginBox.getElementsByClassName("name")[0].value = "Danodz";
    }
    else if ( keysPressedHud(90) && document.activeElement != oebc("name") )
    {
        ip = "192.168.0.101";
    }
}

function loginDestroy()
{
    focusNode = gameDiv;
}

function submitLogin()
{
    openConnection(document.getElementsByClassName("login")[0].getElementsByClassName("name")[0].value, document.getElementsByClassName("login")[0].getElementsByClassName("pass")[0].value)

    playerName = document.getElementsByClassName("login")[0].getElementsByClassName("name")[0].value;

    document.getElementsByClassName("login")[0].hidden = true;
}

function generateName()
{
    //var parts = ["fal","ei","del","top","ay","dan","odz","jul","opin","nalf","lord","endo","lerom"];
    var parts = ["metal","dragon","X","danger","lord","flame","hole"
                ,"electric","blood","vampire","axe","death","black"
                ,"sword","hammer","iron","love","maid","sock","ass","tentacle"];
    var partsTaken = parts.map( function(e){ return false } );
    var n = "";
    
    for ( var i = 0 ; i < Math.random()*3 + 1 ; i ++ )
    {
        var r;
        while (partsTaken[r = Math.floor(Math.random()*parts.length)]){}; // holly shit o_O
        
        n += parts[r] + "_";
        partsTaken[r] = true;
    }
    
    var n2 = "";
    
    for ( var i = 0 ; i < n.length-1 ; i++ )
    {
        if ( i == 0 )
            n2 += n[i].toUpperCase();
        else
            n2 += n[i];
    }
    
    return n2;
}
