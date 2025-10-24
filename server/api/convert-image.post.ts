
export default defineEventHandler(async (event) => {
  try {
    // Read the multipart form data from the original browser request
    const multipart = await readMultipartFormData(event);

    // Create a new FormData object to send to the Laravel backend
    const formData = new FormData();

    // Extract the image file and format, then append them to the new FormData
    const imageFile = multipart?.find(el => el.name === 'image');
    const format = multipart?.find(el => el.name === 'format');

    if (!imageFile || !format) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Missing image or format field.',
      });
    }

    // Append the file with its original name and type
    formData.append('image', new Blob([imageFile.data], { type: imageFile.type }), imageFile.filename);
    formData.append('format', new TextDecoder().decode(format.data));

    // 1. Forward the request to the Laravel backend
    const laravelResponse = await $fetch('http://127.0.0.1:8000/api/image/convert', {
      method: 'POST',
      body: formData,
    });

    // 2. Get the download URL from the Laravel response
    const downloadUrl = laravelResponse.data.download_url;
    if (!downloadUrl) {
      throw new Error('Conversion failed: No download URL was returned from the backend.');
    }

    // 3. Fetch the converted image from the download URL as a Blob
    const imageBlob = await $fetch(downloadUrl, { responseType: 'blob' });

    // 4. Convert the Blob to a Buffer to ensure consistent handling in Node.js
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

    // 5. Set the correct content-type header and return the Buffer
    setResponseHeader(event, 'Content-Type', imageBlob.type);
    return imageBuffer;
  } catch (error) {
    console.error('Error in proxy endpoint:', error);
    // Forward the error to the client
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Proxy Error: ${error.message}`,
    });
  }
});
