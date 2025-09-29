
// import ApiError from "./ApiError.js";

// const generateTokens = async (userId) => {
//     try {
        
//         const user = await User.findById(userId);

//         if(!user) throw new ApiError(400, "User not Found");

//         const accessToken = await user.generateAccessToken();
//         const refreshToken = await user.generateRefreshToken();

//         user.refreshToken = refreshToken;

//         await user.save({ validateBeforeSave : false});

//         // console.log("accessToken :- ", accessToken);
//         // console.log("refereshToken :- ", refreshToken);


//         return {accessToken , refreshToken};
        
//     } catch (error) {
//         console.error("Error in generateAdminTokens:", error);
//         throw new ApiError(500 , error.message || "Something went wrong while generating admin tokens");        
//     }
// }

// export default  generateTokens  ;

