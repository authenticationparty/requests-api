@echo off
setlocal enabledelayedexpansion 
echo =[ Zipping File ]=
7z a lambdafunc.zip ./src/*

set names[0]=FetchURL
set regions[0]=us-west-1

set names[1]=FetchURL-EUW
set regions[1]=eu-west-2

set names[2]=FetchURL-SAE
set regions[2]=sa-east-1

(for /l %%i in (0, 1, 2) do ( 
    call echo =[ Deploying to !names[%%i]! !regions[%%i]! ]=
    aws configure set region !regions[%%i]!
    aws lambda update-function-code --function-name !names[%%i]! --zip-file fileb://lambdafunc.zip >nul
))
