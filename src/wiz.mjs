/** 
 * Node.js implementation.
 */
import dg from 'node:dgram'
import process from 'node:process'

const WIZ_PORT = 38899, _TIMEOUT = 1500 // Lower?

function genericSend(ip = '', msg = {}, timeout = _TIMEOUT) {
  const s = dg.createSocket({ type: 'udp4'}, (msg, rinfo) => {
    console.info('← %s %s', rinfo.address, msg)
  })
  const m = JSON.stringify(msg)
  s.send(m, WIZ_PORT, ip, (err) => {
    err && console.error(err)
  })
  setTimeout(() => {
    s.close() 
  }, timeout)
  return s
}

function switchOnOff(ip = '', state = true, id = 1) {
  return genericSend(ip, {NotSending_id: id, method: 'setState', params: {state}})
  // TODO: send id?
}

function getStatus(ip = '') {
  return genericSend(ip, {method: 'getPilot', NotSending_params: {}})
}

function switchScene(ip = '', sceneId = 13, id = 1) {
  return genericSend(ip, {method: 'setPilot', params: {sceneId, dimming: 100}}) // TODO: dimming support
}

function setRGB(ip = '', r = 0, g = 0, b = 255, id = 1) {
  return genericSend(ip, {method: 'setPilot', params: {r, g, b, dimming: 100 }})
}

const SCENE_PRESETS = {
  cozy: 6,
  warm: 11, 
  daylight: 12, // It's noisy?
  cool: 13,
  night: 14,
  nightlight: 14,
  focus: 15, // ?
  relax: 16, // ?
  true_colors: 17, // ?
  tv: 18,
  tvtime: 18,
  plant: 19,
  // TODO: dynamic scenes...
  wakeup: 9,
  wake_up: 9,
  bed: 10,
  bedtime: 10,
  rhythm: 1000
}

// TODO: separate cli/module files
function _main([cmd, a, b, ...r]) {
  switch (cmd.toLowerCase()) {
    case 'off':
      switchOnOff(a, false)
      break
    case 'on':
      switchOnOff(a, true)
      break
    case 'state':
    case 'status':
      getStatus(a)
      break
    case 'scene':
      switchScene(b, SCENE_PRESETS[a.toLowerCase()])
      break 
    case 'rgb':
      const [red, green, blue] = a.split(',')
      setRGB(b, red, green, blue)
      break
    default:
      console.info('?')
  }
}

_main(process.argv.slice(2))
