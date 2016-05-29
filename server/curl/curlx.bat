
@echo off
if [%1]==[] goto blank

set PathCurl="C:\Program Files\curl\bin"
set Port=4000

%PathCurl%\curl -i -X POST --data "title=Notiztitel %1&prio=2&description=Notizinhalt %1&dateCreated=20160531135656" http://localhost:%Port%/notebook
echo.
goto done

:blank
echo Please enter one parameter
goto done

:done

