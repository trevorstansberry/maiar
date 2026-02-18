/**
 * Stateful parser that routes streaming text by <content> tags.
 * Text outside tags → target:'chat', text inside → target:'canvas'.
 * Handles tags split across streaming chunks via a small buffer.
 *
 * Used by both routes/chat.js (skills-only + general chat) and
 * lib/agentRunner.js (agent chains) to separate preamble from deliverables.
 */
export function createContentRouter(onDelta) {
  let insideContent = false
  let buffer = ''

  function route(text) {
    buffer += text

    while (buffer.length > 0) {
      if (!insideContent) {
        const openIdx = buffer.indexOf('<content>')
        if (openIdx === -1) {
          // No tag — flush all but last 9 chars (length of '<content>')
          if (buffer.length > 9) {
            onDelta(buffer.slice(0, -9), 'chat')
            buffer = buffer.slice(-9)
          }
          break
        } else {
          if (openIdx > 0) onDelta(buffer.slice(0, openIdx), 'chat')
          buffer = buffer.slice(openIdx + 9)
          insideContent = true
        }
      } else {
        const closeIdx = buffer.indexOf('</content>')
        if (closeIdx === -1) {
          // No close tag — flush all but last 10 chars (length of '</content>')
          if (buffer.length > 10) {
            onDelta(buffer.slice(0, -10), 'canvas')
            buffer = buffer.slice(-10)
          }
          break
        } else {
          if (closeIdx > 0) onDelta(buffer.slice(0, closeIdx), 'canvas')
          buffer = buffer.slice(closeIdx + 10)
          insideContent = false
        }
      }
    }
  }

  function flush() {
    if (buffer.length > 0) {
      onDelta(buffer, insideContent ? 'canvas' : 'chat')
      buffer = ''
    }
  }

  return { route, flush }
}
