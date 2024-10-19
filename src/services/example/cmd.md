DESPLIEGUE SENDER EN FUJI C
forge create --rpc-url fuji-c --private-key $PK contracts/uchuva/sender.sol:SimpleGame
export SENDER=0xdc50aC3d75AB5ECc7A6bcdfdCc6282F7235af02A

DESPLIEGUE RECEIVER EN UCHUVA
forge create --rpc-url uchuva --private-key $PK contracts/uchuva/receiver.sol:WinnerContract
export RECEIVER=0x17aB05351fC94a1a67Bf3f56DdbB941aE6c63E25

INICIAR JUEGO EN SENDER C CHAIN
export PLAYER1=0xE7eBCDA0cb18B6017f4c8196C96c79B59139188a
export PLAYER2=0xE7eBCDA0cb18B6017f4c8196C96c79B59139188b
cast send --rpc-url fuji-c --private-key $PK $SENDER "playGame(address, address, address)" $PLAYER1 $PLAYER2 $RECEIVER 

VERIFICAR VARIABLE
cast call --rpc-url uchuva $RECEIVER "viewWinner()(address)"