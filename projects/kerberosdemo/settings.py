#
SERVER_HOST = "127.0.0.1"
SERVER_PORT = 55100
SERVER_BUFFER_SIZE = 1024

def get_server_config():
    """
    get server config information
    :return: server host, server port
    """
    host = _config_info["Server"]["host"]
    port = _config_info["Server"]["port"]
    if isinstance(port, basestring):
        port = int(port)
    return host, port