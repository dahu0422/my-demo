const arr1: string[] = []

const arr2: Array<string> = []

// 这两种方式是等价的，更多使用是以前者为主；

// 某些情况下会使用 元祖 Tuple 来代替数组更妥当

const arr3: string[] = ["lin", "bu", "du"]
console.log(arr3[599])

const arr4: [string, string, string] = ["lin", "bu", "du"]
console.log(arr4[599])

const arr5: [string, number, boolean] = ["linbudu", 599, true]

const arr6: [string, number?, boolean?] = ["linbudu"]

const arr7: [name: string, age: number, male: boolean] = ["linbudu", 599, true]

const arr8: [name: string, age: number, male?: boolean] = ["linbudu", 599, true]
