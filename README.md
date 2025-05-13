# Trading Library

The idea here is to have a suite of tools that will allow me to quickly iterate on potential trading strategies. The entire thing hinges on an event bus, which will listen for and broadcast events to the other components of the system. When Backtesting, users can easily use the `BacktestingExecutionProvider` and `BacktestingPortfolioProvider`, and when running live trades the user can use the `AlpacaExecutionProvider` and `AlpacaPortfolioProvider`. This allows users to build a modular system that can be used both for backtesting and executing real trades. 

The `BacktestRunner` will be responsible for sequencing events from known static sources in order, and feeding them into the event system so that the algorithm can trade against them. 

Potentially a `LiveRunner` will be responsible for exposing and creating real websocket connections with the Data/Trading endpoints. 

There can be `Translation` layers that will translate incoming Bars, Orders, Signals, etc. into objects the system knows how to deal with.