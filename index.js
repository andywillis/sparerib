require('colors');
require('draftlog').into(console);

const fs = require('fs');
const request = require('request');

const stack = [];
let count = 0;
let interval;
const limit = 3;

// Create stack of endpoints
for (let i = 1; i <= 239; i++) {
  const endpoint = `https://data.journalarchives.jisc.ac.uk/media_open/pdf/generated/sparerib/P.523_344_Issue${i}/PDF/P.523_344_Issue${i}_9999.pdf`;
  stack.push({ id: i, endpoint });
}

function main() {

  // Pick off endpoints to download - max of 3 at a time
  if (stack.length && count < limit) {

    const { id, endpoint } = stack.shift();
    const status = console.draft();
    const filename = endpoint.split('/').pop();
    const stream = request(endpoint);

    status(`${filename}...`);
    count++;

    stream.pipe(fs.createWriteStream(`out/Spare Rib - P.523_344_Issue${id}_9999.pdf`));
    stream.on('error', err => console.log(err));
    stream.on('end', () => {
      count--;
      status([`${filename}...`, ' ✓'.green].join(''));
    });

  }

  if (!stack.length) {
    clearInterval(interval);
  }

}

interval = setInterval(main, 2000);
