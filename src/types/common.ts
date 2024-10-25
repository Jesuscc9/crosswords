export interface iCrossword {
  gridSize: number
  grid: string[][]
  clues: {
    across: {
      [key: number]: string
    }
    down: {
      [key: number]: string
    }
  }
  solutions: {
    across: {
      [key: number]: string
    }
    down: {
      [key: number]: string
    }
  }
}
