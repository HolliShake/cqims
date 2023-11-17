


const StatusMap = [
  {
    title: "Graduated",
    value: 0,
  },
  {
    title: "Active",
    value: 1,
  },
  {
    title: "Dropped out",
    value: 2,
  },
]

const Items = (StatusMap.map(s => s.title))

export {
  Items, StatusMap,
}

