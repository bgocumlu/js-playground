// utils.ts

export class Vector2 {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y)
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s)
  }

  length(): number {
    return Math.hypot(this.x, this.y)
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y
  }

  normalize(): Vector2 {
    const len = this.length()
    return len > 0 ? this.scale(1 / len) : new Vector2(0, 0)
  }

  distanceTo(v: Vector2): number {
    return this.subtract(v).length()
  }

  distanceToSq(v: Vector2): number {
    return this.subtract(v).lengthSq()
  }

  clamp(maxLen: number): Vector2 {
    const lenSq = this.lengthSq()
    if (lenSq > maxLen * maxLen) {
      const factor = maxLen / Math.sqrt(lenSq)
      return this.scale(factor)
    }
    return new Vector2(this.x, this.y)
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y
  }

  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x
  }

  rotate(theta: number): Vector2 {
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    return new Vector2(
      this.x * c - this.y * s,
      this.x * s + this.y * c
    )
  }

  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  angleTo(v: Vector2): number {
    const dot = this.dot(v)
    const det = this.cross(v)
    return Math.atan2(det, dot)
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}