import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Auto-hide the flash message after 3 seconds
    setTimeout(() => {
      this.element.style.transition = "opacity 0.5s ease-out"
      this.element.style.opacity = "0"
      
      // Remove the element after fade out
      setTimeout(() => {
        if (this.element.parentNode) {
          this.element.remove()
        }
      }, 500)
    }, 3000)
  }
} 