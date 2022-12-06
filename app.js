const fs = require('fs');
const ShoppingCart = require('./models/shoppingCart');
const Receipt = require('./models/receipt');
const manageError = require('./utils/manageError');

const filename = process.argv[2];

if (process.argv.length < 3) {
  return manageError('fatal', [
    'Missing file', 
    'Add it as next parameter',
  ]);
}

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) {
    return manageError('fatal', [
      'Something went wrong', 
      'Verify that the file exists and has the right permissions',
    ])
  } else {
    const shoppingCart = new ShoppingCart(data.split("\n"));
    const validation = shoppingCart.validateLines();
    const lines = [];

    validation.some((singleLine, i)=>{
      if(singleLine.error){
        return manageError('fatal', [
          'Something went wrong', 
          `Verify the file ${i+1}`,
          singleLine.error,
        ])
      }else{
        lines.push(singleLine.line);
      }
    });

    const receipt = new Receipt(lines);
    receipt.printReceipt();
    process.exit();
  }
});
