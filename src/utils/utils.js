

  export const getDescriptionText = (element) => {
    if (!element) return
    const container = element.closest('.movie__description-container')
    if (!container) return
  
    let text = element.textContent.split(' ')
    const containerHeight = container.offsetHeight
  
    while (element.offsetHeight > containerHeight && text.length > 0) {
      text = text.slice(0, -1) 
      element.textContent = `${text.join(' ')}...`
    }
  }

export const debounce = (fn, debounceTime) => {
  let calledId
  return async function callFn() {
    const args = [...arguments]
    if (calledId) {
      clearTimeout(calledId)
    }
    calledId = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
}
