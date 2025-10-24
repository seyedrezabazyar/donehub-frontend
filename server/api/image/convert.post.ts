import { defineEventHandler, readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  // Get the runtime config
  const { laravelBackendUrl } = useRuntimeConfig()

  // 1. Read the multipart form data from the incoming request
  const formDataArray = await readMultipartFormData(event)
  if (!formDataArray || formDataArray.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No form data received.',
    })
  }

  // 2. Reconstruct the FormData to send to the Laravel backend
  const formData = new FormData()
  formDataArray.forEach((part) => {
    formData.append(part.name, new Blob([part.data], { type: part.type }), part.filename)
  })

  try {
    // 3. Forward the request to the Laravel backend
    const apiResponse = await $fetch.raw(`${laravelBackendUrl}/api/image/convert`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })

    const responseData = apiResponse._data
    if (!responseData?.data?.download_url) {
      throw new Error('Invalid API response or download URL missing.')
    }

    const downloadUrl = responseData.data.download_url

    // 4. Fetch the converted image from the download URL
    const imageResponse = await $fetch.raw(downloadUrl)
    const imageBlob = imageResponse._data

    if (!imageBlob) {
        throw new Error('Failed to download the converted image.')
    }

    // 5. Return the image blob directly to the frontend
    // Set appropriate headers for the client to interpret the response as an image
    event.node.res.setHeader('Content-Type', imageResponse.headers.get('content-type') || 'application/octet-stream')
    event.node.res.setHeader('Content-Disposition', imageResponse.headers.get('content-disposition') || `attachment; filename="converted-image"`)

    return imageBlob
  } catch (error) {
    console.error('Error proxying to Laravel:', error)
    const statusCode = error.response?.status || 500
    const statusMessage = error.response?._data?.message || 'Internal Server Error'

    throw createError({
      statusCode,
      statusMessage: `Failed to convert image. Reason: ${statusMessage}`,
    })
  }
})
