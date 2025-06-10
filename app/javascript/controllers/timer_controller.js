import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["time", "label", "progressBar", "startButton", "pauseButton", "stopButton"]
  static values = { 
    focusTime: Number, 
    breakTime: Number,
    sessionId: Number
  }

  connect() {
    this.isRunning = false
    this.isPaused = false
    this.currentPhase = "ready" // ready, focus, break, completed
    this.timeRemaining = 0
    this.totalTime = 0
    this.interval = null
  }

  disconnect() {
    this.clearInterval()
  }

  start() {
    if (this.currentPhase === "ready") {
      this.startFocusTime()
    } else if (this.isPaused) {
      this.resume()
    }
  }

  pause() {
    if (this.isRunning) {
      this.isPaused = true
      this.isRunning = false
      this.clearInterval()
      this.updateButtons()
    }
  }

  stop() {
    this.currentPhase = "ready"
    this.isRunning = false
    this.isPaused = false
    this.clearInterval()
    this.resetDisplay()
    this.updateButtons()
  }

  startFocusTime() {
    this.currentPhase = "focus"
    this.timeRemaining = this.focusTimeValue * 60 // Convert minutes to seconds
    this.totalTime = this.timeRemaining
    this.isRunning = true
    this.isPaused = false
    
    this.labelTarget.textContent = "Focus Time"
    this.progressBarTarget.style.backgroundColor = "var(--accent-blue)"
    this.updateDisplay()
    this.updateButtons()
    this.startCountdown()
  }

  startBreakTime() {
    this.currentPhase = "break"
    this.timeRemaining = this.breakTimeValue * 60 // Convert minutes to seconds
    this.totalTime = this.timeRemaining
    this.isRunning = true
    this.isPaused = false
    
    this.labelTarget.textContent = "Break Time"
    this.progressBarTarget.style.backgroundColor = "var(--accent-green)"
    this.updateDisplay()
    this.updateButtons()
    this.startCountdown()
  }

  resume() {
    this.isRunning = true
    this.isPaused = false
    this.updateButtons()
    this.startCountdown()
  }

  startCountdown() {
    this.interval = setInterval(() => {
      this.timeRemaining--
      this.updateDisplay()
      
      if (this.timeRemaining <= 0) {
        this.clearInterval()
        this.handlePhaseComplete()
      }
    }, 1000)
  }

  handlePhaseComplete() {
    if (this.currentPhase === "focus") {
      // Focus time completed, start break
      this.startBreakTime()
    } else if (this.currentPhase === "break") {
      // Break time completed, mark session as completed
      this.completeSession()
    }
  }

  completeSession() {
    this.currentPhase = "completed"
    this.isRunning = false
    this.isPaused = false
    
    this.labelTarget.textContent = "Session Completed!"
    this.timeTarget.textContent = "00:00"
    this.progressBarTarget.style.width = "100%"
    this.progressBarTarget.style.backgroundColor = "var(--accent-green)"
    
    this.updateButtons()
    this.markSessionCompleted()
  }

  markSessionCompleted() {
    // Send request to mark session as completed
    fetch(`/sessions/${this.sessionIdValue}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        session: {
          completed: true
        }
      })
    }).then(response => {
      if (response.ok) {
        // Optionally redirect or show success message
        setTimeout(() => {
          window.location.href = '/sessions'
        }, 3000)
      }
    })
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60)
    const seconds = this.timeRemaining % 60
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    
    this.timeTarget.textContent = timeString
    
    // Update progress bar
    if (this.totalTime > 0) {
      const progress = ((this.totalTime - this.timeRemaining) / this.totalTime) * 100
      this.progressBarTarget.style.width = `${progress}%`
    }
  }

  updateButtons() {
    const startBtn = this.startButtonTarget
    const pauseBtn = this.pauseButtonTarget
    const stopBtn = this.stopButtonTarget

    if (this.currentPhase === "ready") {
      startBtn.textContent = "Start Focus Session"
      startBtn.style.display = "inline-block"
      pauseBtn.style.display = "none"
      stopBtn.style.display = "none"
    } else if (this.currentPhase === "completed") {
      startBtn.style.display = "none"
      pauseBtn.style.display = "none"
      stopBtn.style.display = "none"
    } else if (this.isRunning) {
      startBtn.style.display = "none"
      pauseBtn.style.display = "inline-block"
      stopBtn.style.display = "inline-block"
    } else if (this.isPaused) {
      startBtn.textContent = "Resume"
      startBtn.style.display = "inline-block"
      pauseBtn.style.display = "none"
      stopBtn.style.display = "inline-block"
    }
  }

  resetDisplay() {
    this.timeTarget.textContent = "00:00"
    this.labelTarget.textContent = "Ready to Focus"
    this.progressBarTarget.style.width = "0%"
    this.progressBarTarget.style.backgroundColor = "var(--accent-blue)"
  }

  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
} 