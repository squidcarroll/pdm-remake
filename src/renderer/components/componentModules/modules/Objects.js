//This file will contain objects for holding and accessing
//data received by commands
import validCmds from './login'

//message: y
let oper_stat = {
  oper_stat_check: { dataLen: 2, byte: 0, data: 0 }, //byte 0 and 1
  eec1_trq_actual: { dataLen: 1, byte: 2, data: 0 }, //byte 2
  tsc1_trq_limit: { dataLen: 1, byte: 3, data: 0 }, //byte 3
  tps_display: { dataLen: 1, byte: 4, data: 0 }, //byte 4
  eec2_load_atspeed: { dataLen: 1, byte: 5, data: 0 }, //byte 5
  coolant_temp: { dataLen: 1, byte: 6, data: 0 }, //byte 6
  eec3_trq_friction: { dataLen: 1, byte: 7, data: 0 }, //byte 7
  ex_temp: { dataLen: 2, byte: 8, data: 0 }, //byte 8 and 9
  inex_boost: { dataLen: 1, byte: 10, data: 0 }, //byte 10
  iat: { dataLen: 1, byte: 11, data: 0 }, //byte 11
  gas_pres: { dataLen: 1, byte: 12, data: 0 }, //byte 12
  boost: { dataLen: 1, byte: 13, data: 0 }, //byte 13
  battery: { dataLen: 2, byte: 14, data: 0 }, //byte 14 and 15
  rpm_snapshot: { dataLen: 2, byte: 16, data: 0 }, //byte 16 and 17
  eec3_des_speed: { dataLen: 2, byte: 18, data: 0 }, //byte 18 and 19
  vsc_cruise_speed: { dataLen: 1, byte: 20, data: 0 }, //byte 20
  vsc_state: { dataLen: 1, byte: 21, data: 0 }, //byte 21
  gas_inj: { dataLen: 2, byte: 22, data: 0 }, //byte 22 and 23
  gas_limit_actual: { dataLen: 2, byte: 24, data: 0 }, //byte 24 and 25
  idle_inj_displ: { dataLen: 2, byte: 26, data: 0 }, //byte 26 and 27
  veh_speed_dspl: { dataLen: 2, byte: 28, data: 0 }, //byte 28 and 29
  gas_temp_displ: { dataLen: 1, byte: 30, data: 0 }, //byte 30
  fuel_limit_nom_displ: { dataLen: 1, byte: 31, data: 0 }, //byte 31
  eec1_trq_demand: { dataLen: 1, byte: 32, data: 0 }, //byte 32
  eec1_trq_mode: { dataLen: 1, byte: 33, data: 0 }, //byte 33
  rpm_com: { dataLen: 1, byte: 35, data: 0 } //byte 35
  /*
  permissives: { dataLen: 2, byte: 36, data: 0 }, //byte 36 and 37
  permis_byte_hi: { dataLen: 1, byte: 36, data: 0 } //36
  enabsw1: 0, //byte 36 bit 0
  catalyst_ok: 0, //byte 36 bit 1
  srom_check: 0, //byte 36 bit 2
  mdu_ok: 0, //byte 36 bit 3
  oem_system: 0, //byte 36 bit 4
  mdu_func_perm: 0, //byte 36 bit 5
  gas_temp_ok: 0, //byte 36 bit 6
  can_ready: 0, //byte 36 bit 7
  permis_byte_lo: 0, //byte 37
  can_addr_ok: 0, //byte 37 bit 0
  tps_ok: 0, //byte 37 bit 1
  tempex_lo_ok: 0, //byte 37 bit 2
  tempex_hi_ok: 0, //byte 37 bit 3
  gaspr_ok: 0, //byte 37 bit 4
  boostpr_ok: 0, //byte 37 bit 5
  batv_ok: 0, //byte 37 bit 6
  rpm_ok: 0, //byte 37 bit 7
  progflags_byte_hi: 0, //byte 38
  efc_can_addr_inv: 0, //byte 38 bit 0
  eec1_update: 0, //byte 38 bit 1
  eec2_update: 0, //byte 38 bit 2
  eec3_update: 0, //byte 38 bit 3
  vsc_update: 0, //byte 38 bit 4
  inlex_update: 0, //byte 38 bit 5
  etp_update: 0, //byte 38 bit 6
  pto_flag_dspl: 0, //byte 38 bit 7
  progflags_byte_lo: 0, //byte 39
  mdu_cal_start: 0, //byte 39 bit 0
  mdu_cal_stop: 0, //byte 39 bit 1
  mdu_cal_done: 0, //byte 39 bit 2
  fm_cal_done: 0, //byte 39 bit 3
  bp_cal_done: 0, //byte 39 bit 4
  gpid_sat_neg: 0, //byte 39 bit 5
  gpid_sat_pos: 0, //byte 39 bit 6
  system_on: 0, //byte 39 bit 7
  pass_user_ok: 0, //byte 40 bit 0
  pass_adv_ok: 0, //byte 40 bit 1
  injector_cleaning: 0, //byte 40 bit 2
  mdu_point_searching: 0, //byte 40 bit 3
  mdu_point_found: 0, //byte 40 bit 4
  oem_sys_failure_single: 0, //byte 40 bit 5
  oem_sys_failure_multi: 0, //byte 40 bit 6
  idle_val_sw: 0, //byte 40 bit 7
  tps_cal_start: 0, //byte 41 bit 0
  tps_cal_stop: 0, //byte 41 bit 1
  tps_cal_done: 0, //byte 41 bit 2
  tilt_active_sflag: 0, //byte 41 bit 3
  pip_shiftstat_sflay: 0, //byte 41 bit 4
  definj_accel_sysflag: 0, //byte 41 bit 5
  definj_allpulse_sysflag: 0, //byte 41 bit 6
  auxflag3: 0, //byte 41 bit 7
  rpm_ref_display: { dataLen: 2, byte: 42, data: 0 }, //byte 42 and 43
  eec2_aps_display: { dataLen: 2, byte: 44, data: 0 }, //byte 44 and 45
  trqacthires_displ: { dataLen: 2, byte: 46, data: 0 }, //byte 46 and 47
  permissives1: { dataLen: 2, byte: 49, data: 0 }, //byte 48 and 49
  permis1_byte_hi: 0, // byte 48
  injectors_perm: 0, // byte 48
  injector0_ok: 0, //byte ^ bit 0
  injector1_ok: 0, // bit 1
  injector2_ok: 0, //bit 2
  injector3_ok: 0, //bit 3
  injector4_ok: 0, //bit 4
  injector5_ok: 0, //bit 5
  injector6_ok: 0, //bit 6
  injector7_ok: 0, //bit 7
  permis1_byte_lo: 0, //byte 49
  iat_high_perm: 0, //^bit 0
  iatsensor_ok: 0, //^bit 1
  coolantsensor_ok: 0, //^bit 2
  vref_ok: 0, //^bit 3
  calfiles_ok: 0, //^bit 4
  startupenabledelay_condition: 0, //^bit 5
  racksensor_ok: 0, //^bit 6
  genset_ok: 0, //^bit 7
  mducalibr_failed: 0, //byte 50 bit 0
  overboost: 0, //^bit 1
  mdu_func_tested: 0, //^bit 2
  iat_sysoff_flag: 0, //^bit 3
  mdu_cal_initiated: 0, //^bit 4
  mdu_func_test_pending: 0, //^bit 5
  mdumanualctrl: 0, //^bit 6
  eec1hirestrqavailb: 0, //^bit 7
  defmodule_error: 0, //byte 51 bit 0
  defpurging: 0, //^bit 1
  idleaugdefinj_sysflag: 0, //^bit 2
  sysflag35: 0, //^bit 3
  pmfregen: 0, //^bit 4
  calibration_permitted_mdu: 0, //^bit 5
  calibration_permitted_tps: 0, //^bit 6
  overspeed_sysflag: 0, //^bit 7
  vspeedlimit_active: 0, //byte 52 bit 0
  tpsenable_condition: 0, //^ bit 1
  systemready: 0, //^ bit 2
  mdu_sat_flag: 0, //^ bit 3
  definjection_on: 0, //^ bit 4
  frpgasprevails: 0, //^ bit 5
  engine_stall_wait_flag: 0, //^ bit 6
  injrange_ovflow: 0, //^ bit 7
  econf_update: 0, //byte 53 bit 0 WHY DO TWO SYMBOLS POINT TO THE SAME DATA ?
  mb15_update: 0, //^ bit 0
  supplypres_bleeding: 0, //^ bit 1
  batvstatus_off: 0, //^ bit 2
  batvstatus_on: 0, //^ bit 3
  postinjection: 0, //^ bit 4
  mb0_update: 0, //^ bit 6
  fan_solenoid_energize: 0, //^ bit 7
  massflow_cng_display: { dataLen: 2, byte: 54, data: 0 }, //byte 54 and 55
  cngmass_used_dspl: { dataLen: 2, byte: 56, data: 0 }, //byte 56 and 57
  injpw_total_display: { dataLen: 2, byte: 58, data: 0 }, // byte 58 and 59
  permissives2: { dataLen: 2, byte: 61, data: 0 }, //byte 61 and 62
  permis2_byte_hi: 0, //byte 60
  noxout_ok: 0, //^ bit 0
  regen_notneeded_ok: 0, //^ bit 1
  frpoutptest_ok: 0, //^ bit 2
  permis2_43: 0, //^ bit 3
  permis2_44: 0, //^ bit 4
  permis2_45: 0, //^ bit 5
  permis2_46: 0, //^ bit 6
  permis2_47: 0, //^ bit 7
  permis2_byte_lo: 0, //byte 61
  cngregtempsensor_ok: 0, //^ bit 0
  defmoduleconnect_ok: 0, //^ bit 1
  hswlsw_ok: 0, //^ bit 2
  egrtempsensor_ok: 0, //^ bit 3
  egrtemp_ok: 0, //^ bit 4
  diesinjsense_ok: 0, //^ bit 5
  cngtankpressensor_o: 0, //^ bit 6
  tiltflag_ok: 0 //^ bit 7
  */
}

