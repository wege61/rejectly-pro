import fs from "fs";

function findAllJPEGs(buf: Buffer): Buffer[] {
  const results: Buffer[] = [];
  let offset = 0;

  while (offset < buf.length - 3) {
    if (
      buf[offset] === 0xff &&
      buf[offset + 1] === 0xd8 &&
      buf[offset + 2] === 0xff
    ) {
      let end = offset + 3;
      let found = false;
      while (end < buf.length - 1) {
        if (buf[end] === 0xff && buf[end + 1] === 0xd9) {
          const jpegData = Buffer.from(buf.subarray(offset, end + 2));
          results.push(jpegData);
          offset = end + 2;
          found = true;
          break;
        }
        end++;
      }
      if (!found) break;
    } else {
      offset++;
    }
  }

  return results;
}

// Just pass any local PDF for testing 
const pdfBytes = fs.readFileSync("/Users/alp179/Downloads/Климова_Ангелина (1).pdf");
const jpegs = findAllJPEGs(pdfBytes);
console.log(`Found ${jpegs.length} JPEGs`);

jpegs.forEach((jpeg, idx) => {
  fs.writeFileSync(`/Users/alp179/Downloads/rejectly-pro/extracted-${idx}.jpg`, jpeg);
  console.log(`Written extracted-${idx}.jpg (${jpeg.length} bytes)`);
});
