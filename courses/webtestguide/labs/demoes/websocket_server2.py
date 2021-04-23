"""Websocket long connect with python
"""
import asyncio
import websockets

async def login(websocket):
    """客户端身份验证"""
    while True:
        recv_str = await websocket.recv()