function changeData() {
  setInterval(() => {
    // for (let x in oper_stat) {
    //   oper_stat[x].data = Math.floor(Math.random() * 100)
    // }
    oper_stat['iat'].data = Math.floor(Math.random() * 100)
  }, 200)
}

function updateData() {
  for (let x in oper_stat) {
    oper_stat[x].data = Math.floor(Math.random() * 100)
  }
}

// var g = new JustGage({
//   id: "gauge",
//   value: 0,
//   min: 0,
//   max: 2500,
//   title: "RPM"
// });

// setInterval(() => {
//   g.refresh(oper_stat.rpm_snapshot.data);
// }, 100);

// function dataHandler(data) {
//   console.log(data)
//   console.log
//   //if cmd y
//   let cmd = String.fromCharCode(data[0])
//   if (data[0] == data[1]) {
//     if (validCmds.hasOwnProperty(cmd)) {
//       justDataBuf = data.slice(2)
//       console.log('received', cmd)
//       setData(getLocation(cmd), justDataBuf)
//     }
//     // console.log(justDataBuf);
//     // console.log("setting data");

//     console.log(oper_stat)
//   }
// }

function getLocation(cmd) {
  switch (cmd) {
    case 'y':
      console.log('sending to oper_stat')
      return oper_stat
    case 'g':
      console.log('cant handle g rn')
      return false
    case 'u':
      console.log("can't handle u rn")
      return false
    case 'I':
      console.log('Already logged in')
    default:
      console.log('No data set found')
      return false
  }
}

// function setData(myObj, recData) {
//   for (x in myObj) {
//     // console.log(myObj[x].dataLen);
//     if (myObj[x].dataLen == 1) {
//       myObj[x].data = recData.readInt8(myObj[x].byte)
//     } else if (myObj[x].dataLen == 2) {
//       myObj[x].data = recData.readInt16BE(myObj[x].byte)
//     } else {
//       console.log('failed to write data to', x)
//     }
//   }
// }

export default {
  oper_stat,
  getLocation
}
