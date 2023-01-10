const { User } = require('../models')
const { verifyToken } = require('../helpers/jwt')

const authentication = async (req, res, next) => {
  try {
    const token = req.get("token") //headers
    const userDecoded = verifyToken(token)
    const user = await User.findOne({
      where: {
        id: userDecoded.id,
        email: userDecoded.email
      }
    })
    if (!user) {
      return res.status(401).json({
        name: "Authentication Error",
        message: "Error Authentication"
      })
    }
    res.locals.user = user //for authorization purpose
    return next()
  } catch (err) {
    return res.status(401).json(err)
  }
}

module.exports = authentication
