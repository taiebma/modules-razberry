SwitchBinaryOn = function(N,I) {
  zway.devices[N].instances[I].SwitchBinary.Set(255);
  return "on";
  }

SwitchBinaryOff = function(N,I) {
  zway.devices[N].instances[I].SwitchBinary.Set(0);
  return "off";
  }

SwitchBinaryStatus = function(N,I) {
  var status = (zway.devices[N].instances[I].SwitchBinary.data.level.value==255) ? "on" : "off";
  return status;
  }

ThermostatLevel = function(N) {
  return zway.devices[N].ThermostatSetPoint.data[1].setVal.value;
  }

ThermostatSet = function(N,SetTemp) {
  zway.devices[N].instances[0].ThermostatSetPoint.Set(1,SetTemp);
  }  

