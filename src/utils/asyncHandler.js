const asyscHandler= (requestHandler) =>{
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

export default asyscHandler 

// const asyscHandler =() => {}
// const asyscHandler = (func) => () => {}
// const asyscHandler = (func) => async () => {}

// const asyscHandler = (fn) => async (req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }