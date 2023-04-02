export const fetchUrltoBytes = async (imageUrl) => {
  return await fetch(imageUrl)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const base64String = Buffer.from(buffer).toString("base64");
      return base64String;
    });
};
