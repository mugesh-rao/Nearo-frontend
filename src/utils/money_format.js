


export const money_format = (money) => {

    const {format}=new Intl.NumberFormat('hi-in',{
        style:'currency'
        ,currency:"INR"
    })

  return format(money)
}


