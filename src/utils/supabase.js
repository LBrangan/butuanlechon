import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
// Returns the session object, not just true/false
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error.message)
    return null
  }
  return data.session
}

// 👉 Form Action utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}

// 👉 Form Metrics
export const formDataMetrics = ['kg', 'L', 'm', 'piece(s)']

// 👉 Table Pagination
export const tablePagination = (
  { page, itemsPerPage, sortBy },
  defaultColumn = 'id',
  isAscending = true,
) => {
  const [column, order] =
    sortBy && sortBy[0] ? [sortBy[0].key, sortBy[0].order === 'asc'] : [defaultColumn, isAscending]

  if (itemsPerPage === -1) {
    const rangeStart = 0
    const rangeEnd = 999999999999999

    return { rangeStart, rangeEnd, column, order }
  }

  const rangeStart = (page - 1) * itemsPerPage
  const rangeEnd = rangeStart + itemsPerPage - 1

  return { rangeStart, rangeEnd, column, order }
}

// 👉 Handle Search if null turn to empty string
export const tableSearch = (search) => {
  return (search ||= '')
}
