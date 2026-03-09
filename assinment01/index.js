const tableBody = document.getElementById("tableBody")
const pagination = document.getElementById("pagination")

const searchInput = document.getElementById("searchInput")
const roleFilter = document.getElementById("roleFilter")
const statusFilter = document.getElementById("statusFilter")

const rowsPerPage = 10
let currentPage = 1
let sortColumn = null
let sortDirection = "asc"

const roles = ["Admin","User","Manager"]
const statuses = ["Active","Inactive"]

let users = []

function generateUsers() {
  for (let i = 1; i <= 510; i++) {
    users.push({
      id: i,
      name: "User " + i,
      email: "user" + i + "@mail.com",
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinedAt: "2024-" + (Math.floor(Math.random() * 12) + 1) + "-" + (Math.floor(Math.random() * 28) + 1)
    })
  }
}

function getFilteredData() {
  let data = [...users]

  const search = searchInput.value.toLowerCase()
  const role = roleFilter.value
  const status = statusFilter.value

  if (search) {
    data = data.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  if (role) {
    data = data.filter(user => user.role === role)
  }

  if (status) {
    data = data.filter(user => user.status === status)
  }

  if (sortColumn) {
    data.sort((a, b) => {
      let valA = a[sortColumn]
      let valB = b[sortColumn]

      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  return data
}

function renderTable() {
  const data = getFilteredData()

  const start = (currentPage - 1) * rowsPerPage
  const paginatedData = data.slice(start, start + rowsPerPage)

  tableBody.innerHTML = ""

  paginatedData.forEach(user => {
    const row = document.createElement("tr")

    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.joinedAt}</td>
    `

    tableBody.appendChild(row)
  })

  renderPagination(data.length)
}

function renderPagination(totalRows) {
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  pagination.innerHTML = ""

  const prevBtn = document.createElement("button")
  prevBtn.innerText = "Prev"
  prevBtn.disabled = currentPage === 1

  prevBtn.onclick = () => {
    currentPage--
    renderTable()
  }

  pagination.appendChild(prevBtn)

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button")
    btn.innerText = i

    if (i === currentPage) btn.style.fontWeight = "bold"

    btn.onclick = () => {
      currentPage = i
      renderTable()
    }

    pagination.appendChild(btn)
  }

  const nextBtn = document.createElement("button")
  nextBtn.innerText = "Next"
  nextBtn.disabled = currentPage === totalPages

  nextBtn.onclick = () => {
    currentPage++
    renderTable()
  }

  pagination.appendChild(nextBtn)
}

function setupSorting() {
  document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
      const column = th.dataset.column

      if (sortColumn === column) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc"
      } else {
        sortColumn = column
        sortDirection = "asc"
      }

      renderTable()
    })
  })
}

function setupFilters() {
  roleFilter.addEventListener("change", () => {
    currentPage = 1
    renderTable()
  })

  statusFilter.addEventListener("change", () => {
    currentPage = 1
    renderTable()
  })
}

function setupSearch() {
  let debounceTimer

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      currentPage = 1
      renderTable()
    }, 300)
  })
}

function allfun() {
  generateUsers()
  setupSorting()
  setupFilters()
  setupSearch()
  renderTable()
}
allfun()