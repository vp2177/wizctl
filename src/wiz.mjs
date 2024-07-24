import dg from 'node:dgram'

export const WIZ_PORT = 38899

function _logger(msg, rinfo) {
  console.info('← %s: %s', rinfo.address, msg)
}

/** 
 * @param {string} ip
 */
function _send(ip, msg, msgHandler = _logger, timeout = 1500) {
  const s = dg.createSocket({ type: 'udp4' }, msgHandler)
  const m = (typeof msg == 'string')? msg : JSON.stringify(msg)
  s.send(m, WIZ_PORT, ip, (err) => {
    err && console.error(err)
  })
  setTimeout(() => {
    s.close() 
  }, timeout)
  return s
}

/** 
 * Switch device on/off.
 * @param {string} ip 
 */
export function setState(ip, state = true, id = 1) {
  return _send(ip, {NotSending_id: id, method: 'setState', params: {state}})
  // TODO: send id?
}

/** 
 * Get device status 
 * @param {string} ip
 */
export function getPilot(ip) {
  return _send(ip, {method: 'getPilot'})
}

/** 
 * Set a scene.
 * @param {string} ip
 */
export function setPilot(ip, sceneId = 13, dimming = 100, id = 1) {
  return _send(ip, {method: 'setPilot', params: {sceneId, dimming}}) 
}

/** 
 * @param {string} ip
 */
export function setPilotRGB(ip, [r, g, b], dimming = 100, id = 1) {
  return _send(ip, {method: 'setPilot', params: {r, g, b, dimming}})
}

// TODO: hoist
export const SCENE_PRESETS = {
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

export function wizctl([cmd, a, b, ...r]) {
  switch (cmd.toLowerCase()) {
    case 'off':
      setState(a, false)
      break
    case 'on':
      setState(a, true)
      break
    case 'state':
    case 'status':
      getPilot(a)
      break
    case 'scene':
      setPilot(b, SCENE_PRESETS[a.toLowerCase()]) 
      // TODO: dimming support
      break 
    case 'rgb':
      const colors = a.split(/[,\/]/).map(x => Number.parseInt(x)) 
      setPilotRGB(b, colors)
      break
    default:
      console.warn('?')
  }
}
