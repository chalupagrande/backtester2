# Trading Library

The idea here is to have a suite of tools that will allow me to quickly iterate on potential trading strategies. The entire thing hinges on an event bus, which will listen for and broadcast events to the other components of the system. When Backtesting, users can easily use the Backtesting Execution Provider, and running live trades, the user can use the real execution context. This allows users to build a modular system that can be used both for backtesting and executing real trades. 

