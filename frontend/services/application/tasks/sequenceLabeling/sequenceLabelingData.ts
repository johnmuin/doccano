import { Span } from '@/domain/models/tasks/span'

export class SpanDTO {
  id: number
  label: number
  user: number
  startOffset: number
  endOffset: number
  standardId?: string

  constructor(item: Span) {
    this.id = item.id
    this.label = item.label
    this.user = item.user
    this.startOffset = item.startOffset
    this.endOffset = item.endOffset
    this.standardId = item.standardId
  }
}
