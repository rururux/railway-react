export class HistoryStore {
  #currentPath: string = ""
  #subscribers: VoidFunction[] = []
  #abortContoller = new AbortController()

  constructor(initialPath: string) {
    this.#currentPath = initialPath
  }

  subscribe(callback: VoidFunction) {
    this.#subscribers.push(callback)

    return () => {
      this.#subscribers = this.#subscribers.filter(clb => clb !== callback)
    }
  }

  getSnapshot() {
    return this.#currentPath
  }

  #callListeners() {
    this.#subscribers.forEach(subscriber => subscriber())
  }

  addEventListener() {
    window.addEventListener("popstate", () => {
      this.#currentPath = location.pathname
      this.#callListeners()
    }, { signal: this.#abortContoller.signal })
  }

  removeListener() {
    this.#abortContoller.abort()
  }

  goTo(newPath: string) {
    history.pushState(null, "", newPath)
    this.#currentPath = newPath
    this.#callListeners()
  }
}