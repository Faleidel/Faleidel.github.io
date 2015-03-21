function deathInit()
{
    deathPopup = document.createElement("DIV");
    deathPopup.className = "deathPopup";
    deathDiv.appendChild(deathPopup);

    respawnButton = document.createElement("INPUT");
    respawnButton.type = "submit";
    respawnButton.value = "Respawn";
    respawnButton.class = "Respawn";
    respawnButton.onclick = deathRespawn;
    deathPopup.appendChild(respawnButton);

    deathDiv.hidden = false;

    deathPopup.style.top = ( window.innerHeight / 2 ) - ( deathPopup.clientHeight / 2 );
    deathPopup.style.left = ( window.innerWidth / 2 ) - ( deathPopup.clientWidth / 2 );

    player.dead = true;
}

function deathRespawn()
{
    send(["respawn"]);
    changeState("playing");
}

function deathUpdate()
{
    if( keysPressedHud(13) )
    {
        deathRespawn();
    }
}

function deathDestroy()
{
    deathDiv.hidden = true;

    hudDestroy();
    renderer.setClearColor( 0x000000, 1);

    for( n in players )
    {
        players[n].destroy();
    }

    for (k in entitys)
    {
        scene.remove(entitys[k].geo);
    }
    entitys = {};

    scene.remove( tileMapGeo );

    while (deathDiv.firstChild)
    {
        deathDiv.removeChild(deathDiv.firstChild);
    }
}
