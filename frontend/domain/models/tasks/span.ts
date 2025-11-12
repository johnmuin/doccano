export class Span {
  constructor(
    readonly id: number,
    private _label: number,
    readonly user: number,
    readonly startOffset: number,
    readonly endOffset: number,
    public standardId?: string
  ) {}

  get label(): number {
    return this._label
  }

  changeLabel(label: number, standardId?: string) {
    this._label = label
    if (standardId !== undefined) {
      this.standardId = standardId
    }
  }
}
