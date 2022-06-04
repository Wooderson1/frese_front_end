module.exports = function(inputtxt)
{
  var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  return !!inputtxt.match(phoneno);
}
