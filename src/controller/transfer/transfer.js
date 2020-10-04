const { getUsersSearch, getUsersCount, getUsersId } = require('../../model/transfer')
const helper = require('../../helper/index')
const qs = require('querystring')

const getPrevLink = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = { page: page - 1 }
    const resultPrevLink = { ...currentQuery, ...generatedPage }
    return qs.stringify(resultPrevLink)
  } else {
    return null
  }
}
const getNextLink = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatedPage = { page: page + 1 }
    const resultNextLink = { ...currentQuery, ...generatedPage }
    return qs.stringify(resultNextLink)
  } else {
    return null
  }
}

module.exports = {

  get_user: async (request, response) => {
    let { page, search, id_user_login } = request.query
    // const search = request.body.search
    // const id_user_login = request.body.id_user_login
    page = parseInt(page)
    let limit = 4
    let totalData = await getUsersCount()
    let totalPage = Math.ceil(totalData[0].total_user / limit)
    let offset = page * limit - limit
    let prevLink = getPrevLink(page, request.query)
    let nextLink = getNextLink(page, totalPage, request.query)
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
      prevLink: prevLink && `${process.env.ip}:${process.env.port}/transfer?${prevLink}`,
      nextLink: nextLink && `${process.env.ip}:${process.env.port}/transfer?${nextLink}`
    }
    try {
      const data = await getUsersSearch(id_user_login, search, limit, offset)
      return helper.response(response, 200, 'Get users success', data, pageInfo)
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  get_user_id: async (request, response) => {
    let id = request.params.id
    try {
      const data = await getUsersId(id)
      return helper.response(response, 200, 'Get users success', data)
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  }

}
