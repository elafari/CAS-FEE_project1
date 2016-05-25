
@echo off
if [%1]==[] goto blank

set PathCurl="C:\Program Files\curl\bin"
set Port=4000

%PathCurl%\curl -i -X POST --data "noteid=%1" http://localhost:%Port%/notebookDelete
echo
goto done

:blank
echo Please enter one parameter
goto done

:done

