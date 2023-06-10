const IMG_PATH = "/images";


/**
 * Returns the absolute path of an image, by
 * appending it's name to the path
 * @param {string} image
 * @returns {string}
 */
export const imagePath = (image) => {
  return `${IMG_PATH}/${image}`;
};
