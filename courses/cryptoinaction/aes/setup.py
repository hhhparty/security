from setuptools import setup

setup(
    name="aes",
    version="0.1",
    py_modules=['aes']
    install_requires=[
        'Click',
    ],
    entry_points='''
        [console_scripts]
        aes_cbc=aes.aes_cbc
    ''',

)