const router = require("express").Router()
const paypal = require("paypal-rest-sdk")

paypal.configure({ //This is important
    "mode" : "sandbox" , // or "live" for production
    "client_id" : process.env.CLIENT_ID , // sandbox data , in live here goes the real data
    "client_secret" : process.env.CLIENT_SECRET // sandbox data , in live here goes the real data
})

var createPay = ( payment ) => { // Payment function . It Is gonna be used below
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}	

router.get("/" , (req , res) => res.render("index"))

router.get("/pay" , async(req , res) => {

    var payment = { // Create payment object 
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.SUCCESS_URL, // or the url that you want
            "cancel_url": process.env.ERROR_URL // or the url that you want
        },
        "transactions": [{
            "amount": {
                "total": 40.00,
                "currency": "USD"
            }
         }]   
    }

    createPay( payment ) // Initialize payment
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect('/pay/error');
        });
})

router.get("/pay/success" , (req , res) => {
    req.flash("success_msg" , "Done !")
    res.redirect("/")
})

router.get("/pay/error" , (req , res) => {
    req.flash("error_msg" , "Sorry , some error ocurred")
    res.redirect("/")
})

module.exports = router