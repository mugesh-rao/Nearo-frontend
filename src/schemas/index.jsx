import * as Yup from "yup";

// signupSchema===========

// this is only for start selling personal details
export const signupSchema = Yup.object({
  name:Yup.string()
  .matches(
      /^[A-Za-z ]*$/,
      "Please enter a valid name, do not use numbers & symbols"
  )
  .min(3)
  .max(40)
  .required("Please enter your name"),
  email: Yup.string().email().required("Please Enter Your Email"),
  phoneNumber: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must start with 6, 7, 8, or 9 and have 10 digits in total"
    )
    .test(
      "uniqueDigits",
      "Phone number cannot have all digits the same",
      (value) => {
        return !/^(.)\1*$/.test(value);
      }
    )
    .required("Phone number is required"),
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  otp: Yup.string().min(6).max(6).required("please enter otp"),
});

// this is only for sign up  shopdetails schema ===========start selling

export const shopSchema = Yup.object({
  // shopName: Yup.string()
  //   .matches(
  //     /^[A-Za-z ]*$/,
  //     "Please enter a valid name, do not use numbers & symbols"
  //   )
  //   .min(3)
  //   .max(40)
  //   .test(
  //     "is-capitalized",
  //     "Please capitalize the first letter of your shop name",
  //     (value) => {
  //       // Check if the first letter is capitalized
  //       return /^[A-Z]/.test(value);
  //     }
  //   )
  //   .required("Please enter your shop name"),
  shopName: Yup.string()
  .matches(
      /^[A-Za-z ]*$/,
      "Please enter a valid name, do not use numbers & symbols"
  )
  .min(3)
  .max(40)
  .required("Please enter your shop name"),
  category: Yup.string().required("Select shop category"),

  GstNumber: Yup.string().min(15).max(15)
  .matches(/^[A-Z0-9]*$/, 'GST Number can only contain capital letters and numbers')
  .required('Enter Your GST Number'),

  pickup: Yup.string()
    .min(15)
    .max(100)
    .matches(
      /^[a-zA-Z0-9\s,.'-]+$/,
      "Address can only contain letters, numbers, and common punctuation."
    )
    .required("Please enter your pickup address"),
  shopAdd: Yup.string()
    .min(15)
    .max(100)
    .matches(
      /^[a-zA-Z0-9\s,.'-]+$/,
      "Shop address can only contain letters, numbers, and common punctuation."
    )
    .required("Please enter your shop address"),
  pincode: Yup.string().min(6).max(6).required("Please enter your pin"),
  city: Yup.string()
    .matches(
      /^[A-Za-z ]*$/,
      "Please enter valid name do not use numbers & symbols"
    )
    .min(2)
    .max(40)
    .required("Please enter your city"),
  state: Yup.string().required("Select your state"),
});

//this is only for sign up  bank details ValidityState==== of start seling

export const bankSchema = Yup.object({
  account: Yup.string()
    .min(10)
    .max(20)
    .required("Please Enter Valid Account Number"),
  holder: Yup.string()
    .matches(
      /^[A-Za-z ]*$/,
      "Please enter a valid name, do not use numbers & symbols"
    )
    .min(3)
    .max(40)
    .test(
      "is-capitalized",
      "Please capitalize the first letter of your name",
      (value) => {
        // Check if the first letter is capitalized
        return /^[A-Z]/.test(value);
      }
    )
    .required("Please enter your name"),
  ifsc: Yup.string().min(11).max(11)
    .matches(
      /^([A-Z]{4}[0][A-Z0-9]{6})$/,
      "Invalid IFSC Code use Capital letters"
    )
    .required("please enter your IFSC Code"),

  pan: Yup.string().min(10).max(10).matches(
    /^([A-Z]{5}[0-9]{4}[A-Z]{1})$/,
    "Invalid PAN Number"
  ),

  file: Yup.mixed()
  .required('Image is required')
  .test('fileSize', 'File size must be less than 50KB', (value) => {
    return value && value.size <= 50000;
  }),
});
// =====this is for only page login
export const loginSchema = Yup.object({
  email: Yup.string().min(5).max(40).required("Please Enter a Valid id"),
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const forgetSchema=Yup.object({
  email: Yup.string().min(5).max(40).required("Please Enter a Valid id"),
})
export const forgetPassword=Yup.object({
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
    otp: Yup.array()
    .of(Yup.string().length(1, "Must be a single digit"))
    .required("Please enter the OTP"),


})

// ====profile schema==========
function getMinutesFromTimeString(timeString) {
  const [hours, minutes, period] = timeString
    .match(/(\d{1,2}):(\d{2})(am|pm)/i)
    .slice(1);

  let hours24 = parseInt(hours, 10);
  if (period.toLowerCase() === "pm" && hours24 !== 12) {
    hours24 += 12;
  } else if (period.toLowerCase() === "am" && hours24 === 12) {
    hours24 = 0;
  }

  return hours24 * 60 + parseInt(minutes, 10);
}
export const profileSchema = Yup.object({
  shop_name: Yup.string()
    .required("Shop name is required")
    .matches(/^[\w\d\s-]+$/, "Invalid shop name format")
    .min(2, "Shop name is too short")
    .max(50, "Shop name is too long"),

  shop_category: Yup.string().required("Select shop category"),
  // shop_contact: Yup.string()
  //   .min(10)
  //   .max(10)
  //   .required("Please Enter Your Phone Number"),

  shop_address: Yup.string()
  .min(10)
  .max(100)
  .matches(
    /^[a-zA-Z0-9\s,.'-]+$/,
    "Shop address can only contain letters, numbers, and common punctuation."
  )

  // START FOR TIMINGS ====================================
  // shop_timings: Yup.array().of(
  //   Yup.object().shape({
  //     MondayopenTime: Yup.string().required(),
  //     MondaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     TuesdayopenTime: Yup.string().required(),
  //     TuesdaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     WednesdayopenTime: Yup.string().required(),
  //     WednesdaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     ThursdayopenTime: Yup.string().required(),
  //     ThursdaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     FridayopenTime: Yup.string().required(),
  //     FridaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     SaturdayopenTime: Yup.string().required(),
  //     SaturdaycloseTime: Yup.string().required(),
  //   }),
  //   Yup.object().shape({
  //     SundayopenTime: Yup.string().required(),
  //     SundaycloseTime: Yup.string().required(),
  //   })
  // ),

  // OpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // CloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { sundayOpenTime } = this.parent;

  //       if (!sundayOpenTime || !value) {
  //         // Skip validation if either sundayOpenTime or sundayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(sundayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // mondayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // mondayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { mondayOpenTime } = this.parent;

  //       if (!mondayOpenTime || !value) {
  //         // Skip validation if either mondayOpenTime or mondayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(mondayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // tuesdayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // tuesdayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { tuesdayOpenTime } = this.parent;

  //       if (!tuesdayOpenTime || !value) {
  //         // Skip validation if either tuesdayOpenTime or tuesdayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(tuesdayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // // Repeat the pattern for remaining days of the week

  // wednesdayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // wednesdayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { wednesdayOpenTime } = this.parent;

  //       if (!wednesdayOpenTime || !value) {
  //         // Skip validation if either wednesdayOpenTime or wednesdayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(wednesdayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // thursdayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // thursdayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { thursdayOpenTime } = this.parent;

  //       if (!thursdayOpenTime || !value) {
  //         // Skip validation if either thursdayOpenTime or thursdayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(thursdayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // fridayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // fridayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { fridayOpenTime } = this.parent;

  //       if (!fridayOpenTime || !value) {
  //         // Skip validation if either fridayOpenTime or fridayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(fridayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),

  // saturdayOpenTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid opening time")
  //   .required("Opening time is required"),

  // saturdayCloseTime: Yup.string()
  //   .matches(/^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/i, "Invalid closing time")
  //   .required("Closing time is required")
  //   .test(
  //     "closing-time",
  //     "Closing time must be after opening time",
  //     function (value) {
  //       const { saturdayOpenTime } = this.parent;

  //       if (!saturdayOpenTime || !value) {
  //         // Skip validation if either saturdayOpenTime or saturdayCloseTime is not provided
  //         return true;
  //       }

  //       const openingTimeMinutes = getMinutesFromTimeString(saturdayOpenTime);
  //       const closingTimeMinutes = getMinutesFromTimeString(value);

  //       return closingTimeMinutes > openingTimeMinutes;
  //     }
  //   ),
  // profile: Yup.string(),
  // banner:Yup.string(),
  // banner: Yup.array()
  //   .of(Yup.mixed())
  //   .test("fileType", "Invalid file format", (value) => {
  //     if (!value) return false;
  //     for (let i = 0; i < value.length; i++) {
  //       if (["image/jpeg", "image/png"].indexOf(value[i].type) === -1) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   })
});

export const ChangePass = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
export const newBank = Yup.object({
  newAccount: Yup.string()
    .min(10)
    .max(20)
    .required("Please Enter your Account No"),
  newIfsc: Yup.string()
    .matches(
      /^([A-Z]{4}[0][A-Z0-9]{6})$/,
      "Invalid IFSC Code use Capital letters"
    )
    .required("please enter your IFSC Code"),
  newHolder: Yup.string()
    .min(3)
    .max(30)
    .matches(
      /^[A-Za-z ]*$/,
      "Please enter valid name dont use numbers & symbols"
    )
    .required("Please Enter AC-holder Name"),
});

export const list_product_schema = Yup.object({
  product_title: Yup.string()
    .min(10)
    .max(200)
    .required("enter your product name"),
  // category_id: Yup.array().min(4).max(4).required("Select All category"),

  hsn_code: Yup.string().min(4).max(20).required("HSN code is required"),

  gst_category_id: Yup.string().required("Select your gst"),

  low_stock: Yup.string().required("enter a valid stock"),

  product_discount: Yup.string().min(1).max(2).required("enter valid discount"),

  return_period_time: Yup.string().required("time is required"),

  product_market_price: Yup.string().min(1).max(10).required("enter MRP"),

  // product_price: Yup.string().min(1).max(10).required("enter discount and MRP"),

  product_weight: Yup.string().required("weight is required"),

  // country_origin: Yup.string().required("select country origin"),

  manufactured_by: Yup.string().required("enter your product manu.."),

  // variation_attribute_value_id: Yup.array().required("necessary to fill")
});
