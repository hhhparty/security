import asyncio
import websockets

async def echo(websocket,path):
    print("---------websocket echo opened----------")
    name = await websokcet.recv()
    print(name)
    greeting = "hello %s" % name
    await websocket.send(greeting)
    print(greeting)

start_server = websockets.serve(echo,'localhost',10000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

