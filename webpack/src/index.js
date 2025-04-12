import("./sum.js").then(({ default: sum }) => {
  const num = Math.random()
  console.log(num)

  const result = num + sum(1, 2)
  console.log("🚀 ~ result:", result)
})

