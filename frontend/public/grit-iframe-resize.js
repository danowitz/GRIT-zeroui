// GRIT iframe resize protocol — mirrors the cloud app's tunnel-monitor contract.
// Only activates when this page is embedded (window !== top). Posts its content
// height to the parent so the cloud app can size the iframe, and accepts a width
// hint from the parent. Target origin is locked to the configured parent origin.
(function () {
  'use strict'
  if (window.self === window.top) return // not embedded; do nothing

  // Allowed parent origins that may embed this UI. Keep in sync with the cloud app.
  var ALLOWED_PARENTS = [
    'https://gritautomation.cloud',
    'https://app.gritautomation.cloud'
  ]
  // Resolve the actual parent origin from the referrer; fall back to first allowed.
  function parentOrigin () {
    try {
      var ref = document.referrer ? new URL(document.referrer).origin : ''
      if (ALLOWED_PARENTS.indexOf(ref) !== -1) return ref
    } catch (e) {}
    return ALLOWED_PARENTS[0]
  }
  var TARGET = parentOrigin()

  function currentHeight () {
    var b = document.body
    var e = document.documentElement
    return Math.max(
      b ? b.scrollHeight : 0, b ? b.offsetHeight : 0,
      e ? e.scrollHeight : 0, e ? e.offsetHeight : 0
    )
  }

  var lastH = 0
  function postHeight () {
    var h = currentHeight()
    if (h && h !== lastH) {
      lastH = h
      window.parent.postMessage({ type: 'grit-dash-height', height: h }, TARGET)
    }
  }

  // Width hint from parent → expose for the app to adapt layout density if it wants.
  window.addEventListener('message', function (ev) {
    if (ALLOWED_PARENTS.indexOf(ev.origin) === -1) return
    var d = ev.data || {}
    if (d.type === 'grit-dash-viewport' && typeof d.width === 'number') {
      window.__gritViewportWidth = d.width
      postHeight()
    }
  })

  // Report on load, on resize, and whenever the DOM changes size.
  window.addEventListener('load', postHeight)
  window.addEventListener('resize', postHeight)
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(postHeight)
    document.addEventListener('DOMContentLoaded', function () {
      if (document.body) ro.observe(document.body)
    })
  } else {
    setInterval(postHeight, 1000) // fallback
  }
  if (window.MutationObserver) {
    var mo = new MutationObserver(postHeight)
    document.addEventListener('DOMContentLoaded', function () {
      if (document.body) mo.observe(document.body, { childList: true, subtree: true })
    })
  }
})()
