interface String {
  contain (arr: string[]) : boolean
}

String.prototype.contain = function (arr: string[]) : boolean {
  for (let i = 0; i < arr.length; i++) {
    if (this.toString() === arr[i]) {
      return true
    }
  }
  return false
}