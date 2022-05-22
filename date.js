//jshint eversion:6
// console.log(module);

  //when we use open brackets after a function name, then we are calling that fucntion.

exports.getDate = function() {

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",

    };

    return today.toLocaleDateString("en-US", options);
    
}

exports.getDay = function(){
    const today = new Date();
    const options = {
        weekday: "long"
    };
    return today.toLocaleDateString("en-US", options);
}

console.log(module.exports);