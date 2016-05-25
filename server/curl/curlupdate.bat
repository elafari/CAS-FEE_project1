
@echo off
if [%1]==[] goto blank

set PathCurl="C:\Program Files\curl\bin"
set Port=4000

%PathCurl%\curl -i -X POST --data "noteid=%1&title=R2D2&importance=2&text=Nidu%1&datecreate=20160430123456" http://localhost:%Port%/notebookUpdate
echo
goto done

:blank
echo Please enter one parameter
goto done

:done

