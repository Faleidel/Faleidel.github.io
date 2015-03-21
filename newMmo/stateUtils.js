// Take a state name
// Seek for functions with the name plus the use
// name + "Init" is called at the beginning
// name + "Update" is called 30 times a second
// name + "destroy" is called just before the state change

stateInit   = undefined
stateUpdate = undefined
stateDestroy   = undefined

stateName = undefined

function setState( stateFunction )
{
    stateInit = window[stateFunction + "Init"];
    stateUpdate = window[stateFunction + "Update"];
    stateDestroy = window[stateFunction + "Destroy"];
    
    stateName = stateFunction;
    
    if(stateInit != undefined)
        stateInit();
}

function stopState()
{
    if(stateDestroy != undefined)
        stateDestroy();
}

function changeState( stateFunction )
{
    stopState();
    setState( stateFunction );
}
