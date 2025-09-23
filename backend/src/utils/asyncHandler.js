const asyncHandler = (requestHandler) => { // Higher-order function jo ek async route handler ko leta hai
    return (req, res, next) => { // Ye actual Express middleware function hai jo req, res, next ko handle karta hai
        Promise.resolve(                     // requestHandler ko promise bana ke resolve karta hai
            requestHandler(req, res, next)   // Ye tera actual async route handler function call karta hai
        ).catch((err) => next(err))          // Agar koi error aata hai, toh usse Express ke error handler ko de deta hai
    }
}


export default asyncHandler 

// const asyscHandler =() => {}
// const asyscHandler = (func) => () => {}
// const asyscHandler = (func) => async () => {}

// const asyscHandler = (fn) => async (req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }