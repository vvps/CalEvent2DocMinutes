function event2doc() {
    var today = new Date();
    var aMonth = 1000 * 60 * 60 * 24 * 30;
    var aMonthsTime = new Date(new Date().getTime() + aMonth);    
    var events = CalendarApp.getDefaultCalendar().getEvents(today,aMonthsTime);
    Logger.log('Number of events found: ' + events.length);
    var meetingFolder = 'MeetingMinutes';
    var templateFileName = 'Template';

    for (var i = 0; i < events.length; i++) {
        var eventName = events[i].getTitle();

        if (eventName.match(/@meeting/i) != null) { // regex match @meeting in event titles 
            var mEvent = events[i];
            var mDate = mEvent.getStartTime();
            var minutesFileName = mDate.getYear() + '.' + 
              ("0" + (mDate.getMonth() + 1)).slice(-2) + '.' + 
                ("0" + mDate.getDate()).slice(-2) + '-' + 
                  eventName.replace(/@meeting/i, ''); // create minutes file name 

            var folders = DriveApp.getFoldersByName(meetingFolder); 
            if (folders.hasNext()) { // check if minutes folder exists
                var mfolder = folders.next();
                var mfiles = mfolder.getFilesByName(minutesFileName);

                if (!mfiles.hasNext()) { // ensure that minutes file does not exist 
                    var tfiles = mfolder.getFilesByName(templateFileName);
                    if (tfiles.hasNext()) { // check if template file exists
                        var tFile = tfiles.next();
                        var mfile = tFile.makeCopy(minutesFileName); // make a copy
                        Logger.log('Minutes file for the event ' + eventName + ' created!');
                        //mEvent.setDescription(mfile.getId()); //To Attach file to calendar event
                    } else {
                        Logger.log('Template file by the name ' + templateFileName + ' does not exist!');
                    }
                } else {
                    Logger.log('Minutes file for the event ' + eventName + ' already exists!');
                }
            } else {
                Logger.log('Folder with the name ' + meetingFolder + ' does not exist!');

            }
        }
    }
}
