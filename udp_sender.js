var zone = '224.0.1.100';
var port = 8084;

zway.devices[2].instances[0].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_2_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[3].instances[0].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_3_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[3].instances[1].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_3_Instance_1_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[3].instances[2].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_3_Instance_2_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[7].instances[0].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_7_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[7].instances[1].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_7_Instance_1_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[7].instances[2].SwitchBinary.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_7_Instance_2_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[15].instances[0].Basic.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_15_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }

    if (this.value != '0') {
        this.controller.addNotification(”info”, ”Alarm Portail Ouvert”, ”device”);
        controller.emit("AlarmPortailOuvert");
    }
    else {
        this.controller.addNotification(”info”, ”Alarm Portail Ferme, ”device”);        
        controller.emit("AlarmPortailFerme");
    }
});

zway.devices[8].instances[0].SwitchMultilevel.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_8_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[9].instances[0].SwitchMultilevel.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_9_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

zway.devices[10].instances[0].SwitchMultilevel.data.level.bind(function() {
    state = 'on';
    if (this.value == '0')
        state = 'off';
    eventString = 'Device_10_Instance_0_' + state;
    debugPrint("UDP : Send " + eventString);
    try {
        system(
            "python /opt/z-way-server/automation/network_send.py",
            eventString,
            this.value,
            zone,
            port
        );
        return;
    } catch(err) {
        debugPrint("Failed to execute script system call: " + err);
    }
});

