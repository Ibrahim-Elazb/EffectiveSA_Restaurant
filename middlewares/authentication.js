const HTTPError = require("../utils/HTTPError");

// @ts-nocheck
const roles = { cashierRole: "cashier", adminRole: "admin"}

const isAuthorized = (authRoles) => {
    return (request, response, next) => {
        if (!request.session.user || !request.session.user.role){
            response.redirect(`/dashboard/login`)
        }
        const {role}=request.session.user;
        if(!authRoles.includes(role))
            next(new HTTPError(403,"You don't have authority to do this action"))
        
        next()
    }
}

module.exports = { isAuthorized, roles };