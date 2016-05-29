
@echo off
if [%1]==[] goto blank

set PathCurl="C:\Program Files\curl\bin"
set Port=4000

%PathCurl%\curl -i -X POST --data "id=%1&title=Notiztitel %1&prio=2&description=Notizinhalt %1&dateCreated=20160530123456" http://localhost:%Port%/notebookUpdate
echo
goto done

:blank
echo Please enter one parameter
goto done

:done

